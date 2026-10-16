const createHttpError = require("http-errors");
const Review = require("../models/reviewModel");

// ---- Public (genzpizza.online storefront) endpoints ---------------------

// Submit a new review. No login required (the storefront has no auth), but
// ratings and text are validated server-side. One review per customer per
// product; duplicate submissions are rejected.
const addReview = async (req, res, next) => {
  try {
    const { customerName, rating, reviewText, productName } = req.body;

    if (!customerName || !customerName.trim()) {
      return next(createHttpError(400, "Please provide your name."));
    }
    const name = String(customerName).trim();
    if (name.length < 2 || name.length > 60) {
      return next(createHttpError(400, "Name must be between 2 and 60 characters."));
    }

    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return next(createHttpError(400, "Please select a rating of 1-5 stars."));
    }

    if (!reviewText || !reviewText.trim()) {
      return next(createHttpError(400, "Please write your review."));
    }
    const text = String(reviewText).trim();
    if (text.length < 5 || text.length > 1000) {
      return next(createHttpError(400, "Review must be between 5 and 1000 characters."));
    }

    const product = productName ? String(productName).trim().slice(0, 120) : "";

    // Prevent duplicate reviews for the same customer + product.
    const existing = await Review.findOne({ customerName: name, productName: product });
    if (existing) {
      return next(createHttpError(409, "You've already reviewed this item."));
    }

    const review = await Review.create({
      customerName: name,
      rating: stars,
      reviewText: text,
      productName: product,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Thanks! Your review is awaiting moderation.",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Approved reviews only - what customers see on the storefront.
const getPublicReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// ---- Admin (POS dashboard) endpoints -----------------------------------

// All reviews with their moderation status, newest first.
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// Update a review's status (approve / reject / hide) and optional staff note.
const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, moderationNote } = req.body;

    if (!id) {
      return next(createHttpError(400, "Review id is required."));
    }
    if (!["approved", "rejected", "hidden"].includes(status)) {
      return next(createHttpError(400, "Invalid status."));
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status, moderationNote: moderationNote ? String(moderationNote).trim() : "" },
      { new: true }
    );
    if (!review) {
      return next(createHttpError(404, "Review not found."));
    }

    res.status(200).json({
      success: true,
      message: `Review ${status}.`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, "Review id is required."));
    }
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return next(createHttpError(404, "Review not found."));
    }
    res.status(200).json({ success: true, message: "Review deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getPublicReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
