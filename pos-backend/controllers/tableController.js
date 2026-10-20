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

const Order = require("../models/orderModel");

const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate({
      path: "currentOrder",
      select: "customerDetails items bills orderStatus orderNumber orderDate paymentMethod tables combinedTableNos"
    });

    const populatedTables = await Promise.all(
      tables.map(async (table) => {
        const tableObj = table.toObject();
        if (tableObj.status === "Booked" && (!tableObj.currentOrder || !tableObj.currentOrder.customerDetails)) {
          const activeOrder = await Order.findOne({
            $or: [{ table: table._id }, { tables: table._id }],
            orderStatus: { $in: ["In Progress", "Ready", "Pending"] },
          }).sort({ orderDate: -1 });

          if (activeOrder) {
            tableObj.currentOrder = activeOrder;
          }
        }
        return tableObj;
      })
    );

    // Compute combined relationships: tables sharing the same active currentOrder
    const orderToTablesMap = {};
    populatedTables.forEach((t) => {
      const orderId = t.currentOrder?._id ? String(t.currentOrder._id) : null;
      if (orderId && t.status === "Booked") {
        if (!orderToTablesMap[orderId]) orderToTablesMap[orderId] = [];
        orderToTablesMap[orderId].push(t);
      }
    });

    const enrichedTables = populatedTables.map((t) => {
      const orderId = t.currentOrder?._id ? String(t.currentOrder._id) : null;
      if (orderId && orderToTablesMap[orderId] && orderToTablesMap[orderId].length > 1) {
        const peers = orderToTablesMap[orderId].filter((peer) => String(peer._id) !== String(t._id));
        const peerNos = peers.map((p) => p.tableNo).sort((a, b) => a - b);
        const allNos = orderToTablesMap[orderId].map((p) => p.tableNo).sort((a, b) => a - b);
        const totalSeats = orderToTablesMap[orderId].reduce((sum, p) => sum + (Number(p.seats) || 0), 0);
        return {
          ...t,
          isCombined: true,
          combinedWith: peerNos,
          combinedTableNos: allNos.join(" + "),
          combinedTotalSeats: totalSeats,
        };
      }
      return {
        ...t,
        isCombined: Boolean(t.currentOrder?.combinedTableNos),
        combinedTableNos: t.currentOrder?.combinedTableNos || "",
      };
    });

    res.status(200).json({ success: true, data: enrichedTables });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { status, orderId, seats, tableNo } = req.body;

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        const error = createHttpError(404, "Invalid id!");
        return next(error);
    }

    const update = {};
    if (status !== undefined) update.status = status;
    if (seats !== undefined) update.seats = seats;
    if (tableNo !== undefined) update.tableNo = tableNo;

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

    if (Array.isArray(req.body.tableIds) && req.body.tableIds.length > 0) {
      await Table.updateMany(
        { _id: { $in: req.body.tableIds } },
        update
      );
    }

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

// POST /api/table/:id/reserve
const addReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, phone, guests, reservationTime, notes } = req.body;

    if (!customerName || !phone || !guests || !reservationTime) {
      return next(createHttpError(400, "Customer name, phone, number of guests, and reservation time are required."));
    }

    const table = await Table.findById(id);
    if (!table) {
      return next(createHttpError(404, "Table not found!"));
    }

    const newReservation = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      guests: Number(guests),
      reservationTime: new Date(reservationTime),
      notes: notes || "",
      status: "Confirmed",
    };

    if (!Array.isArray(table.reservations)) {
      table.reservations = [];
    }

    table.reservations.push(newReservation);
    await table.save();

    res.status(201).json({
      success: true,
      message: `Table #${table.tableNo} reserved for ${customerName}!`,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/table/:id/reserve/:reservationId
const updateReservationStatus = async (req, res, next) => {
  try {
    const { id, reservationId } = req.params;
    const { status } = req.body;

    if (!["Confirmed", "Arrived", "Cancelled", "No-Show"].includes(status)) {
      return next(createHttpError(400, "Invalid reservation status."));
    }

    const table = await Table.findById(id);
    if (!table) {
      return next(createHttpError(404, "Table not found!"));
    }

    const reservation = table.reservations.id(reservationId);
    if (!reservation) {
      return next(createHttpError(404, "Reservation not found!"));
    }

    reservation.status = status;

    if (status === "Arrived") {
      table.status = "Booked";
    }

    await table.save();

    res.status(200).json({
      success: true,
      message: `Reservation marked as ${status}.`,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTable,
  getTables,
  updateTable,
  deleteTable,
  addReservation,
  updateReservationStatus,
};

