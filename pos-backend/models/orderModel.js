const mongoose = require("mongoose");

// Full lifecycle across both order sources:
//  - Dine-in / POS: "In Progress" -> "Ready" -> "Closed"
//  - Online (genzpizza.online): "Pending" (needs staff Accept/Cancel) ->
//    "Accepted" -> "Preparing" -> "Ready to Deliver" -> "Completed"
//    (or "Cancelled" at the Pending stage)
const ORDER_STATUSES = [
    "In Progress", "Ready", "Closed",
    "Pending", "Accepted", "Preparing", "Ready to Deliver", "Completed", "Cancelled",
    // Online order paid by JazzCash/Raast QR: the customer has sent money
    // and a screenshot, staff still have to confirm it actually arrived.
    // Behaves like "Pending" (no stock deducted yet, but stock is reserved).
    "Payment Pending Verification",
];

// Payment methods for online orders (POS orders keep using "Cash"/"Online").
const PAYMENT_METHOD_COD = "Cash on Delivery";
const PAYMENT_METHOD_JAZZCASH = "JazzCash/Raast";
const PAYMENT_STATUSES = ["Pending", "Verified", "Rejected"];

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, requried: true},
        guests: { type: Number, required: true },
        address: { type: String, default: "" },
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ORDER_STATUSES,
    },
    // One entry per status this order has actually passed through, in
    // order, so staff/customers can see exactly when it was placed, when
    // work started, when it was ready, and when it was handed
    // over/closed — not just the current status.
    statusHistory: [
        {
            status: { type: String, enum: ORDER_STATUSES, required: true },
            at: { type: Date, default: Date.now },
            _id: false,
        },
    ],
    // Where the order came from — the in-house POS, or the public
    // genzpizza.online ordering site.
    orderSource: {
        type: String,
        enum: ["POS", "Online"],
        default: "POS",
    },
    // Human-facing order number: "<YYYYMMDD><3-digit sequence>", e.g.
    // "20260927001" for the 1st order placed on 27 Sep 2026, "20260927002"
    // for the 2nd, and so on. The sequence resets to 001 at the start of
    // every new calendar day (see utils/orderNumber.js), so this doubles as
    // a running count of "how many orders came in today" - the same field
    // is used for every order type (POS dine-in/takeaway AND online).
    // `sparse` so older orders created before this field existed (which
    // have no orderNumber) don't collide against the unique index.
    orderNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    orderDate: {
        type: Date,
        // IMPORTANT: this must be `Date.now` (a function reference), never
        // `Date.now()` (a function CALL). Mongoose calls the function fresh
        // for every new document, but a call baked in here would evaluate
        // exactly once - the moment this file is first `require`d when the
        // server boots - and every order that doesn't explicitly pass its
        // own orderDate would then be stamped with that same frozen instant
        // for as long as the server stays up. That was the actual cause of
        // multiple, unrelated orders all showing the identical date/time.
        default : Date.now
    },
    // Cost of the ingredients/stock actually consumed for this order, i.e.
    // cost of goods sold ("Purchases/Cost" in the Profit report), captured
    // at the moment inventory is deducted for it (order placed for POS,
    // order accepted for Online) so it reflects real inventory cost prices
    // at that time and never has to be recomputed/estimated later.
    costOfGoods: {
        type: Number,
        default: 0,
    },
    bills: {
        total: { type: Number, required: true },
        tax: { type: Number, required: true },
        totalWithTax: { type: Number, required: true },
        // Build Your Own Deal. `total` above is ALWAYS the amount after any
        // discount (so reports, tax and revenue stay correct untouched);
        // these three only exist so receipts can show how it was reached.
        subtotal: { type: Number },        // before the discount
        discount: { type: Number, default: 0 },
        discountPercent: { type: Number, default: 0 },
        discountLabel: { type: String, default: "" },
    },
    items: [],
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    // Tracks whether stock has actually been taken out of inventory for this
    // order, so cancellation logic knows whether there is anything to give
    // back and never restores/deducts the same order twice.
    inventoryDeducted: {
        type: Boolean,
        default: false,
    },
    paymentMethod: String,
    // Pending / Verified / Rejected. Only set on online orders. Cash on
    // Delivery orders turn Verified once delivered (cash collected);
    // JazzCash/Raast orders turn Verified when staff confirm the money.
    paymentStatus: { type: String, enum: PAYMENT_STATUSES },
    // Normalised (UPPERCASE) JazzCash/Raast transaction ID. Unique so the
    // same payment can never be used to pay for two orders. Left undefined
    // (not null) for every other order so the sparse index ignores them.
    jazzcashTid: { type: String, unique: true, sparse: true },
    jazzcash: {
        tid: String,                 // as displayed (normalised)
        senderInfo: String,          // sender's name or number
        amount: Number,              // exact total the customer must pay
        proofId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentProof" },
        rejectionReason: String,
        verifiedAt: Date,
        verifiedBy: { userId: mongoose.Schema.Types.ObjectId, name: String },
        rejectedAt: Date,
        rejectedBy: { userId: mongoose.Schema.Types.ObjectId, name: String },
    },
    paymentData: {
        razorpay_order_id: String,
        razorpay_payment_id: String
    }
}, { timestamps : true } );

orderSchema.statics.ORDER_STATUSES = ORDER_STATUSES;
orderSchema.statics.PAYMENT_METHOD_COD = PAYMENT_METHOD_COD;
orderSchema.statics.PAYMENT_METHOD_JAZZCASH = PAYMENT_METHOD_JAZZCASH;

module.exports = mongoose.model("Order", orderSchema);