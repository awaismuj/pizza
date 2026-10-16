import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import OrderSearch from "./OrderSearch";
import { useUITheme } from "../../context/UIThemeContext";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();
  const { isClean } = useUITheme();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };

  return (
    <div className="pb-2 flex flex-col flex-1 min-h-0">
      <OrderSearch />
      <div className="px-4 pt-3 shrink-0 flex items-center justify-between">
        <h3
          className={`text-sm font-extrabold uppercase tracking-wider ${
            isClean ? "text-slate-900" : "text-[#e4e4e4]"
          }`}
        >
          Order Items ({cartData.length})
        </h3>
      </div>
      <div
        className="mt-3 px-4 overflow-y-auto scrollbar-hide flex-1 min-h-[200px] lg:min-h-0"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <span className="text-3xl mb-2">🛒</span>
            <p className={isClean ? "text-slate-400 text-xs font-semibold" : "text-slate-500 text-xs"}>
              Cart is empty. Click dishes to add.
            </p>
          </div>
        ) : (
          cartData.map((item) => {
            return (
              <div
                key={item.id}
                className={`rounded-xl px-3.5 py-2.5 mb-2 transition flex flex-col gap-1.5 border ${
                  isClean
                    ? "bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-xs"
                    : "bg-slate-900/90 border-slate-800 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`font-bold text-xs leading-tight truncate ${
                      isClean ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.icon ? `${item.icon} ` : ""}
                    {item.name}
                  </h4>
                  <span
                    className={`font-black text-xs shrink-0 px-2 py-0.5 rounded-md ${
                      isClean ? "bg-amber-100 text-amber-900" : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    ×{item.quantity}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-xs pt-1 border-t ${
                    isClean ? "border-slate-200/70" : "border-slate-800/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                    title="Remove item"
                  >
                    <RiDeleteBin2Fill size={15} />
                  </button>

                  <p
                    className={`font-bold font-mono text-xs ${
                      isClean ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Rs {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CartInfo;
