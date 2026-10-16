import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import OrderSearch from "./OrderSearch";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(scrolLRef.current){
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  },[cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  }

  return (
    <div className="pb-2 flex flex-col flex-1 min-h-0">
      <OrderSearch />
      <div className="px-4 pt-3 shrink-0">
        <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
          Order Details
        </h1>
      </div>
      <div
        className="mt-4 px-4 overflow-y-auto scrollbar-hide flex-1 min-h-[220px] lg:min-h-0"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <p className="text-slate-500 text-xs flex justify-center items-center h-full py-8">
            Cart is empty. Click dishes to add.
          </p>
        ) : (
          cartData.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-3 mb-2 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-white font-bold text-xs leading-tight truncate">
                    {item.icon ? `${item.icon} ` : ""}
                    {item.name}
                  </h4>
                  <span className="text-amber-400 font-extrabold text-xs shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    ×{item.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-rose-400 transition p-1"
                    title="Remove item"
                  >
                    <RiDeleteBin2Fill size={16} />
                  </button>

                  <p className="text-white font-bold font-mono text-xs">
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
