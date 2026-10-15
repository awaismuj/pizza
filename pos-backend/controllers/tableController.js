const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose")

const addTable = async (req, res, next) => {
  try {
    const { tableNo, seats } = req.body;
    if (!tableNo) {
      const error = createHttpError(400, "Please provide table No!");
      return next(error);
    }
    const isTablePresent = await Table.findOne({ tableNo });

    if (isTablePresent) {
      const error = createHttpError(400, "Table already exist!");
      return next(error);
    }

    const newTable = new Table({ tableNo, seats });
    await newTable.save();
    res
      .status(201)
      .json({ success: true, message: "Table added!", data: newTable });
  } catch (error) {
    next(error);
  }
};

const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate({
      path: "currentOrder",
      select: "customerDetails"
    });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { status, orderId, seats } = req.body;

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        const error = createHttpError(404, "Invalid id!");
        return next(error);
    }

    // Build the update carefully instead of always writing { status, currentOrder: orderId }.
    // The old code always set currentOrder to whatever orderId was (including
    // undefined), so a table booked for an order that later got deleted/lost
    // its link had no way to be freed again except by touching the DB
    // directly — that's the "table shows Booked but no order is active" bug.
    const update = {};
    if (status !== undefined) update.status = status;
    if (seats !== undefined) update.seats = seats;

    if (orderId !== undefined) {
      // Booking flow (Bill.jsx) explicitly ties the table to an order.
      update.currentOrder = orderId || null;
    } else if (status === "Available") {
      // Admin/staff manually freeing a table (or fixing a stuck one) — always
      // clear whatever order it was pointing at, even if none was supplied.
      update.currentOrder = null;
    }

    const table = await Table.findByIdAndUpdate(
        id,
      update,
      { new: true }
    );

    if (!table) {
      const error = createHttpError(404, "Table not found!");
      return next(error);
    }

    res.status(200).json({success: true, message: "Table updated!", data: table});

  } catch (error) {
    next(error);
  }
};

// Admin-only: remove a table entirely. Refuses to delete a currently booked
// table so an active order can't be orphaned.
const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const table = await Table.findById(id);
    if (!table) {
      const error = createHttpError(404, "Table not found!");
      return next(error);
    }

    if (table.status === "Booked") {
      const error = createHttpError(400, "Free this table before deleting it.");
      return next(error);
    }

    await Table.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Table deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTable, getTables, updateTable, deleteTable };
