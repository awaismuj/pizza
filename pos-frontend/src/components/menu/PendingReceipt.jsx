import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import { formatDate } from "../../utils";
import ReceiptFooter from "../shared/ReceiptFooter";
import { printReceipt } from "../../utils/printReceipt";

// Prints the bill as it stands right now — before the order has been
// placed. Used by the "Print Receipt" button in Bill.jsx, which needs to
// hand the customer/kitchen a copy of the current cart without waiting for
// checkout. This is separate from Invoice.jsx (which prints a *placed*
// order) because there is no saved order yet to show.
const PendingReceipt = ({ customerData, cartData, total, discountedSubtotal, couponDiscount, couponCode, tax, taxRate, totalPriceWithTax, onClose }) => {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    printReceipt(receiptRef.current.innerHTML, "Order Receipt");
  };

  // Print as soon as this opens — clicking "Print Receipt" should send it
  // straight to the printer, not require a second click.
  useEffect(() => {
    const t = setTimeout(handlePrint, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        <div ref={receiptRef} className="p-4">
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

          <h2 className="text-xl font-bold text-center mb-2">Order Receipt</h2>
          <p className="text-gray-600 text-center text-xs">(Pending — not yet placed)</p>

          <div className="mt-4 border-t pt-4 text-sm text-gray-700">
            <p>
              <strong>Order ID:</strong> {customerData.orderId || "—"}
            </p>
            <p>
              <strong>Name:</strong> {customerData.customerName || "Walk-in Customer"}
            </p>
            {customerData.customerPhone && (
              <p>
                <strong>Phone:</strong> {customerData.customerPhone}
              </p>
            )}
            <p>
              <strong>Table:</strong> {customerData.table?.tableNo ?? "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(new Date())}
            </p>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Items Ordered</h3>
            <ul className="text-sm text-gray-700">
              {cartData.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-xs">
                  <span>
                    {item.icon ? `${item.icon} ` : ""}
                    {item.name} x{item.quantity}
                  </span>
                  <span>Rs {item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 border-t pt-4 text-sm">
            <p>
              <strong>Subtotal:</strong> Rs {total.toFixed(2)}
            </p>
            {couponDiscount > 0 && (
              <p>
                <strong>Coupon ({couponCode}):</strong> −Rs {couponDiscount.toFixed(2)}
              </p>
            )}
            <p>
              <strong>Discounted subtotal:</strong> Rs {discountedSubtotal.toFixed(2)}
            </p>
            <p>
              <strong>Tax ({taxRate}%):</strong> Rs {tax.toFixed(2)}
            </p>
            <p className="text-md font-semibold">
              <strong>Grand Total:</strong> Rs {totalPriceWithTax.toFixed(2)}
            </p>
          </div>

          <ReceiptFooter />
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handlePrint} className="text-blue-500 hover:underline text-xs px-4 py-2 rounded-lg">
            Print Receipt
          </button>
          <button onClick={onClose} className="text-red-500 hover:underline text-xs px-4 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

PendingReceipt.propTypes = {
  customerData: PropTypes.shape({
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerName: PropTypes.string,
    customerPhone: PropTypes.string,
    table: PropTypes.shape({ tableNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
  }).isRequired,
  cartData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    name: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.number,
  })).isRequired,
  total: PropTypes.number.isRequired,
  discountedSubtotal: PropTypes.number.isRequired,
  couponDiscount: PropTypes.number.isRequired,
  couponCode: PropTypes.string,
  tax: PropTypes.number.isRequired,
  taxRate: PropTypes.number.isRequired,
  totalPriceWithTax: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

PendingReceipt.defaultProps = {
  couponCode: "",
};

export default PendingReceipt;
