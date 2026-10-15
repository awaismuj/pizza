import React from "react";

// Floating WhatsApp button for customer/staff inquiries, shown on every page.
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
    className="fixed bottom-24 right-3 z-40 flex h-11 w-11 sm:bottom-20 sm:right-4 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg transition-transform hover:scale-110"
  >
    <svg viewBox="0 0 32 32" width="22" height="22" className="sm:w-[30px] sm:h-[30px]" aria-hidden="true" fill="#fff">
      <path d="M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
    </svg>
  </a>
);

export default WhatsAppButton;
