import { useEffect, useMemo, useRef, useState } from "react";
import { FaDownload, FaMagic, FaPlus, FaSpinner, FaTrash, FaUpload } from "react-icons/fa";
import PropTypes from "prop-types";
import brandLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import { generatePosterFoodImage } from "../../https";

const IMAGE_STYLES = [
  { value: "photorealistic", label: "Realistic menu photo" },
  { value: "cinematic", label: "Cinematic close-up" },
  { value: "overhead", label: "Top-down flat lay" },
  { value: "street_food", label: "Street-food vibe" },
  { value: "studio", label: "Bright studio" },
  { value: "illustrated", label: "Painted illustration" },
];

const TEXT_STYLES = {
  bold: { label: "Bold brush", displayFont: 'Impact, "Arial Black", "Arial Narrow", sans-serif', bodyFont: "Inter, Arial, sans-serif" },
  modern: { label: "Modern clean", displayFont: '"Arial Black", Arial, sans-serif', bodyFont: "Inter, Arial, sans-serif" },
  elegant: { label: "Elegant serif", displayFont: 'Georgia, "Times New Roman", serif', bodyFont: 'Georgia, "Times New Roman", serif' },
};

const PHOTOS = {
  pizza: {
    label: "Pizza",
    src: "/poster-food/pizza.jpg",
    creator: "SristiAwasthi21",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Pizza_(_Italian_Food).jpg",
  },
  burger: {
    label: "Burger",
    src: "/poster-food/burger.jpg",
    creator: "Missvain",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Acme_Burger_-_April_2025_-_Sarah_Stierch.jpg",
  },
  shawarma: {
    label: "Shawarma",
    src: "/poster-food/shawarma.jpg",
    creator: "Andy Li",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Chicken_Shawarma_Platter_-_Lavash_2025-02-10.jpg",
  },
  chicken: {
    label: "Fried chicken",
    src: "/poster-food/chicken.jpg",
    creator: "Corn cheese",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Fried_chicken_and_sriracha.jpg",
  },
  cola: {
    label: "Cola drink",
    src: "/poster-food/cola.jpg",
    creator: "pic_p_ter",
    license: "Public Domain",
    source: "https://commons.wikimedia.org/wiki/File:Glass_cola.jpg",
  },
};

const SIZES = {
  square: { label: "Square · 1080 × 1080", width: 1080, height: 1080 },
  portrait: { label: "Portrait · 1080 × 1350", width: 1080, height: 1350 },
  story: { label: "Story · 1080 × 1920", width: 1080, height: 1920 },
  landscape: { label: "Landscape · 1200 × 628", width: 1200, height: 628 },
};

const THEMES = {
  genz: { label: "Gen-Z Classic", background: "#0b0907", panel: "#21130c", accent: "#ffdc00", highlight: "#e21b27", ink: "#fffdf7" },
  sunset: { label: "Sunset", background: "#21100d", panel: "#2b1713", accent: "#ffb703", highlight: "#ff583e", ink: "#fff8ed" },
  berry: { label: "Berry", background: "#21112f", panel: "#301a40", accent: "#ffb7d5", highlight: "#ed5f83", ink: "#fff7fb" },
  mint: { label: "Mint", background: "#092b2b", panel: "#123a38", accent: "#a8f0ca", highlight: "#f4aa4e", ink: "#f5fff9" },
};

const INITIAL_ITEMS = [
  { id: 1, name: "Small pizza", quantity: 1, imageStyle: "photorealistic" },
  { id: 2, name: "1L cold drink", quantity: 1, imageStyle: "photorealistic" },
  { id: 3, name: "Burger", quantity: 1, imageStyle: "photorealistic" },
  { id: 4, name: "Shawarma", quantity: 1, imageStyle: "photorealistic" },
];

const imageCache = new Map();

const loadPosterImage = (src) => {
  if (!src.startsWith("blob:") && !src.startsWith("data:") && imageCache.has(src)) return imageCache.get(src);
  const imagePromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load poster image: ${src}`));
    image.src = src;
  });
  if (!src.startsWith("blob:") && !src.startsWith("data:")) imageCache.set(src, imagePromise);
  return imagePromise;
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Number(value) || 0);

const roundRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const drawCover = (ctx, image, x, y, width, height) => {
  const scale = Math.max(width / image.width, height / image.height);
  const drawnWidth = image.width * scale;
  const drawnHeight = image.height * scale;
  ctx.drawImage(image, x + (width - drawnWidth) / 2, y + (height - drawnHeight) / 2, drawnWidth, drawnHeight);
};

const fitText = (ctx, text, maxWidth) => {
  let result = text;
  while (result.length > 1 && ctx.measureText(`${result}…`).width > maxWidth) {
    result = result.slice(0, -1);
  }
  return result === text ? text : `${result}…`;
};

const drawBrushShape = (ctx, x, y, width, height, color) => {
  ctx.beginPath();
  ctx.moveTo(x + width * 0.02, y + height * 0.2);
  ctx.lineTo(x + width * 0.18, y + height * 0.08);
  ctx.lineTo(x + width * 0.37, y + height * 0.12);
  ctx.lineTo(x + width * 0.55, y + height * 0.02);
  ctx.lineTo(x + width * 0.79, y + height * 0.1);
  ctx.lineTo(x + width * 0.98, y + height * 0.03);
  ctx.lineTo(x + width * 0.94, y + height * 0.28);
  ctx.lineTo(x + width, y + height * 0.47);
  ctx.lineTo(x + width * 0.95, y + height * 0.71);
  ctx.lineTo(x + width * 0.99, y + height * 0.91);
  ctx.lineTo(x + width * 0.74, y + height * 0.86);
  ctx.lineTo(x + width * 0.52, y + height * 0.98);
  ctx.lineTo(x + width * 0.3, y + height * 0.88);
  ctx.lineTo(x + width * 0.08, y + height * 0.96);
  ctx.lineTo(x + width * 0.12, y + height * 0.72);
  ctx.lineTo(x, y + height * 0.53);
  ctx.lineTo(x + width * 0.06, y + height * 0.34);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const drawBurst = (ctx, centerX, centerY, radiusX, radiusY, color) => {
  ctx.beginPath();
  for (let index = 0; index < 32; index += 1) {
    const angle = (Math.PI * 2 * index) / 32 - Math.PI / 2;
    const radius = index % 2 === 0 ? 1 : 0.88;
    const x = centerX + Math.cos(angle) * radiusX * radius;
    const y = centerY + Math.sin(angle) * radiusY * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const drawPhotoCard = (ctx, image, x, y, width, height, angle, accent) => {
  if (!image) return;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 14;
  roundRect(ctx, -width / 2, -height / 2, width, height, 22);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.save();
  roundRect(ctx, -width / 2 + 9, -height / 2 + 9, width - 18, height - 18, 16);
  ctx.clip();
  drawCover(ctx, image, -width / 2 + 9, -height / 2 + 9, width - 18, height - 18);
  ctx.restore();
  ctx.restore();
};

const drawProductTag = (ctx, text, x, y, width, height, fill, fontSize, fontFamily) => {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(-0.035);
  drawBrushShape(ctx, -width / 2, -height / 2, width, height, fill);
  let fittedFontSize = fontSize;
  ctx.font = `900 ${fittedFontSize}px ${fontFamily}`;
  while (fittedFontSize > 12 && ctx.measureText(text).width > width * 0.82) {
    fittedFontSize -= 1;
    ctx.font = `900 ${fittedFontSize}px ${fontFamily}`;
  }
  ctx.fillStyle = "#fffdf7";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 0, width * 0.82);
  ctx.restore();
};

const drawPhoneIcon = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.font = `900 ${radius * 1.45}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e21b27";
  ctx.fillText("☎", x, y + 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
};

const drawPoster = (canvas, images, photo, settings) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is not available in this browser.");

  const { width, height } = settings.size;
  const scale = width / 1080;
  const logicalHeight = height / scale;
  const theme = settings.theme;
  const typography = TEXT_STYLES[settings.textStyle] || TEXT_STYLES.bold;
  const { template, items } = settings;
  const image = images.hero;
  const includeSupportingCredits = template === "Gen-Z Blast" && logicalHeight >= 700;
  const hasDiscount = Number(settings.originalPrice) > Number(settings.offerPrice);
  const discount = hasDiscount
    ? Math.round((1 - Number(settings.offerPrice) / Number(settings.originalPrice)) * 100)
    : 0;
  const setFont = (size, weight = 600) => {
    ctx.font = `${weight} ${size}px ${typography.bodyFont}`;
  };
  const drawText = (text, x, y, size, color, weight = 600, maxWidth = Infinity) => {
    setFont(size, weight);
    ctx.fillStyle = color;
    const content = fitText(ctx, String(text), maxWidth);
    if (Number.isFinite(maxWidth)) ctx.fillText(content, x, y, maxWidth);
    else ctx.fillText(content, x, y);
  };
  const drawDisplayText = (text, x, y, size, color, weight, maxWidth, alignment = "left") => {
    ctx.font = `${weight} ${size}px ${typography.displayFont}`;
    ctx.fillStyle = color;
    ctx.textAlign = alignment;
    ctx.fillText(fitText(ctx, String(text), maxWidth), alignment === "center" ? x + maxWidth / 2 : x, y, maxWidth);
    ctx.textAlign = "left";
  };
  const drawCenteredText = (text, x, y, size, color, weight, maxWidth) =>
    drawDisplayText(text, x - maxWidth / 2, y, size, color, weight, maxWidth, "center");
  const drawCenteredFitText = (text, x, y, size, minSize, color, weight, maxWidth) => {
    let fittedSize = size;
    ctx.font = `${weight} ${fittedSize}px ${typography.displayFont}`;
    while (fittedSize > minSize && ctx.measureText(String(text)).width > maxWidth) {
      fittedSize -= 1;
      ctx.font = `${weight} ${fittedSize}px ${typography.displayFont}`;
    }
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(String(text), x, y, maxWidth);
    ctx.textAlign = "left";
  };
  const drawItems = (x, y, maxWidth, rowHeight, fontSize, color) => {
    const visibleItems = items.filter((item) => item.name.trim());
    visibleItems.forEach((item, index) => {
      const rowY = y + index * rowHeight;
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(x + 9, rowY - fontSize * 0.36, Math.max(4, fontSize * 0.12), 0, Math.PI * 2);
      ctx.fill();
      drawText(`${item.quantity} × ${item.name.trim()}`, x + 30, rowY, fontSize, color, 600, maxWidth - 38);
    });
  };
  const drawPrice = (x, y, widthAvailable, compact = false) => {
    const boxHeight = compact ? 138 : 164;
    roundRect(ctx, x, y, widthAvailable, boxHeight, 22);
    ctx.fillStyle = theme.panel;
    ctx.fill();
    if (hasDiscount) {
      roundRect(ctx, x + 18, y + 16, 145, 34, 17);
      ctx.fillStyle = theme.highlight;
      ctx.fill();
      drawText(`SAVE ${discount}%`, x + 32, y + 40, 17, "#ffffff", 800, 120);
    } else {
      drawText("TODAY'S PRICE", x + 22, y + 42, 17, theme.accent, 800, widthAvailable - 44);
    }
    const priceY = compact ? y + 100 : y + 116;
    const offerSize = compact ? 42 : 50;
    drawText(`Rs ${formatPrice(settings.offerPrice)}`, x + 22, priceY, offerSize, theme.ink, 800, widthAvailable - 44);
    if (hasDiscount) {
      setFont(22, 500);
      const original = fitText(ctx, `Rs ${formatPrice(settings.originalPrice)}`, widthAvailable - 48);
      ctx.fillStyle = "#d2c6c2";
      ctx.fillText(original, x + 24, priceY + 34, widthAvailable - 48);
      const measuredWidth = Math.min(ctx.measureText(original).width, widthAvailable - 48);
      ctx.strokeStyle = theme.highlight;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 22, priceY + 27);
      ctx.lineTo(x + 24 + measuredWidth, priceY + 27);
      ctx.stroke();
    }
  };
  const drawCredit = (x, y, maxWidth, color) => {
    const credits = photo?.creator
      ? [`${photo.creator} (${photo.license})`]
      : settings.heroImageSource === "gemini"
        ? ["AI-GENERATED WITH GEMINI"]
        : settings.heroIsUploadedItem
          ? ["uploaded item photo"]
          : ["your uploaded photo"];
    if (includeSupportingCredits) {
      credits.push(...(settings.supportPhotoKeys || []).map((key) => `${PHOTOS[key].creator} (${PHOTOS[key].license})`));
      const itemSources = settings.supportingSources?.filter((source) => source.type === "item") || [];
      if (itemSources.some((source) => source.item.imageSource === "gemini")) {
        credits.push("AI-GENERATED WITH GEMINI");
      }
      if (itemSources.some((source) => source.item.imageSource !== "gemini")) {
        credits.push("uploaded item photos");
      }
    }
    const hasCommonsPhoto = Boolean(photo) || (includeSupportingCredits && settings.supportPhotoKeys?.length > 0);
    const source = hasCommonsPhoto ? " · WIKIMEDIA COMMONS" : "";
    const text = `${includeSupportingCredits ? "PHOTOS" : "PHOTO"}: ${credits.join(", ")}${source}`;
    drawText(text, x, y, 14, color, 500, maxWidth);
  };
  const drawBrand = (x, y, maxWidth, color) => {
    drawText(settings.brand.trim() || "YOUR BRAND", x, y, 28, color, 800, maxWidth);
    drawText(settings.tagline.trim() || "MADE FRESH. MADE FOR YOU.", x, y + 34, 15, color, 500, maxWidth);
  };

  canvas.width = width;
  canvas.height = height;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 1080, logicalHeight);

  if (template === "Gen-Z Blast") {
    const compact = logicalHeight < 700;
    if (compact) {
      const sidePhotos = images.supporting;
      if (image) drawPhotoCard(ctx, image, 408, 38, 340, 490, 0.012, theme.accent);
      if (sidePhotos[0]) drawPhotoCard(ctx, sidePhotos[0], 770, 34, 275, 222, -0.012, theme.ink);
      if (sidePhotos[1]) drawPhotoCard(ctx, sidePhotos[1], 770, 274, 275, 222, 0.014, theme.highlight);
      if (images.logo) ctx.drawImage(images.logo, 22, 22, 106, 106);
      drawDisplayText(settings.brand, 140, 66, 29, theme.accent, 900, 245);
      drawText(settings.tagline, 143, 96, 14, theme.ink, 700, 242);
      drawBrushShape(ctx, 26, 144, 350, 82, theme.highlight);
      drawDisplayText(settings.headline || "SPECIAL DEAL", 43, 200, 35, "#ffffff", 900, 315, "center");
      drawText("IN THIS DEAL", 35, 267, 18, theme.accent, 900, 310);
      drawItems(38, 304, 340, 34, 18, theme.ink);
      drawBurst(ctx, 196, 468, 150, 78, theme.accent);
      drawCenteredText("ONLY", 196, 446, 18, theme.highlight, 900, 200);
      drawCenteredText(`Rs ${formatPrice(settings.offerPrice)}`, 196, 477, 29, "#101010", 900, 205);
      drawText(settings.phone, 25, 552, 20, theme.ink, 900, 365);
      drawCredit(775, 548, 270, "#e4d9d5");
      return;
    }

    const logoSize = Math.min(300, Math.max(180, logicalHeight * 0.16));
    const logoX = 30;
    const logoY = Math.max(14, logicalHeight * 0.012);
    if (images.logo) ctx.drawImage(images.logo, logoX, logoY, logoSize, logoSize);
    const brandX = logoX + logoSize + 20;
    const brandWidth = 1080 - brandX - 40;
    drawDisplayText(settings.brand || "GEN-Z PIZZA LAND", brandX, logoY + logoSize * 0.47, 54, theme.accent, 900, brandWidth);
    drawText(settings.tagline || "GOOD FOOD · GREAT MOOD", brandX + 2, logoY + logoSize * 0.65, 24, theme.ink, 700, brandWidth);
    drawText("FRESH • HOT • MADE WITH LOVE", brandX + 2, logoY + logoSize * 0.79, 18, theme.highlight, 800, brandWidth);

    const bannerY = Math.max(logoY + logoSize + 12, logicalHeight * 0.17);
    const bannerHeight = Math.max(74, Math.min(150, logicalHeight * 0.085));
    if (/^special deal$/i.test(settings.headline.trim())) {
      drawBrushShape(ctx, 38, bannerY, 1005, bannerHeight, theme.highlight);
      drawBrushShape(ctx, 544, bannerY + bannerHeight * 0.69, 482, bannerHeight * 0.3, theme.accent);
      drawDisplayText("SPECIAL", 72, bannerY + bannerHeight * 0.7, Math.min(92, bannerHeight * 0.69), "#ffffff", 900, 500);
      drawDisplayText("DEAL", 570, bannerY + bannerHeight * 0.73, Math.min(77, bannerHeight * 0.58), "#11100a", 900, 405);
    } else {
      drawBrushShape(ctx, 38, bannerY, 1005, bannerHeight, theme.highlight);
      drawDisplayText(settings.headline || "SPECIAL DEAL", 68, bannerY + bannerHeight * 0.7, Math.min(88, bannerHeight * 0.66), "#ffffff", 900, 934, "center");
    }

    const photoY = bannerY + bannerHeight + 24;
    const photoHeight = Math.min(logicalHeight * 0.35, logicalHeight - photoY - logicalHeight * 0.39);
    const supporting = images.supporting;
    const sideKeys = settings.supportPhotoKeys || [];
    const cardGap = 12;
    const sideX = 660;
    const sideWidth = 385;
    const sideHeight = (photoHeight - cardGap * 2) / 3;
    drawPhotoCard(ctx, image, 24, photoY, 650, photoHeight, -0.008, theme.accent);
    supporting.forEach((sideImage, index) => {
      if (!sideImage) return;
      const sideY = photoY + index * (sideHeight + cardGap);
      drawPhotoCard(ctx, sideImage, sideX, sideY, sideWidth, sideHeight, index % 2 === 0 ? 0.01 : -0.01, index === 1 ? theme.highlight : theme.ink);
      const source = settings.supportingSources?.[index];
      const sideKey = source?.key || sideKeys[index];
      const matchingItem = source?.item || items.find((item) => {
        const pattern = sideKey === "cola" ? /drink|cola|soda|coke/i : sideKey === "burger" ? /burger/i : sideKey === "shawarma" ? /shawarma/i : /chicken|nugget/i;
        return pattern.test(item.name);
      }) || items[Math.min(index + 1, items.length - 1)];
      const label = matchingItem ? `${matchingItem.quantity} × ${matchingItem.name}` : PHOTOS[sideKey]?.label || "SPECIAL";
      drawProductTag(
        ctx,
        label.toUpperCase(),
        sideX + 12,
        sideY + sideHeight - Math.min(54, sideHeight * 0.34),
        sideWidth * 0.86,
        Math.min(52, sideHeight * 0.34),
        theme.highlight,
        Math.max(18, Math.min(34, sideHeight * 0.16)),
        typography.displayFont
      );
    });

    const heroPattern = settings.heroPhotoKey === "custom"
      ? null
      : settings.heroPhotoKey === "cola"
      ? /drink|cola|soda|coke/i
      : settings.heroPhotoKey === "shawarma"
        ? /shawarma/i
        : settings.heroPhotoKey === "burger"
          ? /burger/i
          : settings.heroPhotoKey === "chicken"
            ? /chicken|nugget/i
            : /pizza/i;
    const heroItem = items.find((item) => item.id === settings.heroItemId)
      || (heroPattern && items.find((item) => heroPattern.test(item.name)))
      || items[0];
    const heroLabel = heroItem ? `${heroItem.quantity} × ${heroItem.name}` : "HOUSE SPECIAL";
    drawProductTag(ctx, heroLabel.toUpperCase(), 38, photoY + photoHeight - 88, 330, 66, theme.highlight, 32, typography.displayFont);

    const burstRadius = Math.min(184, logicalHeight * 0.095);
    const burstX = 252;
    const burstY = logicalHeight * 0.725;
    drawBurst(ctx, burstX, burstY, burstRadius, burstRadius * 0.84, theme.accent);
    drawCenteredText("ONLY", burstX, burstY - burstRadius * 0.43, Math.max(24, burstRadius * 0.23), theme.highlight, 900, burstRadius * 1.6);
    const offerText = `Rs ${formatPrice(settings.offerPrice)}`;
    drawCenteredFitText(
      offerText,
      burstX,
      burstY + 5,
      Math.max(44, Math.min(76, burstRadius * 0.42)),
      22,
      "#100d08",
      900,
      burstRadius * 1.72
    );
    if (hasDiscount) {
      const originalText = `WAS Rs ${formatPrice(settings.originalPrice)}`;
      setFont(Math.max(17, Math.min(25, burstRadius * 0.14)), 700);
      const originalWidth = Math.min(ctx.measureText(originalText).width, burstRadius * 1.55);
      ctx.fillStyle = "#17110a";
      ctx.textAlign = "center";
      ctx.fillText(fitText(ctx, originalText, burstRadius * 1.55), burstX, burstY + burstRadius * 0.34, burstRadius * 1.55);
      ctx.textAlign = "left";
      ctx.strokeStyle = theme.highlight;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(burstX - originalWidth / 2, burstY + burstRadius * 0.31);
      ctx.lineTo(burstX + originalWidth / 2, burstY + burstRadius * 0.31);
      ctx.stroke();
      drawCenteredText(
        `SAVE Rs ${formatPrice(Number(settings.originalPrice) - Number(settings.offerPrice))}`,
        burstX,
        burstY + burstRadius * 0.59,
        Math.max(15, Math.min(21, burstRadius * 0.12)),
        "#17110a",
        800,
        burstRadius * 1.65
      );
    }

    const ctaY = logicalHeight * 0.815;
    const ctaHeight = Math.max(62, Math.min(106, logicalHeight * 0.057));
    roundRect(ctx, 34, ctaY, 670, ctaHeight, ctaHeight / 2);
    ctx.fillStyle = theme.highlight;
    ctx.fill();
    drawPhoneIcon(ctx, 94, ctaY + ctaHeight / 2, ctaHeight * 0.32);
    drawText("ORDER NOW", 143, ctaY + ctaHeight * 0.38, Math.max(20, ctaHeight * 0.27), theme.accent, 900, 530);
    drawText(settings.phone || "Call to order", 143, ctaY + ctaHeight * 0.75, Math.max(28, ctaHeight * 0.42), "#ffffff", 900, 535);
    drawBrushShape(ctx, 751, ctaY - 2, 294, ctaHeight + 9, theme.highlight);
    drawCenteredText("🛵", 820, ctaY + ctaHeight * 0.48, Math.max(28, ctaHeight * 0.42), theme.accent, 900, 58);
    drawCenteredText("FAST", 950, ctaY + ctaHeight * 0.4, Math.max(16, ctaHeight * 0.2), "#ffffff", 900, 140);
    drawCenteredText("DELIVERY", 950, ctaY + ctaHeight * 0.7, Math.max(19, ctaHeight * 0.25), theme.accent, 900, 150);
    drawText(`📍 ${settings.address || "Add your restaurant address"}`, 54, logicalHeight * 0.91, 23, theme.ink, 700, 970);
    const footerY = logicalHeight * 0.936;
    drawBrushShape(ctx, 205, footerY, 670, logicalHeight * 0.048, theme.accent);
    drawCenteredText(settings.brand || "GEN-Z PIZZA LAND", 540, footerY + logicalHeight * 0.027, 34, "#11100a", 900, 600);
    drawCenteredText(settings.tagline || "GOOD FOOD · GREAT MOOD", 540, footerY + logicalHeight * 0.045, 21, "#11100a", 800, 580);
    drawCredit(48, logicalHeight - 8, 984, "#b9b2ad");
    return;
  }

  if (template === "Classic") {
    const photoHeight = logicalHeight * (logicalHeight < 700 ? 0.39 : 0.43);
    if (image) drawCover(ctx, image, 0, 0, 1080, photoHeight);
    const shade = ctx.createLinearGradient(0, photoHeight * 0.55, 0, photoHeight);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, 1080, photoHeight);
    ctx.fillStyle = "#fff8ed";
    ctx.fillRect(0, photoHeight, 1080, logicalHeight - photoHeight);
    const top = photoHeight + 56;
    drawBrand(62, photoHeight - 46, 720, "#ffffff");
    drawText(settings.headline.trim() || "A DEAL TO LOVE", 62, top + 40, 48, theme.background, 900, 940);
    drawItems(70, top + 112, 940, 42, 24, theme.background);
    const priceY = Math.min(top + 112 + items.length * 42 + 18, logicalHeight - 214);
    drawPrice(62, priceY, 520);
    drawCredit(62, logicalHeight - 24, 900, "#5d504b");
    return;
  }

  const horizontal = logicalHeight < 700;
  const photoWidth = horizontal ? 500 : 402;
  if (image) drawCover(ctx, image, 1080 - photoWidth, 0, photoWidth, logicalHeight);
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 1080 - photoWidth + 28, logicalHeight);
  const contentWidth = 1080 - photoWidth - 100;
  drawBrand(62, 88, contentWidth, theme.ink);
  if (discount) {
    roundRect(ctx, 62, 154, 154, 54, 16);
    ctx.fillStyle = theme.highlight;
    ctx.fill();
    drawText(`${discount}% OFF`, 81, 190, 23, "#ffffff", 800, 120);
  }
  const headlineY = horizontal ? 270 : Math.max(380, logicalHeight * 0.32);
  drawText(settings.headline.trim() || "THE MEAL DEAL", 62, headlineY, 46, theme.accent, 900, contentWidth);
  drawItems(66, headlineY + 78, contentWidth, horizontal ? 38 : 50, 23, theme.ink);
  const priceHeight = horizontal ? 138 : 164;
  const priceY = Math.min(headlineY + 100 + items.length * (horizontal ? 38 : 50), logicalHeight - priceHeight - 74);
  drawPrice(62, priceY, Math.min(contentWidth, 500), horizontal);
  drawCredit(62, logicalHeight - 26, contentWidth, "#d9d2d0");
};

const FoodPosterGenerator = ({ guestMode = false }) => {
  const canvasRef = useRef(null);
  const nextItemId = useRef(5);
  const itemImageUrls = useRef(new Set());
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [brand, setBrand] = useState("GEN-Z PIZZA LAND");
  const [headline, setHeadline] = useState("SPECIAL DEAL");
  const [tagline, setTagline] = useState("GOOD FOOD · GREAT MOOD");
  const [originalPrice, setOriginalPrice] = useState("2000");
  const [offerPrice, setOfferPrice] = useState("1890");
  const [phone, setPhone] = useState("0325-9061006");
  const [address, setAddress] = useState("Jhang Road, Near Shehnai Marriage Hall, Gojra");
  const [sizeKey, setSizeKey] = useState("story");
  const [themeKey, setThemeKey] = useState("genz");
  const [template, setTemplate] = useState("Gen-Z Blast");
  const [photoKey, setPhotoKey] = useState("pizza");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [message, setMessage] = useState("");
  const [generatingItems, setGeneratingItems] = useState([]);
  const [textStyle, setTextStyle] = useState("bold");

  useEffect(() => {
    document.title = guestMode ? "Free Food Poster Maker" : "POS | Admin Dashboard";
  }, [guestMode]);

  const photo = uploadedPhoto ? null : PHOTOS[photoKey];
  const generatedItems = useMemo(() => items.filter((item) => item.name.trim() && item.image), [items]);
  const heroItem = generatedItems[0];
  const imageSrc = heroItem?.image ?? uploadedPhoto?.url ?? photo?.src;
  const size = SIZES[sizeKey];
  const theme = THEMES[themeKey];
  const validationMessage = useMemo(() => {
    if (items.some((item) => !item.name.trim())) return "Give every bundle item a name before downloading.";
    if (
      String(originalPrice).trim() === "" ||
      String(offerPrice).trim() === "" ||
      Number(originalPrice) < 0 ||
      Number(offerPrice) < 0 ||
      !Number.isFinite(Number(originalPrice)) ||
      !Number.isFinite(Number(offerPrice))
    ) {
      return "Enter valid, non-negative prices.";
    }
    return "";
  }, [items, offerPrice, originalPrice]);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return undefined;
    let cancelled = false;
    const staticSupportingKeys = ["cola", "burger", "shawarma", "chicken", "pizza"]
      .filter((key) => key !== photoKey)
      .slice(0, 3);
    const supportingSources = [
      ...generatedItems
        .filter((item) => item.id !== heroItem?.id)
        .map((item) => ({ type: "item", item, src: item.image })),
      ...staticSupportingKeys.map((key) => ({ type: "stock", key, src: PHOTOS[key].src })),
    ].slice(0, 3);
    Promise.all([
      loadPosterImage(imageSrc),
      loadPosterImage(brandLogo),
      ...supportingSources.map((source) => loadPosterImage(source.src)),
    ])
      .then(([hero, logo, ...supporting]) => {
        if (cancelled || !canvasRef.current) return;
        drawPoster(canvasRef.current, { hero, logo, supporting }, heroItem ? null : photo, {
          items,
          brand,
          headline,
          tagline,
          originalPrice,
          offerPrice,
          phone,
          address,
          heroPhotoKey: heroItem ? "item" : uploadedPhoto ? "custom" : photoKey,
          heroItemId: heroItem?.id,
          heroIsUploadedItem: Boolean(heroItem),
          heroImageSource: heroItem?.imageSource,
          supportPhotoKeys: supportingSources.filter((source) => source.type === "stock").map((source) => source.key),
          supportingSources,
          size,
          theme,
          textStyle,
          template,
        });
        setMessage((current) => current.startsWith("Some poster photos could not be loaded") ? "" : current);
      })
      .catch(() => {
        if (!cancelled) setMessage("Some poster photos could not be loaded. Choose another photo and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [imageSrc, photo, photoKey, uploadedPhoto, items, generatedItems, heroItem, brand, headline, tagline, originalPrice, offerPrice, phone, address, size, theme, textStyle, template]);

  useEffect(
    () => () => {
      if (uploadedPhoto?.url) URL.revokeObjectURL(uploadedPhoto.url);
    },
    [uploadedPhoto]
  );

  useEffect(
    () => () => {
      itemImageUrls.current.forEach((url) => URL.revokeObjectURL(url));
      itemImageUrls.current.clear();
    },
    []
  );

  const updateItem = (id, field, value) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    if (items.length >= 5) return;
    setItems((current) => [...current, { id: nextItemId.current++, name: "", quantity: 1, imageStyle: "photorealistic" }]);
  };

  const removeItem = (id) => {
    const item = items.find((entry) => entry.id === id);
    if (item?.image) {
      URL.revokeObjectURL(item.image);
      itemImageUrls.current.delete(item.image);
    }
    setItems((current) => current.filter((entry) => entry.id !== id));
  };

  const selectItemPhoto = (event, id) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setMessage("Choose a PNG, JPG, or WebP image for this food item.");
      event.target.value = "";
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setMessage("Choose an image smaller than 12 MB.");
      event.target.value = "";
      return;
    }
    const item = items.find((entry) => entry.id === id);
    if (item?.image) {
      URL.revokeObjectURL(item.image);
      itemImageUrls.current.delete(item.image);
    }
    const url = URL.createObjectURL(file);
    itemImageUrls.current.add(url);
    updateItem(id, "image", url);
    updateItem(id, "imageSource", "upload");
    setMessage(`${item?.name || "Food"} image added to the poster.`);
    event.target.value = "";
  };

  const generateItemImage = async (item) => {
    if (!item.name.trim()) {
      setMessage("Enter a food name before generating its image.");
      return;
    }
    setGeneratingItems((current) => current.includes(item.id) ? current : [...current, item.id]);
    setMessage(`Creating a new ${IMAGE_STYLES.find((style) => style.value === item.imageStyle)?.label.toLowerCase() || "food"} image for ${item.name}…`);
    try {
      const response = await generatePosterFoodImage({ itemName: item.name.trim(), style: item.imageStyle || "photorealistic" });
      const generated = response.data?.data;
      if (!generated || !["image/png", "image/jpeg", "image/webp"].includes(generated.mimeType)) {
        throw new Error("Gemini returned an unsupported image. Please try again.");
      }
      const binary = atob(generated.data);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: generated.mimeType }));
      const previousImage = items.find((entry) => entry.id === item.id)?.image;
      if (previousImage) {
        URL.revokeObjectURL(previousImage);
        itemImageUrls.current.delete(previousImage);
      }
      itemImageUrls.current.add(url);
      updateItem(item.id, "image", url);
      updateItem(item.id, "imageSource", "gemini");
      setMessage(`New image created for ${item.name}. Click Generate another view to make a different version.`);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      setMessage(serverMessage || (error.code === "ECONNABORTED"
        ? "Gemini took too long to respond. Please try again."
        : error.response
          ? "Gemini image generation failed. Please try again."
          : "Cannot reach the poster image service. Make sure the POS backend is running and has GEMINI_API_KEY configured."));
    } finally {
      setGeneratingItems((current) => current.filter((id) => id !== item.id));
    }
  };

  const selectPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Choose an image file to use as your poster photo.");
      return;
    }
    setUploadedPhoto({ url: URL.createObjectURL(file) });
    setMessage("");
    event.target.value = "";
  };

  const downloadPoster = () => {
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      setMessage("The poster preview is not ready yet. Please try again.");
      return;
    }
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setMessage("Could not create the image file. Please try again.");
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `food-offer-poster.${downloadFormat}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          setMessage("Poster downloaded.");
        },
        downloadFormat === "jpg" ? "image/jpeg" : "image/png",
        0.94
      );
    } catch {
      setMessage("Could not download the poster. Please choose another photo and try again.");
    }
  };

  const controlClass =
    "w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-[#f5f5f5] outline-none focus:border-[#f6b100]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#ababab]";

  return (
    <div className="container mx-auto px-4 pb-10 sm:px-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#f5f5f5]">
          {guestMode ? "Free Food Poster Maker" : "Food Poster Maker"}
        </h2>
        <p className="mt-1 text-sm text-[#ababab]">
          {guestMode
            ? "No POS account or sign-up needed. Create a food poster with free photos and download it as PNG or JPG."
            : "Create a bold, branded food promo with editable deal details, free photos, and one-click PNG or JPG downloads."}
        </p>
        {guestMode && (
          <p className="mt-2 rounded-lg border border-[#5a4a20] bg-[#292315] px-3 py-2 text-xs leading-relaxed text-[#f6d56f]">
            Create and download posters here without signing in. Images generate right here when the site has a Gemini API key configured and available quota.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <section className="min-w-0 space-y-4 rounded-xl bg-[#262626] p-4 sm:p-5" aria-label="Poster settings">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Brand / restaurant</span>
              <input className={controlClass} value={brand} maxLength={32} onChange={(event) => setBrand(event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Poster headline</span>
              <input className={controlClass} value={headline} maxLength={34} onChange={(event) => setHeadline(event.target.value)} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>Tagline</span>
              <input className={controlClass} value={tagline} maxLength={52} onChange={(event) => setTagline(event.target.value)} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Order phone</span>
              <input className={controlClass} value={phone} maxLength={24} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Restaurant address</span>
              <input className={controlClass} value={address} maxLength={70} onChange={(event) => setAddress(event.target.value)} />
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className={labelClass + " mb-0"}>Offer items (up to 5)</span>
              <button
                type="button"
                onClick={addItem}
                disabled={items.length >= 5}
                className="inline-flex items-center gap-2 rounded-lg bg-[#363636] px-3 py-2 text-xs font-semibold text-white hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaPlus aria-hidden="true" /> Add item
              </button>
            </div>
            <p className="mb-2 text-xs leading-relaxed text-[#929292]">
              Generate an original image directly here. Choose an art style and click again whenever you want another unique variation.
            </p>
            <p className="mb-2 text-xs leading-relaxed text-[#929292]">
              Food names and style prompts are sent to Gemini using the site&apos;s server key. Google quota or billing may apply; generation is limited to 5 images per minute.
            </p>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="space-y-2 rounded-lg border border-[#383838] bg-[#202020] p-2">
                  <div className="grid grid-cols-[minmax(0,1fr)_76px_36px] items-end gap-2">
                    <label>
                      <span className="sr-only">Offer item {index + 1} name</span>
                      <input
                        className={controlClass}
                        value={item.name}
                        maxLength={48}
                        placeholder="e.g. Small pizza"
                        onChange={(event) => updateItem(item.id, "name", event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="sr-only">Offer item {index + 1} quantity</span>
                      <input
                        className={controlClass}
                        type="number"
                        min="1"
                        max="99"
                        step="1"
                        value={item.quantity}
                        onChange={(event) => updateItem(item.id, "quantity", Math.max(1, Math.min(99, Number(event.target.value) || 1)))}
                      />
                    </label>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name || `item ${index + 1}`}`}
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.id)}
                      className="flex h-[42px] w-9 items-center justify-center rounded-lg bg-[#3a2525] text-[#ff9a8f] hover:bg-[#593131] disabled:opacity-40"
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="min-w-[180px] flex-1 sm:flex-none">
                      <span className="sr-only">Image style for {item.name || `item ${index + 1}`}</span>
                      <select
                        className={controlClass}
                        value={item.imageStyle || "photorealistic"}
                        onChange={(event) => updateItem(item.id, "imageStyle", event.target.value)}
                      >
                        {IMAGE_STYLES.map((style) => (
                          <option key={style.value} value={style.value}>{style.label}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      disabled={!item.name.trim() || generatingItems.includes(item.id)}
                      onClick={() => generateItemImage(item)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#393021] px-3 py-2 text-xs font-semibold text-[#ffdc00] hover:bg-[#4b3d25] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {generatingItems.includes(item.id)
                        ? <FaSpinner aria-hidden="true" className="animate-spin" />
                        : <FaMagic aria-hidden="true" />}
                      {generatingItems.includes(item.id) ? "Generating…" : item.image ? "Generate another view" : "Generate image"}
                    </button>
                    <label className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg bg-[#363636] px-3 py-2 text-xs font-semibold text-white hover:bg-[#444]">
                      <FaUpload aria-hidden="true" /> {item.image ? "Replace image" : "Upload image"}
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => selectItemPhoto(event, item.id)}
                      />
                    </label>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={`${item.name} added to the poster`}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Original price (Rs)</span>
              <input className={controlClass} type="number" min="0" step="0.01" value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Offer price (Rs)</span>
              <input className={controlClass} type="number" min="0" step="0.01" value={offerPrice} onChange={(event) => setOfferPrice(event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Poster size</span>
              <select className={controlClass} value={sizeKey} onChange={(event) => setSizeKey(event.target.value)}>
                {Object.entries(SIZES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Layout</span>
              <select className={controlClass} value={template} onChange={(event) => setTemplate(event.target.value)}>
                {["Gen-Z Blast", "Classic", "Split"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Color theme</span>
              <select className={controlClass} value={themeKey} onChange={(event) => setThemeKey(event.target.value)}>
                {Object.entries(THEMES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Poster text style</span>
              <select className={controlClass} value={textStyle} onChange={(event) => setTextStyle(event.target.value)}>
                {Object.entries(TEXT_STYLES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Food photo (fallback)</span>
              <select
                className={controlClass}
                value={uploadedPhoto ? "upload" : photoKey}
                onChange={(event) => {
                  setUploadedPhoto(null);
                  if (event.target.value !== "upload") setPhotoKey(event.target.value);
                }}
              >
                {Object.entries(PHOTOS).map(([key, option]) => <option key={key} value={key}>{option.label} · {option.license}</option>)}
                {uploadedPhoto && <option value="upload">Your uploaded photo</option>}
              </select>
            </label>
          </div>
          {heroItem && (
            <p className="text-xs leading-relaxed text-[#929292]">
              The first uploaded item photo is the main poster image. The selected food photo is used if you remove it.
            </p>
          )}

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#5a5a5a] bg-[#1a1a1a] px-4 py-3 text-sm font-medium text-[#f5f5f5] hover:border-[#f6b100]">
            <FaUpload aria-hidden="true" />
            Use your own photo
            <input className="sr-only" type="file" accept="image/*" onChange={selectPhoto} />
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-3">
            <label>
              <span className={labelClass}>Download format</span>
              <select className={controlClass} value={downloadFormat} onChange={(event) => setDownloadFormat(event.target.value)}>
                <option value="png">PNG · best quality</option>
                <option value="jpg">JPG · smaller file</option>
              </select>
            </label>
            <button
              type="button"
              onClick={downloadPoster}
              disabled={Boolean(validationMessage)}
              className="mt-auto inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#f6b100] px-3 py-2 text-sm font-bold text-[#1a1a1a] hover:bg-[#ffc52e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaDownload aria-hidden="true" /> Download
            </button>
          </div>
          {message && <p role="status" className="text-sm text-[#f6b100]">{message}</p>}
          {photo && !heroItem && !uploadedPhoto && (
            <p className="text-xs leading-relaxed text-[#929292]">
              Photo: {photo.creator}, Wikimedia Commons, {photo.license}.{" "}
              <a className="text-[#f6b100] underline" href={photo.source} target="_blank" rel="noreferrer">
                View source
              </a>
            </p>
          )}
          {(heroItem || uploadedPhoto) && (
            <p className="text-xs leading-relaxed text-[#929292]">
              Your custom item photo is included in the poster. Make sure you have permission to use it.
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-xl bg-[#262626] p-4 sm:p-5" aria-label="Poster preview">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#f5f5f5]">Live preview</h3>
            <span className="text-xs text-[#ababab]">{size.width} × {size.height}px</span>
          </div>
          <div className="flex max-h-[75vh] justify-center overflow-auto rounded-lg bg-[#161616] p-2 sm:p-4">
            <canvas
              ref={canvasRef}
              aria-label="Preview of your food offer poster"
              className="h-auto max-h-[70vh] w-auto max-w-full rounded shadow-xl"
              style={{ objectFit: "contain" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

FoodPosterGenerator.propTypes = {
  guestMode: PropTypes.bool,
};

export default FoodPosterGenerator;
