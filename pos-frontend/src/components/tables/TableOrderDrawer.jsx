import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadTableOrder } from "../../redux/slices/customerSlice";
import { setCartItems } from "../../redux/slices/cartSlice";
import {
  IoCloseOutline,
  IoPrintOutline,
  IoRestaurantOutline,
  IoPersonOutline,
  IoCallOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { LuPlus, LuReceipt, LuUtensils, LuArrowRight } from "react-icons/lu";
import { printReceipt } from "../../utils/printReceipt";

const TableOrderDrawer = ({ isOpen, onClose, table, onFreeTable }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen || !table) return null;

  const currentOrder = table.currentOrder;
  const customer = currentOrder?.customerDetails;
  const items = currentOrder?.items || [];
  const bills = currentOrder?.bills;

  const handleAddMoreItems = () => {
    // Format existing items from active table order to match cart items format
    const formattedCartItems = (currentOrder?.items || []).map((it, idx) => {
      const unitPrice =
        it.pricePerQuantity ||
        (it.quantity && it.quantity > 0 ? it.price / it.quantity : it.price) ||
        0;
      return {
        id: it._id || it.id || `table-item-${idx}-${Date.now()}`,
        dishId: it.dishId || it._id,
        name: it.name,
        icon: it.icon || "🍽️",
        pricePerQuantity: unitPrice,
        quantity: it.quantity || 1,
        price: it.price || unitPrice * (it.quantity || 1),
        size: it.size || undefined,
        crust: it.crust || undefined,
        isDeal: Boolean(it.isDeal),
        dealItems: it.dealItems || [],
      };
    });

    // Populate customer slice with precise active table and customer info
    const isCombined = table.isCombined || Boolean(table.combinedTableNos);
    const stationLabel = table.combinedTableNos || table.tableNo;

    dispatch(
      loadTableOrder({
        orderId: currentOrder?.orderNumber ? `#${currentOrder.orderNumber}` : `Table ${stationLabel}`,
        existingOrderId: currentOrder?._id || null,
        customerName: customer?.name || `Table ${stationLabel} Guest`,
        customerPhone: customer?.phone || "",
        guests: customer?.guests || table.combinedTotalSeats || table.seats || 2,
        table: {
          tableId: table._id,
          tableNo: stationLabel,
          combinedTableNos: table.combinedTableNos || "",
          isCombined: isCombined,
          totalSeats: table.combinedTotalSeats || table.seats,
        },
      })
    );

    // Populate cart with active table items
    dispatch(setCartItems(formattedCartItems));

    onClose();
    navigate("/menu");
  };

  const handlePrint = () => {
    if (currentOrder) {
      printReceipt(currentOrder);
    }
  };

  const isCombined = table.isCombined || Boolean(table.combinedTableNos);
  const stationLabel = table.combinedTableNos || table.tableNo;
  const capacityLabel = table.combinedTotalSeats || table.seats;

  const drawerContent = (
    <div
      className="fixed inset-0 z-[99999] flex justify-end"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Slide-In Drawer */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200/90 dark:border-slate-800 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xs border ${
              isCombined
                ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}>
              T{table.tableNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {isCombined ? `Station: Table ${stationLabel}` : `Table ${table.tableNo} Order`}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  isCombined
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}>
                  {isCombined ? "🔗 Joined" : table.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {isCombined
                  ? `Combined Capacity: ${capacityLabel} Seats · Multi-Table Station`
                  : `Capacity: ${table.seats} Seats · Active Table Station`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer"
            title="Close Drawer"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Order Meta Strip */}
          {currentOrder ? (
            <>
              <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Order Number
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      #{currentOrder.orderNumber || "T-" + table.tableNo}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      currentOrder.orderStatus === "Ready"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    ● {currentOrder.orderStatus || "In Progress"}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <IoPersonOutline className="text-amber-500 shrink-0" />
                    <span className="font-bold truncate">{customer?.name || "Dine-In Guest"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <IoCallOutline className="text-amber-500 shrink-0" />
                    <span className="truncate">{customer?.phone || "No Phone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <IoTimeOutline className="text-slate-400 shrink-0" />
                    <span>
                      {currentOrder.orderDate
                        ? new Date(currentOrder.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Active"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 text-right">
                    <span>Payment: </span>
                    <strong className="text-slate-700 dark:text-slate-200">{currentOrder.paymentMethod || "Pending"}</strong>
                  </div>
                </div>
              </div>

              {/* Itemized Order Dishes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <LuUtensils size={13} className="text-amber-500" />
                    <span>Ordered Dishes ({items.length})</span>
                  </h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-200/60 dark:divide-slate-700/60 overflow-hidden">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black text-[11px] flex items-center justify-center shrink-0">
                            {item.quantity}x
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {item.name || item.dish?.name}
                            </p>
                            {item.variant && (
                              <p className="text-[10px] text-slate-400">
                                {item.variant.size} {item.variant.crust ? `· ${item.variant.crust}` : ""}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                          Rs {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No dishes itemized on this ticket.
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Totals */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rs {bills?.total?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax:</span>
                  <span className="font-mono">Rs {bills?.tax?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    Rs {bills?.totalWithTax?.toLocaleString() || bills?.total?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                <IoRestaurantOutline />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Table Marked as Booked
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                This table is occupied in the floor plan. You can add items directly or release the table.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleAddMoreItems}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <LuPlus size={14} />
              <span>Add Items to Table</span>
            </button>

            {currentOrder && (
              <button
                onClick={handlePrint}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold p-2.5 rounded-xl text-xs transition flex items-center justify-center"
                title="Print Receipt"
              >
                <IoPrintOutline size={18} />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (onFreeTable) onFreeTable(table);
              onClose();
            }}
            className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 font-bold py-2 rounded-xl text-xs transition"
          >
            Mark Paid & Free Table Station
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default TableOrderDrawer;
