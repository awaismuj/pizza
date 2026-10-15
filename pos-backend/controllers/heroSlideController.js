const createHttpError = require("http-errors");
const HeroSlide = require("../models/heroSlideModel");

const buildHeroSlidePayload = (body) => {
  const { image, link, altText, isActive } = body;

  if (!image || !String(image).trim()) {
    throw createHttpError(400, "Please upload a slide image!");
  }

  return {
    image: String(image).trim(),
    link: link ? String(link).trim() : "",
    altText: altText ? String(altText).trim() : "",
    isActive: isActive === undefined ? true : Boolean(isActive),
  };
};

// ---- admin (POS dashboard) endpoints ---------------------------------

const addHeroSlide = async (req, res, next) => {
  try {
    const data = buildHeroSlidePayload(req.body);
    // New slides go to the back of the line by default.
    const lastSlide = await HeroSlide.findOne().sort({ order: -1 });
    data.order = lastSlide ? lastSlide.order + 1 : 0;
    const slide = await HeroSlide.create(data);
    res.status(201).json({ success: true, message: "Slide added!", data: slide });
  } catch (error) {
    next(error);
  }
};

// Returns every slide (active + inactive) so staff can see/manage the full
// set, including ones currently switched off.
const getHeroSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    next(error);
  }
};

const updateHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const error = createHttpError(400, "Slide id is required!");
      return next(error);
    }

    const data = buildHeroSlidePayload(req.body);
    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, data, { new: true });

    if (!updatedSlide) {
      const error = createHttpError(404, "Slide not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Slide updated successfully!", data: updatedSlide });
  } catch (error) {
    next(error);
  }
};

// Quick on/off switch, so a slide can be paused without deleting/reuploading
// it later.
const toggleHeroSlideStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      const error = createHttpError(404, "Slide not found!");
      return next(error);
    }

    slide.isActive = !slide.isActive;
    await slide.save();

    res.status(200).json({
      success: true,
      message: `Slide ${slide.isActive ? "activated" : "deactivated"}.`,
      data: slide,
    });
  } catch (error) {
    next(error);
  }
};

const reorderHeroSlides = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, position }]
    if (!Array.isArray(order)) {
      const error = createHttpError(400, "Order must be an array");
      return next(error);
    }

    const ops = order.map((item) =>
      HeroSlide.findByIdAndUpdate(item.id, { order: Number(item.position) }, { new: true })
    );
    await Promise.all(ops);

    res.status(200).json({ success: true, message: "Slides reordered" });
  } catch (error) {
    next(error);
  }
};

const deleteHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByIdAndDelete(id);

    if (!slide) {
      const error = createHttpError(404, "Slide not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Slide deleted successfully!", data: slide });
  } catch (error) {
    next(error);
  }
};

// ---- public (genzpizza.online storefront) endpoint --------------------

// Only returns slides that are switched on, in staff-set order — this is
// what powers the full-width homepage slider.
const getPublicHeroSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addHeroSlide,
  getHeroSlides,
  updateHeroSlide,
  toggleHeroSlideStatus,
  reorderHeroSlides,
  deleteHeroSlide,
  getPublicHeroSlides,
};
