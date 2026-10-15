import React, { useState } from "react";
import { FaHome, FaShoppingBag } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdDeliveryDining } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    if(guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  };
  const decrement = () => {
    if(guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    // normalize phone before sending to store
    const raw = phone || "";
    // remove non-digit except leading +
    let digits = raw.replace(/[^0-9]/g, "");
    let full = raw.trim();

    if (full.startsWith("+")) {
      // normalize to + followed by digits
      full = "+" + digits;
    } else {
      // if user entered leading 0, remove it
      if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
      // if the number appears to be a Pakistan mobile (starts with 3 and length 10)
      if (digits.length === 10 && digits.startsWith("3")) {
        full = "+92" + digits;
      } else if (digits.length === 10) {
        // unknown, still prefix +92 as requested
        full = "+92" + digits;
      } else if (digits.length === 11 && digits.startsWith("92")) {
        full = "+" + digits;
        digits = digits.replace(/^92/, "");
      } else {
        // fallback keep digits
        full = digits;
      }
    }

    const local = (full.startsWith("+92") ? full.replace(/[^0-9]/g, "").replace(/^92/, "") : digits).replace(/^0+/, "");

    // send the data to store
    dispatch(setCustomer({ name, phone: full, phoneLocal: local, guests: guestCount }));
    navigate("/tables");
  };

  return (
    <>
    {/* Bottom bar: 5 real buttons - Home, Orders, Tables, Online, Outdoor.
        z-30 keeps it above page content (cards, lists) so every button is
        always clickable. */}
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#262626] p-2 h-16 grid grid-cols-5 items-center max-w-screen-lg mx-auto sm:px-4">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-1 h-full items-center justify-center font-bold text-xs sm:text-base ${
          isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } rounded-[20px]`}
      >
        <FaHome className="inline sm:mr-2" size={18} /> <p className="hidden sm:inline">Home</p>
      </button>
      <button
        onClick={() => navigate("/orders")}
        className={`flex flex-1 h-full items-center justify-center font-bold text-xs sm:text-base ${
          isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } rounded-[20px]`}
      >
        <MdOutlineReorder className="inline sm:mr-2" size={18} /> <p className="hidden sm:inline">Orders</p>
      </button>

      <button
        onClick={() => navigate("/tables")}
        className={`flex flex-1 h-full items-center justify-center font-bold text-xs sm:text-base ${
          isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } rounded-[20px]`}
      >
        <MdTableBar className="inline sm:mr-2" size={20} /> <p className="hidden sm:inline">Tables</p>
      </button>

      <button
        onClick={() => navigate("/online-orders")}
        className={`flex flex-1 h-full items-center justify-center font-bold text-xs sm:text-base ${
          isActive("/online-orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } rounded-[20px]`}
      >
        <MdDeliveryDining className="inline sm:mr-2" size={18} /> <p className="hidden sm:inline">Online</p>
      </button>
      <button
        onClick={() => navigate("/outdoor")}
        className={`flex flex-1 h-full items-center justify-center font-bold text-xs sm:text-base ${
          isActive("/outdoor") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } rounded-[20px]`}
      >
        <FaShoppingBag className="inline sm:mr-2" size={16} /> <p className="hidden sm:inline">Outdoor</p>
      </button>

    </div>

    {/* New order: its own floating button, lifted well above the bar (and to
        the left of the WhatsApp button) so it never sits on the bar, the
        Windows taskbar edge, or another button. */}
    {/* Hidden on Tables / Menu: you're already creating an order there. */}
    {!isActive("/tables") && !isActive("/menu") && (
      <button
        type="button"
        onClick={openModal}
        aria-label="Create a new dine-in order"
        title="Create a new order"
        className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#F6B100] px-5 py-3 text-sm font-bold text-[#1f1f1f] shadow-[0_8px_24px_rgba(246,177,0,0.35)] transition hover:scale-105 hover:bg-yellow-500 active:scale-95 sm:bottom-20 sm:px-6 sm:text-base"
      >
        <BiSolidDish size={22} />
        <span>New Order</span>
      </button>
    )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">Customer Name</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="" placeholder="Enter customer name" id="" className="bg-transparent flex-1 text-white focus:outline-none"  />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Customer Phone</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="" placeholder="+923013310954" id="" className="bg-transparent flex-1 text-white focus:outline-none"  />
          </div>
        </div>
        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-2xl">&minus;</button>
            <span className="text-white">{guestCount} Person</span>
            <button onClick={increment} className="text-yellow-500 text-2xl">&#43;</button>
          </div>
        </div>
        <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
          Create Order
        </button>
      </Modal>
    </>
  );
};

export default BottomNav;
