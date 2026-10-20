import React, { useEffect, useRef } from "react";
import { formatDateAndTime, getOrderNumber } from "../../utils";
import ReceiptFooter from "../shared/ReceiptFooter";
import { printReceipt } from "../../utils/printReceipt";

// The kitchen order ticket (KOT) — printed the moment a table order is
// actually placed, exactly like the moment an online order gets rung in and
// sent off to preparation. This is deliberately separate from Invoice.jsx:
// the kitchen only needs to know what to make (items + quantities), not
// prices or payment details, and it is the FIRST of the two prints a table
// order gets — the second being the final bill, printed when the table is
// cleared (see OrderCard.jsx).
//
// It prints itself automatically as soon as it mounts, the same way
// PendingReceipt.jsx does, so staff don't need an extra click to get it to
// the kitchen printer. It stays open afterwards with Print/Close so it can
// be reprinted or dismissed.
const KitchenSlip = ({ orderInfo, onClose }) => {
  const slipRef = useRef(null);

  const handlePrint = () => {
    printReceipt(slipRef.current.innerHTML, "Kitchen Order Slip");
  };

  // Auto-print once, right after this order is placed — this is the "sent
  // to kitchen" moment.
  useEffect(() => {
    const t = setTimeout(handlePrint, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isWalkIn = orderInfo?.customerDetails?.name === "Walk-in Customer";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        <div ref={slipRef} className="p-4">
          <p className="text-center text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">
            GenZ Pizza Land
          </p>
          <h2 className="text-xl font-bold text-center mb-1">Kitchen Order Slip</h2>
          <p className="text-gray-600 text-center text-xs mb-2">Sent to kitchen for preparation</p>

          <div className="mt-2 border-t pt-3 text-sm text-gray-700">
            <p>
              <strong>Order ID:</strong>{" "}
              #{getOrderNumber(orderInfo)}
            </p>
            <p>
              <strong>Table:</strong>{" "}
              {orderInfo.combinedTableNos
                ? `Table ${orderInfo.combinedTableNos} (Combined)`
                : orderInfo.table?.tableNo
                ? `Table ${orderInfo.table?.tableNo}`
                : "N/A"}
            </p>
            {!isWalkIn && (
              <p>
                <strong>Name:</strong> {orderInfo.customerDetails?.name}
              </p>
            )}
            <p>
              <strong>Time:</strong> {formatDateAndTime(orderInfo.orderDate)}
            </p>
          </div>

          {/* Items only — no prices. This slip tells the kitchen what to
              make, not what to charge. */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold mb-1">Items To Prepare</h3>
            <ul className="text-gray-800">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm font-medium py-0.5"
                >
                  <span>
                    {item.icon ? `${item.icon} ` : ""}
                    {item.name}
                  </span>
                  <span>x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <ReceiptFooter />
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handlePrint} className="text-blue-500 hover:underline text-xs px-4 py-2 rounded-lg">
            Print Slip
          </button>
          <button onClick={onClose} className="text-red-500 hover:underline text-xs px-4 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenSlip;
