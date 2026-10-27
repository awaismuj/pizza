import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";
import { MdTakeoutDining, MdShoppingCart, MdAttachMoney, MdCreditCard } from "react-icons/md";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import MenuContainer from "../components/menu/MenuContainer";
import Invoice from "../components/invoice/Invoice";
import {
  addOrder,
  clearPaymentIdempotencyKey,
  createOrderRazorpay,
  getPaymentIdempotencyKey,
  verifyPaymentRazorpay,
} from "../https";
import useTaxRate from "../hooks/useTaxRate";
import { useUITheme } from "../context/UIThemeContext";
import { FoodIcon } from "../utils/foodIcons";

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
  const paymentFingerprint = JSON.stringify({
    amount: Math.round(totalWithTax * 100),
    items: cart.map((item) => [item.id, item.name, item.price]),
  });

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
      clearPaymentIdempotencyKey();
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

        const { data } = await createOrderRazorpay(
          { amount: totalWithTax.toFixed(2) },
          getPaymentIdempotencyKey(paymentFingerprint)
        );

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
        enqueueSnackbar(
          error?.response?.data?.message || error.message || "Payment failed to start.",
          { variant: "error" }
        );
      }
      return;
    }

    // Cash — the common case — goes straight through, one click.
    setIsProcessing(true);
    orderMutation.mutate(buildOrderData());
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-3 pb-32 lg:pb-4 transition-colors">
      {/* Left: menu */}
      <div className="w-full lg:flex-[3] flex flex-col min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-3">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Outdoor / Takeaway
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Fast counter takeaway — select items and complete in one tap
              </p>
            </div>
          </div>
        </div>

        <MenuContainer onAddToCart={handleAddToCart} />
      </div>

      {/* Right: local cart + one-click submit. No explicit lg:h-full
          (h-auto instead) so the flex row's default align-items:stretch
          auto-computes the height - that's what makes lg:mb-36 actually
          reserve real space instead of just pushing the panel past the
          container's bottom. That reserved space is for the fixed
          BottomNav *and* the WhatsApp button that floats above it (both
          global, on every page) - without it, the Submit Order button ends
          up rendered underneath them. */}
      <div className="w-full lg:flex-[1] bg-[#1a1a1a] mx-3 mb-4 lg:mx-0 lg:mt-4 lg:mr-3 lg:mb-36 lg:h-auto rounded-lg pt-2 flex flex-col">
        <div className="px-5 pt-3 pb-2">
          <h1 className="text-lg text-[#f5f5f5] font-semibold tracking-wide">
            Takeaway Order
          </h1>
          <p className="text-xs text-[#ababab] font-medium">
            {cart.length} item{cart.length === 1 ? "" : "s"}
          </p>
        </div>
        <hr className="border-[#2a2a2a] border-t-2" />

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {cart.length === 0 ? (
            <p className="text-[#5f5f5f] text-sm text-center mt-10">
              No items yet — tap the cart button on any menu item to add it here.
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
              <span className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 inline-flex items-center justify-center mb-2 shadow-xs">
                <MdShoppingCart size={28} />
              </span>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
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
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center">
                    <span className="inline-flex items-center justify-center mr-1.5 align-middle shrink-0">
                      <FoodIcon icon={item.icon} size={15} />
                    </span>
                    <span>{item.name}</span>
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

        <div className="flex items-center gap-3 px-5 mt-4">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
              paymentMethod === "Cash" ? "bg-[#383737] text-[#f5f5f5]" : ""
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("Online")}
            className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
              paymentMethod === "Online" ? "bg-[#383737] text-[#f5f5f5]" : ""
            }`}
          >
            Online
          </button>
        </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash")}
              className={`py-2 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
                paymentMethod === "Cash"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <MdCreditCard size={16} />
              <span>Online</span>
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
