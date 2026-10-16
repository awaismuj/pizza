import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import MenuContainer from "../components/menu/MenuContainer";
import Invoice from "../components/invoice/Invoice";
import { addOrder, createOrderRazorpay, verifyPaymentRazorpay } from "../https";
import useTaxRate from "../hooks/useTaxRate";
import { useUITheme } from "../context/UIThemeContext";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// A separate, table-free order window for walk-in / takeaway customers —
// no name, phone, or table needed. Staff pick items and submit in one tap;
// the real customer's details are never asked for or stored, the order is
// just tagged "Walk-in Customer" under the hood (the schema requires some
// value there). Payment defaults to Cash and can be switched to Online
// right before submitting. The bill prints automatically the moment the
// order is created — no extra click needed.
const Outdoor = () => {
  const { isClean } = useUITheme();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { taxRate } = useTaxRate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = (total * taxRate) / 100;
  const totalWithTax = total + tax;

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);
      setShowInvoice(true);
      setCart([]);
      setIsProcessing(false);
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);
      enqueueSnackbar("Order placed!", { variant: "success" });
    },
    onError: (error) => {
      setIsProcessing(false);
      const message =
        error?.response?.data?.message || "Failed to place order. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const buildOrderData = (extra = {}) => ({
    customerDetails: {
      name: "Walk-in Customer",
      phone: "N/A",
      guests: 1,
    },
    orderStatus: "In Progress",
    bills: { total, tax, totalWithTax },
    items: cart,
    paymentMethod,
    ...extra,
  });

  const handleSubmit = async () => {
    if (cart.length === 0) {
      enqueueSnackbar("Add at least one item first.", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Online") {
      setIsProcessing(true);
      try {
        const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!scriptLoaded) {
          setIsProcessing(false);
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", { variant: "warning" });
          return;
        }

        const { data } = await createOrderRazorpay({ amount: totalWithTax.toFixed(2) });

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "GenZ Pizza Land",
          description: "Outdoor / Takeaway order",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const verification = await verifyPaymentRazorpay(response);
              if (!verification?.data?.success) {
                setIsProcessing(false);
                enqueueSnackbar(
                  "Payment could not be verified. Do not hand over the order — check Razorpay before retrying.",
                  { variant: "error", autoHideDuration: 8000 }
                );
                return;
              }
              enqueueSnackbar(verification.data.message, { variant: "success" });
              orderMutation.mutate(
                buildOrderData({
                  paymentData: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                  },
                })
              );
            } catch (verifyError) {
              setIsProcessing(false);
              enqueueSnackbar(
                "Payment was charged but verification failed to reach the server. Note the Razorpay payment ID and place this order manually.",
                { variant: "error", autoHideDuration: 10000 }
              );
            }
          },
          modal: {
            ondismiss: () => setIsProcessing(false),
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        setIsProcessing(false);
        enqueueSnackbar("Payment failed to start!", { variant: "error" });
      }
      return;
    }

    // Cash — the common case — goes straight through, one click.
    setIsProcessing(true);
    orderMutation.mutate(buildOrderData());
  };

  return (
    <section
      className={`min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 pb-36 lg:pb-6 transition-colors ${
        isClean ? "bg-transparent text-slate-900" : "bg-[#1f1f1f] text-slate-100"
      }`}
    >
      {/* Left: menu */}
      <div className="w-full lg:flex-[3] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Outdoor / Takeaway
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Fast counter takeaway — select items and complete in one tap
              </p>
            </div>
          </div>
        </div>

        <MenuContainer onAddToCart={handleAddToCart} />
      </div>

      {/* Right: local cart + submit (Symmetrical, high-contrast, crystal-clear) */}
      <div className="w-full lg:flex-[1.1] flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-fit">
        <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>🥡</span> Takeaway Order
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {cart.length} item{cart.length === 1 ? "" : "s"} added
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-3xl block mb-2 opacity-60">🛒</span>
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                Cart is empty
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Tap the shopping cart button on any item to add.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.icon ? `${item.icon} ` : ""}
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    Qty: {item.quantity} · Rs {item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
              Rs {total.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Tax ({taxRate}%)</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
              Rs {tax.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm font-black text-slate-900 dark:text-white">Payable Total</span>
            <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
              Rs {totalWithTax.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash")}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
                paymentMethod === "Cash"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>💵 Cash</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Online")}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
                paymentMethod === "Online"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>💳 Online</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={isProcessing || orderMutation.isPending || cart.length === 0}
              className="pos-btn-primary w-full py-3.5 text-sm font-black rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-40"
            >
              {isProcessing || orderMutation.isPending
                ? "Submitting Order..."
                : `Submit Order · Rs ${totalWithTax.toFixed(2)}`}
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2 font-medium">
              Receipt prints automatically once submitted.
            </p>
          </div>
        </div>
      </div>

      {showInvoice && orderInfo && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      <BottomNav />
    </section>
  );
};

export default Outdoor;
