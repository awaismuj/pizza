import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    existingOrderId: null,
    customerName: "",
    customerPhone: "",
    customerPhoneLocal: "",
    guests: 0,
    table: null
}


const customerSlice = createSlice({
    name : "customer",
    initialState,
    reducers : {
        setCustomer: (state, action) => {
            const { name, phone, phoneLocal, guests } = action.payload;
            state.orderId = action.payload.orderId || `${Date.now()}`;
            state.existingOrderId = action.payload.existingOrderId || null;
            state.customerName = name;
            // normalize phone: remove spaces/dashes
            const normalized = phone ? ("" + phone).replace(/[^+0-9]/g, "") : "";
            state.customerPhone = normalized;

            // determine local phone (without country code) if provided, else infer from normalized
            if (phoneLocal) {
                state.customerPhoneLocal = phoneLocal.replace(/\D/g, "");
            } else if (normalized.startsWith("+92")) {
                state.customerPhoneLocal = normalized.replace(/[^0-9]/g, "").replace(/^92/, "");
            } else if (normalized.startsWith("+")) {
                // unknown country, just strip + and keep rest
                state.customerPhoneLocal = normalized.replace(/[^0-9]/g, "");
            } else {
                state.customerPhoneLocal = normalized.replace(/[^0-9]/g, "");
            }

            state.guests = guests;
            if (action.payload.table) {
                state.table = action.payload.table;
            }
        },

        loadTableOrder: (state, action) => {
            const { orderId, existingOrderId, customerName, customerPhone, phoneLocal, guests, table } = action.payload;
            state.orderId = orderId || "";
            state.existingOrderId = existingOrderId || null;
            state.customerName = customerName || "";
            const normalized = customerPhone ? ("" + customerPhone).replace(/[^+0-9]/g, "") : "";
            state.customerPhone = normalized;
            if (phoneLocal) {
                state.customerPhoneLocal = phoneLocal.replace(/\D/g, "");
            } else if (normalized.startsWith("+92")) {
                state.customerPhoneLocal = normalized.replace(/[^0-9]/g, "").replace(/^92/, "");
            } else {
                state.customerPhoneLocal = normalized.replace(/[^0-9]/g, "");
            }
            state.guests = guests || 0;
            state.table = table || null;
        },

        removeCustomer: (state) => {
            state.orderId = "";
            state.existingOrderId = null;
            state.customerName = "";
            state.customerPhone = "";
            state.customerPhoneLocal = "";
            state.guests = 0;
            state.table = null;
        },

        updateTable: (state, action) => {
            state.table = action.payload.table;
        }

    }
})


export const { setCustomer, loadTableOrder, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;