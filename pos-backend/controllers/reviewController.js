const createHttpError = require("http-errors");
const Review = require("../models/reviewModel");

// Light in-memory throttle: max 3 reviews per IP per hour. Enough to stop
// accidental double-posts and casual spam without needing extra infra.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map();

const throttled = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
};

const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

// ---- public --------------------------------------------------------

const getPublicReviews = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100);
    const [reviews, stats] = await Promise.all([
      Review.find({ isVisible: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("name rating title comment dish createdAt"),
      Review.aggregate([
        { $match: { isVisible: true } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
      ]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;
    stats.forEach(({ _id, count }) => {
      distribution[_id] = count;
      total += count;
      sum += _id * count;
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        summary: {
          total,
          average: total ? Math.round((sum / total) * 10) / 10 : 0,
          distribution,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createPublicReview = async (req, res, next) => {
  try {
    const name = clean(req.body.name, 60);
    const comment = clean(req.body.comment, 1200);
    const title = clean(req.body.title, 100);
    const dish = clean(req.body.dish, 80);
    const rating = Number(req.body.rating);

    // Honeypot: real people never fill this hidden field.
    if (req.body.website) {
      return res.status(201).json({ success: true, message: "Thanks for your review!" });
    }
    if (!name) throw createHttpError(400, "Please enter your name.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw createHttpError(400, "Please choose a star rating from 1 to 5.");
    }
    if (comment.length < 10) {
      throw createHttpError(400, "Please write at least a few words (10+ characters).");
    }
    if (throttled(req.ip)) {
      throw createHttpError(429, "You've sent a few reviews already. Please try again later.");
    }

    const review = await Review.create({ name, rating, title, comment, dish });
    res.status(201).json({ success: true, message: "Thanks for your review!", data: review });
  } catch (error) {
    next(error);
  }
};

// ---- admin (POS dashboard) -----------------------------------------

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

const toggleReviewVisibility = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw createHttpError(404, "Review not found!");
    review.isVisible = !review.isVisible;
    await review.save();
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) throw createHttpError(404, "Review not found!");
    res.status(200).json({ success: true, message: "Review deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicReviews,
  createPublicReview,
  getAllReviews,
  toggleReviewVisibility,
  deleteReview,
};
