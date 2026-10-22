import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";
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
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-3 pb-40 lg:pb-0">
      {/* Left: menu - scrolls its own content on desktop; pb-28 clears the
          fixed BottomNav so the last row of dishes is actually reachable. */}
      <div className="w-full lg:flex-[3] lg:h-full lg:overflow-y-auto lg:pb-28">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                Outdoor / Takeaway
              </h1>
              <p className="text-xs text-[#ababab] font-medium">
                No name or table needed — pick items and submit
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
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#f5f5f5] text-sm font-medium truncate">
                      {item.icon ? `${item.icon} ` : ""}
                      {item.name} x{item.quantity}
                    </p>
                    <p className="text-[#ababab] text-xs">Rs {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#e05353] p-2 shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-[#2a2a2a] border-t-2" />

        <div className="px-5 pt-3">
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-[#ababab] font-medium">Subtotal</p>
            <h1 className="text-[#f5f5f5] text-md font-bold">Rs {total.toFixed(2)}</h1>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[#ababab] font-medium">Tax ({taxRate}%)</p>
            <h1 className="text-[#f5f5f5] text-md font-bold">Rs {tax.toFixed(2)}</h1>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[#ababab] font-medium">Total</p>
            <h1 className="text-[#f5f5f5] text-lg font-bold">Rs {totalWithTax.toFixed(2)}</h1>
          </div>
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

        <div className="px-5 mt-4 mb-4">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || orderMutation.isPending || cart.length === 0}
            className="bg-[#f6b100] px-4 py-4 w-full rounded-lg text-[#1f1f1f] font-bold text-lg disabled:opacity-60"
          >
            {isProcessing || orderMutation.isPending
              ? "Submitting..."
              : `Submit Order · Rs ${totalWithTax.toFixed(2)}`}
          </button>
          <p className="text-[10px] text-[#6b6b6b] text-center mt-2">
            Bill prints automatically once the order is submitted.
          </p>
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
