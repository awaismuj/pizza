import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email : "",
    phone: "",
    role: "",
    permissions: [],
    forcePasswordChange: false,
    isAuth: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, name, phone, email, role, permissions = [], forcePasswordChange = false } = action.payload;
            state._id = _id;
            state.name = name;
            state.phone = phone;
            state.email = email;
            state.role = role;
            state.permissions = permissions;
            state.forcePasswordChange = forcePasswordChange;
            state.isAuth = true;
        },

        setPasswordChangeRequired: (state, action) => {
            state.forcePasswordChange = action.payload;
        },

        removeUser: (state) => {
            state._id = "";
            state.email = "";
            state.name = "";
            state.phone = "";
            state.role = "";
            state.permissions = [];
            state.forcePasswordChange = false;
            state.isAuth = false;
        }
    }
})

export const { setUser, setPasswordChangeRequired, removeUser } = userSlice.actions;
export default userSlice.reducer;