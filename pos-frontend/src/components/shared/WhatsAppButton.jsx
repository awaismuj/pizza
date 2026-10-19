import React from "react";
import { FaWhatsapp } from "react-icons/fa";

// Floating WhatsApp button for customer/staff inquiries, placed cleanly in the bottom-right corner.
const WHATSAPP_NUMBER = "923259061006"; // +92 325 9061006
const LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello GenZ Pizza Land, I have an inquiry."
)}`;

const WhatsAppButton = () => (
  <a
    href={LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Inquiry on WhatsApp"
    title="WhatsApp inquiry: +92 325 9061006"
    className="fixed bottom-6 right-6 z-50 group flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
  >
    {/* Subtle online pulse indicator */}
    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white dark:border-slate-900"></span>
    </span>

    <FaWhatsapp className="w-7 h-7 drop-shadow-xs transition-transform group-hover:rotate-6" />
  </a>
);

export default WhatsAppButton;
