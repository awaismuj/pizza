const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    reservationTime: { type: Date, required: true },
    notes: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Confirmed", "Arrived", "Cancelled", "No-Show"],
        default: "Confirmed",
    },
    createdAt: { type: Date, default: Date.now },
});

const tableSchema = new mongoose.Schema({
    tableNo: { type: Number, required: true, unique: true },
    status: {
        type: String,
        default: "Available"
    },
    seats: { 
        type: Number,
        required: true
    },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    reservations: [reservationSchema],
});

module.exports = mongoose.model("Table", tableSchema);