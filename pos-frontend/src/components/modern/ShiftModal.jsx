import React from "react";
import ShiftDrawer from "./ShiftDrawer";

// Forwarding export for backward compatibility — all shifts & till actions now use ShiftDrawer
const ShiftModal = (props) => {
  return <ShiftDrawer {...props} />;
};

export default ShiftModal;
export { ShiftDrawer };
