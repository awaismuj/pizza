import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import useTaxRate from "../../hooks/useTaxRate";
import PendingReceipt from "./PendingReceipt";
import KitchenSlip from "./KitchenSlip";

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

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const { taxRate } = useTaxRate();
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [orderInfo, setOrderInfo] = useState();
  // Fires once the order is actually placed — the Kitchen Order Slip (items
  // + quantities only) that gets sent to the kitchen printer so prep can
  // start straight away. The full priced bill only prints later, when the
  // table is cleared (see OrderCard.jsx) — that's the second and last of
  // the two prints a table order gets.
  const [showKitchenSlip, setShowKitchenSlip] = useState(false);
  // Prints the bill as it stands right now (before the order is placed) —
  // a kitchen/customer copy of what's currently in the cart.
  const [showPendingReceipt, setShowPendingReceipt] = useState(false);

  const handlePlaceOrder = async () => {
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
                  totalWithTax: totalPriceWithTax,
                },
                items: cartData,
                table: customerData.table.tableId,
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
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
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

      // The order is paid for right now (Cash was just handed over, or the
      // Razorpay charge just went through) — the Payments/Profit/Home
      // dashboards should reflect that immediately, not next time someone
      // happens to reopen that tab.
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
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

  return (
    <>
      <div className="p-4 bg-slate-950/70 space-y-3">
      {/* Financial Summary */}
      <div className="space-y-1.5 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>Subtotal ({cartData.length} lines)</span>
          <span className="text-white font-mono font-bold">Rs {total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Sales Tax ({taxRate}%)</span>
          <span className="text-white font-mono font-bold">Rs {tax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
          <span className="text-amber-400">Payable Total</span>
          <span className="text-amber-400 font-mono text-base font-extrabold">
            Rs {totalPriceWithTax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={() => setPaymentMethod("Cash")}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
            paymentMethod === "Cash"
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-extrabold"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
        >
          <span>💵 Cash</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("Online")}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
            paymentMethod === "Online"
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-extrabold"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
        >
          <span>💳 Online / Card</span>
        </button>
      </div>

      {/* Action Buttons: Print Receipt & Place Order */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={() => setShowPendingReceipt(true)}
          disabled={cartData.length === 0}
          className="py-3 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition disabled:opacity-40"
        >
          🖨️ Print Slip
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={orderMutation.isPending || cartData.length === 0}
          className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-40"
        >
          {orderMutation.isPending ? "Ringing In..." : "Complete Order →"}
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
    </>
  );
};

export default Bill;
