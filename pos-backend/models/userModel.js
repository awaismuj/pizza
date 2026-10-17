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
        type : Number,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message : "Phone number must be a 10-digit number!"
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

    // Granular Capability & Permission Matrix
    permissions: {
        canAccessERP: { type: Boolean, default: false },
        canManageOrders: { type: Boolean, default: true },
        canManageMenu: { type: Boolean, default: false },
        canManageInventory: { type: Boolean, default: false },
        canManageStaff: { type: Boolean, default: false },
        canViewFinancials: { type: Boolean, default: false },
        canManageAssets: { type: Boolean, default: false },
        canManageSettings: { type: Boolean, default: false },
        canDeleteRecords: { type: Boolean, default: false },
    },

    // Whether this staff user has permission to access the Manager ERP portal
    canAccessERP: {
        type: Boolean,
        default: false,
    },

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

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model("User", userSchema);