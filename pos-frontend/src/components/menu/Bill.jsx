import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  updateOrderItems,
  verifyPaymentRazorpay,
  printKitchenRaw,
  printReceiptRaw,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import useTaxRate from "../../hooks/useTaxRate";
import PendingReceipt from "./PendingReceipt";
import KitchenSlip from "./KitchenSlip";
import CustomerInfoModal from "../modern/CustomerInfoModal";
import { useUITheme } from "../../context/UIThemeContext";
import { MdAttachMoney, MdCreditCard, MdPrint, MdCallSplit, MdAdd, MdDelete, MdCheckCircle, MdStars } from "react-icons/md";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const { taxRate } = useTaxRate();
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [redeemPoints, setRedeemPoints] = useState(false);
  const maxRedeemablePoints = Math.min(
    customerData.loyaltyPoints || 0,
    Math.floor(totalPriceWithTax / 5)
  );
  const loyaltyDiscount = redeemPoints ? maxRedeemablePoints * 5 : 0;
  const netPayableTotal = Math.max(0, Math.round((totalPriceWithTax - loyaltyDiscount) * 100) / 100);

  const [paymentMethod, setPaymentMethod] = useState();
  const [orderInfo, setOrderInfo] = useState();
  const [splitRows, setSplitRows] = useState([
    { id: 1, method: "Cash", amount: "" },
    { id: 2, method: "Card", amount: "" },
  ]);
  // Fires once the order is actually placed — the Kitchen Order Slip (items
  // + quantities only) that gets sent to the kitchen printer so prep can
  // start straight away. The full priced bill only prints later, when the
  // table is cleared (see OrderCard.jsx) — that's the second and last of
  // the two prints a table order gets.
  const [showKitchenSlip, setShowKitchenSlip] = useState(false);
  const [showPendingReceipt, setShowPendingReceipt] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const splitTotal = splitRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const splitDifference = Math.round((netPayableTotal - splitTotal) * 100) / 100;

  const handleSelectSplit = () => {
    setPaymentMethod("Split");
    if (!splitRows[0].amount && !splitRows[1].amount && netPayableTotal > 0) {
      const half = Math.floor(netPayableTotal / 2);
      const remainingHalf = Math.round((netPayableTotal - half) * 100) / 100;
      setSplitRows([
        { id: 1, method: "Cash", amount: half },
        { id: 2, method: "Card", amount: remainingHalf },
      ]);
    }
  };

  const handleSplitRowChange = (id, field, value) => {
    setSplitRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddSplitRow = () => {
    const nextAmount = splitDifference > 0 ? splitDifference : "";
    setSplitRows((prev) => [
      ...prev,
      { id: Date.now(), method: "Digital Wallet", amount: nextAmount },
    ]);
  };

  const handleRemoveSplitRow = (id) => {
    if (splitRows.length <= 2) {
      enqueueSnackbar("At least 2 payment split lines are required.", { variant: "info" });
      return;
    }
    setSplitRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePlaceOrder = async () => {
    // Enforce mandatory Customer Name and Mobile Phone
    const hasValidName =
      customerData.customerName &&
      customerData.customerName.trim().length >= 2 &&
      customerData.customerName !== "Customer Name" &&
      customerData.customerName !== "Walk-In Guest" &&
      customerData.customerName !== "Walk-In Customer";

    const cleanDigits = (customerData.customerPhone || "").replace(/\D/g, "");
    const hasValidPhone =
      cleanDigits.length >= 10 &&
      !cleanDigits.includes("0000000000") &&
      customerData.customerPhone !== "N/A";

    if (!hasValidName || !hasValidPhone) {
      if (!hasValidName) {
        enqueueSnackbar("Customer Name is mandatory to place order!", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Customer Mobile Number is mandatory to place order!", {
          variant: "warning",
        });
      }
      setIsCustomerModalOpen(true);
      return;
    }

    if (customerData.existingOrderId) {
      updateOrderMutation.mutate({
        orderId: customerData.existingOrderId,
        items: cartData,
      });
      return;
    }

    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });

      return;
    }

    if (paymentMethod === "Online") {
      // load the script
      try {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", {
            variant: "warning",
          });
          return;
        }

        // create order

        const reqData = {
          amount: totalPriceWithTax.toFixed(2),
        };

        const { data } = await createOrderRazorpay(reqData);

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "GenZ Pizza Land",
          description: "Secure Payment for Your Order",
          order_id: data.order.id,
          handler: async function (response) {
            // This callback runs after Razorpay itself confirms the charge,
            // so a failure here must never fail silently — the customer has
            // already been charged. Any verification error is now caught
            // and surfaced instead of being swallowed by an unhandled
            // rejection (which used to leave the order un-placed with no
            // feedback to the cashier at all).
            try {
              const verification = await verifyPaymentRazorpay(response);

              if (!verification?.data?.success) {
                enqueueSnackbar(
                  "Payment could not be verified. Do not mark this order as paid — check Razorpay before retrying.",
                  { variant: "error", autoHideDuration: 8000 }
                );
                return;
              }

              enqueueSnackbar(verification.data.message, { variant: "success" });

              // Place the order
              const orderData = {
                customerDetails: {
                  name: customerData.customerName,
                  phone: customerData.customerPhone,
                  guests: customerData.guests,
                },
                orderStatus: "In Progress",
                bills: {
                  total: total,
                  tax: tax,
                  discount: loyaltyDiscount,
                  redeemedLoyaltyPoints: redeemPoints ? maxRedeemablePoints : 0,
                  totalWithTax: netPayableTotal,
                },
                items: cartData,
                table: customerData.table?.tableId,
                tables: customerData.table?.tableIds || (customerData.table?.tableId ? [customerData.table.tableId] : []),
                combinedTableNos: customerData.table?.combinedTableNos || "",
                paymentMethod: paymentMethod,
                paymentData: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                },
              };

              setTimeout(() => {
                orderMutation.mutate(orderData);
              }, 1500);
            } catch (verifyError) {
              console.log(verifyError);
              enqueueSnackbar(
                "Payment was charged but verification failed to reach the server. Note the Razorpay payment ID and place this order manually.",
                { variant: "error", autoHideDuration: 10000 }
              );
            }
          },
          prefill: {
            name: customerData.customerName,
            email: "",
            contact: customerData.customerPhone,
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Payment Failed!", {
          variant: "error",
        });
      }
    } else if (paymentMethod === "Split") {
      const validRows = splitRows.filter((r) => Number(r.amount) > 0);
      if (validRows.length < 2) {
        enqueueSnackbar("Please configure at least 2 split payment lines.", { variant: "warning" });
        return;
      }
      if (Math.abs(splitDifference) > 1) {
        enqueueSnackbar(
          `Split amounts do not balance! Difference is Rs ${Math.abs(splitDifference)}. Total must equal Rs ${netPayableTotal.toFixed(2)}.`,
          { variant: "warning" }
        );
        return;
      }

      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total: total,
          tax: tax,
          discount: loyaltyDiscount,
          redeemedLoyaltyPoints: redeemPoints ? maxRedeemablePoints : 0,
          totalWithTax: netPayableTotal,
        },
        items: cartData,
        table: customerData.table?.tableId,
        tables: customerData.table?.tableIds || (customerData.table?.tableId ? [customerData.table.tableId] : []),
        combinedTableNos: customerData.table?.combinedTableNos || "",
        paymentMethod: "Split",
        splitPayments: validRows.map((r) => ({
          method: r.method,
          amount: Number(r.amount),
          paidAt: new Date(),
        })),
      };
      orderMutation.mutate(orderData);
    } else {
      // Place the order

      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total: total,
          tax: tax,
          discount: loyaltyDiscount,
          redeemedLoyaltyPoints: redeemPoints ? maxRedeemablePoints : 0,
          totalWithTax: netPayableTotal,
        },
        items: cartData,
        table: customerData.table?.tableId,
        tables: customerData.table?.tableIds || (customerData.table?.tableId ? [customerData.table.tableId] : []),
        combinedTableNos: customerData.table?.combinedTableNos || "",
        paymentMethod: paymentMethod,
      };
      orderMutation.mutate(orderData);
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Attempt Zero-Click Hardware ESC/POS Kitchen Print
      printKitchenRaw({ orderData: data }).catch(() => {});

      // The order is paid for right now (Cash was just handed over, or the
      // Razorpay charge just went through) — the Payments/Profit/Home
      // dashboards should reflect that immediately, not next time someone
      // happens to reopen that tab.
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);

      // Update Table (both primary and any joined tables)
      const allTableIds = customerData.table?.tableIds && customerData.table.tableIds.length > 0
        ? customerData.table.tableIds
        : (data.table ? [data.table] : []);

      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
        tableIds: allTableIds,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
      // Send the kitchen order slip to print now — the order has been rung
      // in and is going into preparation, same as an online order does.
      setShowKitchenSlip(true);
    },
    onError: (error) => {
      // Most commonly this fires when an item in the cart is out of stock
      // (the backend blocks the whole order rather than partially deduct
      // inventory), so surface the real reason to the cashier instead of
      // failing silently.
      const message =
        error?.response?.data?.message || "Failed to place order. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: (reqData) => updateOrderItems(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["tables"]);
      enqueueSnackbar("Table order updated with new items!", { variant: "success" });
      setShowKitchenSlip(true);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update order items.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <>
      <div
        className={`p-4 space-y-3 transition duration-150 ${
          isClean ? "bg-slate-50/80 border-t border-slate-200/90" : "bg-slate-950/70"
        }`}
      >
        {/* Financial Summary */}
        <div className={`space-y-1.5 text-xs ${isClean ? "text-slate-600 font-medium" : "text-slate-400"}`}>
          <div className="flex items-center justify-between">
            <span>Subtotal ({cartData.length} lines)</span>
            <span className={`font-mono font-bold ${isClean ? "text-slate-900" : "text-white"}`}>
              Rs {total.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sales Tax ({taxRate}%)</span>
            <span className={`font-mono font-bold ${isClean ? "text-slate-900" : "text-white"}`}>
              Rs {tax.toFixed(2)}
            </span>
          </div>
          {customerData.loyaltyPoints > 0 && maxRedeemablePoints > 0 && (
            <div className="pt-1.5 pb-0.5">
              <button
                type="button"
                onClick={() => setRedeemPoints((prev) => !prev)}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                  redeemPoints
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs"
                    : isClean
                    ? "bg-amber-50 border-amber-200/80 text-amber-900 hover:bg-amber-100/70"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <MdStars size={15} />
                  <span>
                    {redeemPoints ? "Redeeming Loyalty Points" : `Redeem Loyalty Points (${customerData.loyaltyPoints} avail)`}
                  </span>
                </div>
                <span className="font-mono font-black">
                  {redeemPoints ? `-Rs ${loyaltyDiscount}` : `Save Rs ${maxRedeemablePoints * 5}`}
                </span>
              </button>
            </div>
          )}
          {redeemPoints && loyaltyDiscount > 0 && (
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
              <span>Loyalty Discount ({maxRedeemablePoints} pts)</span>
              <span className="font-mono font-bold">-Rs {loyaltyDiscount.toFixed(2)}</span>
            </div>
          )}
          <div
            className={`flex items-center justify-between pt-2 border-t text-sm font-bold ${
              isClean ? "border-slate-200 text-slate-900" : "border-slate-800 text-white"
            }`}
          >
            <span className={isClean ? "text-slate-900 font-bold" : "text-amber-400 font-bold"}>
              Payable Total
            </span>
            <span
              className={`font-mono text-base font-bold ${
                isClean ? "text-amber-600" : "text-amber-400"
              }`}
            >
              Rs {netPayableTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="grid grid-cols-3 gap-1.5 pt-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("Cash")}
            className={`py-2 px-2 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1 ${
              paymentMethod === "Cash"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-bold"
                : isClean
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <MdAttachMoney size={15} />
            <span>Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("Online")}
            className={`py-2 px-2 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1 ${
              paymentMethod === "Online"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                : isClean
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <MdCreditCard size={15} />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={handleSelectSplit}
            className={`py-2 px-2 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1 ${
              paymentMethod === "Split"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                : isClean
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <MdCallSplit size={15} />
            <span>Split Bill</span>
          </button>
        </div>

        {/* Split Payment Allocation Panel */}
        {paymentMethod === "Split" && (
          <div
            className={`p-3 rounded-xl border text-xs space-y-2.5 transition animate-fadeIn ${
              isClean
                ? "bg-amber-50/70 border-amber-200/90 text-slate-800"
                : "bg-amber-950/20 border-amber-500/30 text-amber-100"
            }`}
          >
            <div className="flex items-center justify-between font-bold pb-1 border-b border-amber-500/20">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <MdCallSplit size={14} /> Multi-Instrument Split
              </span>
              <button
                type="button"
                onClick={handleAddSplitRow}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                <MdAdd size={14} /> Add Line
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {splitRows.map((row, idx) => (
                <div key={row.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono w-3">{idx + 1}</span>
                  <select
                    value={row.method}
                    onChange={(e) => handleSplitRowChange(row.id, "method", e.target.value)}
                    className={`text-xs py-1 px-1.5 rounded-lg border font-medium outline-hidden ${
                      isClean
                        ? "bg-white border-slate-200 text-slate-800"
                        : "bg-slate-900 border-slate-700 text-slate-200"
                    }`}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </select>

                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1.5 text-[10px] text-slate-400 font-mono">Rs</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0.00"
                      value={row.amount}
                      onChange={(e) => handleSplitRowChange(row.id, "amount", e.target.value)}
                      className={`w-full text-xs py-1 pl-7 pr-2 rounded-lg border font-mono font-bold outline-hidden ${
                        isClean
                          ? "bg-white border-slate-200 text-slate-900 focus:border-amber-500"
                          : "bg-slate-900 border-slate-700 text-white focus:border-amber-400"
                      }`}
                    />
                  </div>

                  {splitRows.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSplitRow(row.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Remove line"
                    >
                      <MdDelete size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Split Balance Summary */}
            <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
              <div>
                <span>Allocated: </span>
                <span className="font-mono font-bold">Rs {splitTotal.toFixed(2)}</span>
              </div>
              {Math.abs(splitDifference) <= 0.05 ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <MdCheckCircle size={13} />
                  <span>Balanced</span>
                </div>
              ) : splitDifference > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Left: Rs {splitDifference.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const lastId = splitRows[splitRows.length - 1].id;
                      const cur = Number(splitRows[splitRows.length - 1].amount) || 0;
                      handleSplitRowChange(lastId, "amount", (cur + splitDifference).toFixed(2));
                    }}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30"
                  >
                    Auto Fill
                  </button>
                </div>
              ) : (
                <span className="text-rose-500 font-semibold">
                  Over: Rs {Math.abs(splitDifference).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}


        {/* Action Buttons: Print Receipt & Place Order */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setShowPendingReceipt(true)}
            disabled={cartData.length === 0}
            className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-40 ${
              isClean
                ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs"
                : "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
            }`}
          >
            <MdPrint size={16} />
            <span>Print Slip</span>
          </button>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={orderMutation.isPending || updateOrderMutation.isPending || cartData.length === 0}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95 disabled:opacity-40"
          >
            {orderMutation.isPending || updateOrderMutation.isPending
              ? "Saving..."
              : customerData.existingOrderId
              ? "Update Table Order →"
              : "Complete Order →"}
          </button>
        </div>
      </div>

      {showKitchenSlip && orderInfo && (
        <KitchenSlip orderInfo={orderInfo} onClose={() => setShowKitchenSlip(false)} />
      )}

      {showPendingReceipt && (
        <PendingReceipt
          customerData={customerData}
          cartData={cartData}
          total={total}
          tax={tax}
          taxRate={taxRate}
          totalPriceWithTax={totalPriceWithTax}
          onClose={() => setShowPendingReceipt(false)}
        />
      )}

      <CustomerInfoModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        initialData={customerData}
        title="Required Customer Details"
        tableInfo={customerData.table}
      />
    </>
  );
};

export default Bill;
