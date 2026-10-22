import PropTypes from "prop-types";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import ReceiptFooter from "../shared/ReceiptFooter";
import { printReceipt } from "../../utils/printReceipt";
import { getOrderNumber } from "../../utils";
import { paymentReceiptLine } from "../../utils/payments";

// The final bill — shown once an order reaches its terminal "Closed"/
// "Completed" stage (see OrderCard.jsx), i.e. when a table is being
// cleared. This never prints itself automatically: it just appears on
// screen, and staff click "Print Receipt" if a copy is actually needed, or
// "Close" to dismiss it. For a dine-in table, this is the SECOND of the
// two prints an order gets — the first being the Kitchen Order Slip
// printed when the order was placed (see KitchenSlip.jsx / Bill.jsx).
const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    printReceipt(invoiceRef.current.innerHTML, "Order Receipt");
  };

  const isWalkIn = orderInfo.customerDetails?.name === "Walk-in Customer";
  const couponDiscount = Number(orderInfo.bills?.couponDiscount) || 0;
  const otherDiscount = Math.max(0, (Number(orderInfo.bills?.discount) || 0) - couponDiscount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        {/* Receipt Content for Printing */}

        <div ref={invoiceRef} className="p-4">
          {/* Receipt Header */}
          <div className="flex justify-center mb-2">
            <img
              src={genzLogo}
              alt="GenZ Pizza Land"
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
            />
          </div>
          <p className="text-center text-sm font-semibold text-gray-500 tracking-wide uppercase mb-3">
            GenZ Pizza Land
          </p>

          <div className="flex justify-center mb-4 no-print">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-12 h-12 border-8 border-green-500 rounded-full flex items-center justify-center shadow-lg bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Order Receipt</h2>
          <p className="text-gray-600 text-center">Thank you for your order!</p>

          {/* Order Details */}

          <div className="mt-4 border-t pt-4 text-sm text-gray-700">
            <p>
              <strong>Order ID:</strong>{" "}
              #{getOrderNumber(orderInfo)}
            </p>
            {!isWalkIn && (
              <>
                <p>
                  <strong>Name:</strong> {orderInfo.customerDetails.name}
                </p>
                <p>
                  <strong>Phone:</strong> {orderInfo.customerDetails.phone}
                </p>
                <p>
                  <strong>Guests:</strong> {orderInfo.customerDetails.guests}
                </p>
              </>
            )}
            {isWalkIn && (
              <p>
                <strong>Order Type:</strong> Outdoor / Takeaway
              </p>
            )}
          </div>

          {/* Items Summary */}

          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Items Ordered</h3>
            <ul className="text-sm text-gray-700">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-xs"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>Rs {item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}

          <div className="mt-4 border-t pt-4 text-sm">
            {Number(orderInfo.bills.discount) > 0 ? (
              <>
                <p>
                  <strong>Subtotal:</strong> Rs{" "}
                  {Number(orderInfo.bills.subtotal ?? orderInfo.bills.total + orderInfo.bills.discount).toFixed(2)}
                </p>
                {otherDiscount > 0 && (
                  <p>
                    <strong>
                      Build Your Own Deal ({orderInfo.bills.discountPercent}% off):
                    </strong>{" "}
                    -Rs {otherDiscount.toFixed(2)}
                  </p>
                )}
                {couponDiscount > 0 && (
                  <p>
                    <strong>Coupon ({orderInfo.coupon?.code || "discount"}):</strong>{" "}
                    -Rs {couponDiscount.toFixed(2)}
                  </p>
                )}
                <p>
                  <strong>After discount:</strong> Rs {orderInfo.bills.total.toFixed(2)}
                </p>
              </>
            ) : (
              <p>
                <strong>Subtotal:</strong> Rs {orderInfo.bills.total.toFixed(2)}
              </p>
            )}
            <p>
              <strong>Tax:</strong> Rs {orderInfo.bills.tax.toFixed(2)}
            </p>
            {Number(orderInfo.bills.deliveryFee) > 0 && (
              <p>
                <strong>Delivery fee:</strong> Rs {Number(orderInfo.bills.deliveryFee).toFixed(2)}
              </p>
            )}
            <p className="text-md font-semibold">
              <strong>Grand Total:</strong> Rs{" "}
              {orderInfo.bills.totalWithTax.toFixed(2)}
            </p>
          </div>

          {/* Payment Details */}

          <div className="mb-2 mt-2 text-xs">
            {orderInfo.paymentMethod === "JazzCash/Raast" || orderInfo.paymentMethod === "Cash on Delivery" ? (
              <>
                {/* Online orders: "Paid via JazzCash/Raast (TID: xxxx)" or "Cash on Delivery" */}
                <p>
                  <strong>{paymentReceiptLine(orderInfo)}</strong>
                </p>
                {orderInfo.paymentMethod === "JazzCash/Raast" && orderInfo.paymentStatus && orderInfo.paymentStatus !== "Verified" && (
                  <p>Payment status: {orderInfo.paymentStatus}</p>
                )}
                {orderInfo.fulfillment?.method === "pickup" && (
                  <p>
                    <strong>Pickup at:</strong> {orderInfo.fulfillment.branchName}
                  </p>
                )}
                {orderInfo.fulfillment?.method !== "pickup" && orderInfo.customerDetails?.address && (
                  <p>
                    <strong>Deliver to:</strong> {orderInfo.customerDetails.address}
                  </p>
                )}
              </>
            ) : orderInfo.paymentMethod === "Cash" ? (
              <p>
                <strong>Payment Method:</strong> {orderInfo.paymentMethod}
              </p>
            ) : (
              <>
                <p>
                  <strong>Payment Method:</strong> {orderInfo.paymentMethod}
                </p>
                <p>
                  <strong>Razorpay Order ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_order_id}
                </p>
                <p>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_payment_id}
                </p>
              </>
            )}
          </div>

          <ReceiptFooter />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrint}
            className="text-blue-500 hover:underline text-xs px-4 py-2 rounded-lg"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="text-red-500 hover:underline text-xs px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

Invoice.propTypes = {
  orderInfo: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    customerDetails: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      guests: PropTypes.number,
    }),
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number,
    })),
    bills: PropTypes.shape({
      subtotal: PropTypes.number,
      discount: PropTypes.number,
      discountPercent: PropTypes.number,
      couponDiscount: PropTypes.number,
      total: PropTypes.number,
      tax: PropTypes.number,
      totalWithTax: PropTypes.number,
    }),
    coupon: PropTypes.shape({ code: PropTypes.string }),
    paymentMethod: PropTypes.string,
    paymentData: PropTypes.shape({
      razorpay_order_id: PropTypes.string,
      razorpay_payment_id: PropTypes.string,
    }),
  }).isRequired,
  setShowInvoice: PropTypes.func.isRequired,
};

export default Invoice;
