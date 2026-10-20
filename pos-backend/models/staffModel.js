const mongoose = require("mongoose");

// A member of staff (kitchen, delivery, cashier, waiter...). Separate from
// User (a login account): not every staff member needs a login.
// `baseSalary` is Admin-only — the controller strips it for other roles.
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" }, // salary slips go here
    designation: { type: String, trim: true, default: "" },
    cnic: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    joinDate: { type: String, required: true }, // "YYYY-MM-DD"
    baseSalary: { type: Number, default: 0, min: 0 }, // monthly, in Rs
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
