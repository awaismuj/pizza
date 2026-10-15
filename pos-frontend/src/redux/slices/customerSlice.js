import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
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
            state.orderId = `${Date.now()}`;
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
        },

        removeCustomer: (state) => {
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


export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;