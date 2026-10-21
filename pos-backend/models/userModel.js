const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },

    email : {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message : "Email must be in valid format!"
        }
    },

    phone: {
        type : String,
        trim: true,
        required: true,
        validate: {
            validator: function (v) {
                const digits = String(v).replace(/\D/g, "");
                return digits.length >= 7 && digits.length <= 15;
            },
            message : "Phone number must contain 7 to 15 digits."
        }
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true
    },

    username: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
    employeeId: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    forcePasswordChange: { type: Boolean, default: false },
    permissionOverrides: {
        granted: { type: [String], default: [] },
        denied: { type: [String], default: [] },
    },
    authVersion: { type: Number, default: 0 },

    // New signups sit as "Pending" until an admin approves them via the
    // email sent to config.adminApprovalEmail — they cannot log in until then.
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },

    // One-time token embedded in the approve/reject email links. Cleared
    // once the account has been actioned.
    approvalToken: {
        type: String,
        default: null,
    },
}, { timestamps : true })

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model("User", userSchema);