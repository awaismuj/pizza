import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  clearPaymentIdempotencyKey,
  createOrderRazorpay,
  getPaymentIdempotencyKey,
  updateTable,
  verifyPaymentRazorpay,
  validatePosCoupon,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import useTaxRate from "../../hooks/useTaxRate";
import PendingReceipt from "./PendingReceipt";
import KitchenSlip from "./KitchenSlip";
import { useUITheme } from "../../context/UIThemeContext";
import { MdAttachMoney, MdCreditCard, MdPrint } from "react-icons/md";

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
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const discountedSubtotal = Math.max(0, total - couponDiscount);
  const tax = (discountedSubtotal * taxRate) / 100;
  const totalPriceWithTax = discountedSubtotal + tax;
  const paymentFingerprint = JSON.stringify({
    amount: Math.round(totalPriceWithTax * 100),
    items: cartData.map((item) => [
      item.dishId || item.dealId || item._id || item.id,
      item.quantity,
      item.size,
      item.crust,
    ]),
    coupon: appliedCoupon?.code || "",
  });

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

  useEffect(() => {
    setAppliedCoupon(null);
  }, [cartData, customerData.customerPhone]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      enqueueSnackbar("Enter a coupon code.", { variant: "warning" });
      return;
    }
    if (String(customerData.customerPhone || "").replace(/\D/g, "").length < 7) {
      enqueueSnackbar("Enter a valid mobile number to use a coupon.", { variant: "warning" });
      return;
    }
    setValidatingCoupon(true);
    try {
      const response = await validatePosCoupon({
        code: couponInput,
        phone: customerData.customerPhone || "",
        items: cartData.map((item) => ({
          dishId: item.dishId,
          dealId: item.dealId,
          quantity: item.quantity,
          size: item.size,
          crust: item.crust,
        })),
      });
      setAppliedCoupon({
        code: response.data.data.code,
        discountAmount: response.data.data.discountAmount,
      });
      enqueueSnackbar("Coupon applied.", { variant: "success" });
    } catch (error) {
      setAppliedCoupon(null);
      enqueueSnackbar(error?.response?.data?.message || "Coupon could not be applied.", { variant: "error" });
    } finally {
      setValidatingCoupon(false);
    }
  };

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

        const { data } = await createOrderRazorpay(
          reqData,
          getPaymentIdempotencyKey(paymentFingerprint)
        );

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
                  total: discountedSubtotal,
                  tax: tax,
                  totalWithTax: totalPriceWithTax,
                },
                items: cartData,
                couponCode: appliedCoupon?.code,
                table: customerData.table.tableId,
                paymentMethod: paymentMethod,
                paymentData: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                },
              };

              // The customer has already paid, so place the order right
              // away instead of leaving a gap where the page can be closed.
              orderMutation.mutate(orderData);
            } catch (verifyError) {
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
        enqueueSnackbar(error?.response?.data?.message || error.message || "Payment failed to start.", {
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
          total: discountedSubtotal,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        couponCode: appliedCoupon?.code,
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyProfit"] });

      // Book the table straight away. The cart used to stay on screen (and
      // Place Order stayed clickable) until this finished, which left a
      // window where a second click placed the same order twice.
      tableUpdateMutation.mutate({
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      });
      dispatch(removeCustomer());
      dispatch(removeAllItems());

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
      clearPaymentIdempotencyKey();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error) => {
      // The order itself is saved; only the table marker failed.
      enqueueSnackbar(
        error?.response?.data?.message || "Order placed, but the table could not be marked as booked. Check the Tables page.",
        { variant: "warning", autoHideDuration: 6000 }
      );
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });

  return (
    <>
<<<<<<< HEAD
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
          <div
            className={`flex items-center justify-between pt-2 border-t text-sm font-bold ${
              isClean ? "border-slate-200 text-slate-900" : "border-slate-800 text-white"
            }`}
          >
            <span className={isClean ? "text-slate-900 font-extrabold" : "text-amber-400"}>
              Payable Total
            </span>
            <span
              className={`font-mono text-base font-black ${
                isClean ? "text-amber-600" : "text-amber-400"
              }`}
            >
              Rs {totalPriceWithTax.toFixed(2)}
            </span>
          </div>
        </div>
=======
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Items({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          Rs {total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center gap-2 px-5 mt-3">
        <input
          aria-label="Coupon code"
          placeholder="Coupon code"
          value={couponInput}
          onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
          disabled={Boolean(appliedCoupon)}
          className="min-w-0 flex-1 rounded bg-[#1f1f1f] px-3 py-2 text-sm text-white outline-none"
        />
        {appliedCoupon ? (
          <button className="text-sm text-red-300" onClick={() => setAppliedCoupon(null)}>Remove</button>
        ) : (
          <button
            disabled={validatingCoupon || cartData.length === 0}
            onClick={handleApplyCoupon}
            className="rounded bg-[#383737] px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {validatingCoupon ? "Checking…" : "Apply"}
          </button>
        )}
      </div>
      {appliedCoupon && (
        <div className="flex items-center justify-between px-5 mt-2 text-sm text-green-300">
          <span>{appliedCoupon.code} discount</span>
          <span>−Rs {couponDiscount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Tax({taxRate}%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">Rs {tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Total With Tax
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          Rs {totalPriceWithTax.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
            paymentMethod === "Cash" ? "bg-[#383737]" : ""
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
            paymentMethod === "Online" ? "bg-[#383737]" : ""
          }`}
        >
          Online
        </button>
      </div>
>>>>>>> origin/main

        {/* Payment Method Selector */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("Cash")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
              paymentMethod === "Cash"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                : isClean
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <MdAttachMoney size={16} />
            <span>Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("Online")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
              paymentMethod === "Online"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                : isClean
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <MdCreditCard size={16} />
            <span>Online / Card</span>
          </button>
        </div>

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
            disabled={orderMutation.isPending || cartData.length === 0}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-95 disabled:opacity-40"
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
          discountedSubtotal={discountedSubtotal}
          couponDiscount={couponDiscount}
          couponCode={appliedCoupon?.code}
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
