import React from "react";

// Printed at the bottom of every slip that leaves this system — the
// kitchen order slip, the pending/preview receipt, and the final invoice.
// Kept as one shared component so the contact details only ever need to be
// updated in one place.
const ReceiptFooter = () => (
  <div className="mt-4 border-t pt-2 text-center text-[10px] text-gray-500 leading-snug">
    <p>For Booking Complaints &amp; Suggestions</p>
    <p>UAN: +923259061006</p>
    <p>FOR ONLINE order please visit https://genzfood.online</p>
  </div>
);

export default ReceiptFooter;
