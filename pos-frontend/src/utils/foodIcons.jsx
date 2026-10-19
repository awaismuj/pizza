import React from "react";
import { resolveImageUrl } from "./index";

// High-Fidelity Colored SVG Food Icons
export const ColoredPizzaIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.4 17.6C30.6 6.3 19.8 1.4 8.5 4.2C8.1 4.3 7.8 4.7 7.9 5.1L18 33.5C18.2 33.9 18.6 34.1 19 33.9C28.2 29.5 32.8 21.6 33.4 17.6Z" fill="#D97706" />
    <path d="M31.2 17.2C28.8 7.5 19.5 3.3 9.8 5.7L18.4 30.1C26.3 26.3 30.6 20.6 31.2 17.2Z" fill="#FBBF24" />
    <circle cx="21" cy="14" r="3.2" fill="#DC2626" />
    <circle cx="16" cy="22" r="2.8" fill="#DC2626" />
    <circle cx="26" cy="21" r="2.5" fill="#DC2626" />
    <circle cx="14" cy="11" r="2.2" fill="#16A34A" />
    <circle cx="23" cy="26" r="1.8" fill="#16A34A" />
    <circle cx="25" cy="10" r="1.8" fill="#FEF08A" />
    <circle cx="18" cy="17" r="1.5" fill="#FEF08A" />
  </svg>
);

export const ColoredBurgerIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14C6 8 11.4 3 18 3C24.6 3 30 8 30 14H6Z" fill="#F59E0B" />
    <path d="M7 14C7 9.5 11.9 5 18 5C24.1 5 29 9.5 29 14H7Z" fill="#FBBF24" />
    <circle cx="13" cy="8" r="0.8" fill="#FEF3C7" />
    <circle cx="18" cy="7" r="0.8" fill="#FEF3C7" />
    <circle cx="23" cy="8" r="0.8" fill="#FEF3C7" />
    <circle cx="15" cy="11" r="0.8" fill="#FEF3C7" />
    <circle cx="21" cy="11" r="0.8" fill="#FEF3C7" />
    <rect x="4" y="15" width="28" height="3" rx="1.5" fill="#16A34A" />
    <path d="M4 19H32V23C32 23.6 31.6 24 31 24H5C4.4 24 4 23.6 4 23V19Z" fill="#78350F" />
    <path d="M8 20L18 24L28 20" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 25H30V27C30 30.3 27.3 33 24 33H12C8.7 33 6 30.3 6 27V25Z" fill="#F59E0B" />
  </svg>
);

export const ColoredFriesIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="4" width="3" height="15" rx="1" fill="#FBBF24" />
    <rect x="14" y="2" width="3" height="17" rx="1" fill="#F59E0B" />
    <rect x="18" y="5" width="3" height="14" rx="1" fill="#FBBF24" />
    <rect x="22" y="3" width="3" height="16" rx="1" fill="#FCD34D" />
    <path d="M7 16L10 32H26L29 16H7Z" fill="#DC2626" />
    <path d="M10 16C12 18 15 19 18 19C21 19 24 18 26 16L24.5 30H11.5L10 16Z" fill="#B91C1C" />
    <circle cx="18" cy="24" r="3" fill="#FBBF24" />
  </svg>
);

export const ColoredDrinkIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L20 9" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <path d="M9 9H27L24.5 32H11.5L9 9Z" fill="#0284C7" />
    <path d="M10.5 13H25.5L24 30H12L10.5 13Z" fill="#38BDF8" />
    <path d="M8 8H28V11H8V8Z" fill="#E2E8F0" rx="1" />
    <circle cx="18" cy="20" r="3.5" fill="#FDE047" />
    <circle cx="18" cy="20" r="2" fill="#EAB308" />
  </svg>
);

export const ColoredCoffeeIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H24V23C24 27.4 20.4 31 16 31H14C9.6 31 6 27.4 6 23V12Z" fill="#92400E" />
    <path d="M24 15H27C28.7 15 30 16.3 30 18C30 19.7 28.7 21 27 21H24V15Z" fill="#B45309" />
    <ellipse cx="15" cy="12" rx="9" ry="2.5" fill="#FEF3C7" />
    <path d="M11 6C11 4 13 3 13 1" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 7C16 5 18 4 18 2" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 33H28" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const ColoredBbqIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="31" x2="31" y2="5" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="12" cy="24" rx="4" ry="3" transform="rotate(-45 12 24)" fill="#B91C1C" />
    <ellipse cx="18" cy="18" rx="4" ry="3" transform="rotate(-45 18 18)" fill="#EA580C" />
    <ellipse cx="24" cy="12" rx="4" ry="3" transform="rotate(-45 24 12)" fill="#B91C1C" />
    <circle cx="15" cy="15" r="1" fill="#FDE047" />
    <circle cx="21" cy="9" r="1" fill="#FDE047" />
  </svg>
);

export const ColoredPastaIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="15" rx="12" ry="4" fill="#FDE047" />
    <circle cx="16" cy="13" r="2.5" fill="#DC2626" />
    <circle cx="20" cy="14" r="2.2" fill="#DC2626" />
    <circle cx="18" cy="11" r="1.5" fill="#16A34A" />
    <path d="M6 15C6 24 11.4 30 18 30C24.6 30 30 24 30 15H6Z" fill="#E2E8F0" />
    <path d="M7 16C7.5 23 12.3 28 18 28C23.7 28 28.5 23 29 16H7Z" fill="#CBD5E1" />
  </svg>
);

export const ColoredPlatterIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="24" rx="15" ry="6" fill="#64748B" />
    <ellipse cx="18" cy="23" rx="13" ry="5" fill="#F8FAFC" />
    <path d="M10 21C10 16 13.6 12 18 12C22.4 12 26 16 26 21H10Z" fill="#FBBF24" />
    <circle cx="18" cy="12" r="2" fill="#DC2626" />
    <circle cx="15" cy="17" r="1.5" fill="#16A34A" />
    <circle cx="21" cy="17" r="1.5" fill="#16A34A" />
  </svg>
);

export const ColoredDessertIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 16H29V28C29 29.1 28.1 30 27 30H9C7.9 30 7 29.1 7 28V16Z" fill="#F43F5E" />
    <rect x="7" y="21" width="22" height="3" fill="#FEF08A" />
    <path d="M6 16C6 13.8 11.4 11 18 11C24.6 11 30 13.8 30 16H6Z" fill="#FCE7F3" />
    <circle cx="18" cy="8" r="3" fill="#BE123C" />
    <path d="M19 6C20 4 22 4 22 2" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ColoredIceCreamIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17L18 34L24 17H12Z" fill="#D97706" />
    <path d="M13.5 17L18 30L22.5 17H13.5Z" fill="#F59E0B" />
    <circle cx="18" cy="14" r="6" fill="#38BDF8" />
    <circle cx="18" cy="8" r="5" fill="#EC4899" />
    <circle cx="18" cy="3" r="2" fill="#DC2626" />
  </svg>
);

export const ColoredSoupIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="16" rx="11" ry="4" fill="#F59E0B" />
    <circle cx="16" cy="15" r="1.5" fill="#16A34A" />
    <circle cx="20" cy="16" r="1.5" fill="#DC2626" />
    <circle cx="18" cy="14" r="1.2" fill="#FEF08A" />
    <path d="M7 16C7 24 11.9 29 18 29C24.1 29 29 24 29 16H7Z" fill="#0D9488" />
    <path d="M14 8C14 6 15 5 15 3" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 9C18 7 19 6 19 4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ColoredDealsIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 2C19.5 2 21.5 6 19 10C16.5 14 13.5 15 13.5 19C13.5 25 18 29 23.5 29C29 29 32.5 24 32.5 18C32.5 11 26 5 26 5C26 5 26.5 9 24 10.5C21.5 12 21 8.5 21 7C21 5.5 19.5 2 19.5 2Z" fill="#EA580C" />
    <path d="M16 15C16 15 17.5 18 15.5 20.5C13.5 23 11 24 11 27C11 31.5 14.5 34 18.5 34C22.5 34 25.5 30 25.5 25.5C25.5 20.5 21 17 21 17C21 17 21.5 19.5 19.5 20.5C17.5 21.5 17 19.5 17 18.5C17 17.5 16 15 16 15Z" fill="#FBBF24" />
  </svg>
);

export const ColoredDiningIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 25H30V27H6V25Z" fill="#94A3B8" />
    <path d="M8 24C8 16 12.5 10 18 10C23.5 10 28 16 28 24H8Z" fill="#CBD5E1" />
    <circle cx="18" cy="8" r="2.5" fill="#F59E0B" />
    <path d="M12 22C12 18 14.5 14 18 14" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const VECTOR_FOOD_ICONS = [
  { id: "pizza", label: "Pizza", icon: ColoredPizzaIcon, emojiMatch: ["🍕"] },
  { id: "burger", label: "Burger", icon: ColoredBurgerIcon, emojiMatch: ["🍔"] },
  { id: "fastfood", label: "Shawarma / Fast Food", icon: ColoredFriesIcon, emojiMatch: ["🌭", "🍟", "🥪"] },
  { id: "drinks", label: "Cold Drinks / Soda", icon: ColoredDrinkIcon, emojiMatch: ["🥤", "🍹", "🧃"] },
  { id: "coffee", label: "Hot Beverages", icon: ColoredCoffeeIcon, emojiMatch: ["☕"] },
  { id: "bbq", label: "BBQ & Grill", icon: ColoredBbqIcon, emojiMatch: ["🍗", "🍖"] },
  { id: "pasta", label: "Noodles & Pasta", icon: ColoredPastaIcon, emojiMatch: ["🍜", "🍝"] },
  { id: "platter", label: "Main Dishes & Rice", icon: ColoredPlatterIcon, emojiMatch: ["🍛", "🍲"] },
  { id: "bakery", label: "Bakes & Breads", icon: ColoredFriesIcon, emojiMatch: ["🥖", "🍞"] },
  { id: "dessert", label: "Cakes & Sweets", icon: ColoredDessertIcon, emojiMatch: ["🍰", "🍩"] },
  { id: "icecream", label: "Ice Cream", icon: ColoredIceCreamIcon, emojiMatch: ["🍨", "🍦"] },
  { id: "soup", label: "Soups & Starters", icon: ColoredSoupIcon, emojiMatch: ["🥣"] },
  { id: "deals", label: "Special Deals", icon: ColoredDealsIcon, emojiMatch: ["🔥", "⭐"] },
  { id: "dining", label: "Fine Dining", icon: ColoredDiningIcon, emojiMatch: ["🍽️"] },
];

const ICON_LOOKUP = {};
VECTOR_FOOD_ICONS.forEach((item) => {
  ICON_LOOKUP[item.id] = item.icon;
  if (item.emojiMatch) {
    item.emojiMatch.forEach((emoji) => {
      ICON_LOOKUP[emoji] = item.icon;
    });
  }
});

// Additional emoji and keyword mappings
ICON_LOOKUP["🍺"] = ColoredDrinkIcon;
ICON_LOOKUP["🍷"] = ColoredDrinkIcon;
ICON_LOOKUP["🥗"] = ColoredSoupIcon;
ICON_LOOKUP["🍣"] = ColoredPlatterIcon;
ICON_LOOKUP["🍱"] = ColoredPlatterIcon;
ICON_LOOKUP["deal"] = ColoredDealsIcon;
ICON_LOOKUP["deals"] = ColoredDealsIcon;
ICON_LOOKUP["special"] = ColoredDealsIcon;
ICON_LOOKUP["discount"] = ColoredDealsIcon;
ICON_LOOKUP["combo"] = ColoredPlatterIcon;
ICON_LOOKUP["platter"] = ColoredPlatterIcon;
ICON_LOOKUP["beverage"] = ColoredDrinkIcon;
ICON_LOOKUP["drinks"] = ColoredDrinkIcon;
ICON_LOOKUP["drink"] = ColoredDrinkIcon;
ICON_LOOKUP["chicken"] = ColoredBbqIcon;
ICON_LOOKUP["wings"] = ColoredBbqIcon;
ICON_LOOKUP["bbq"] = ColoredBbqIcon;
ICON_LOOKUP["fastfood"] = ColoredFriesIcon;
ICON_LOOKUP["fries"] = ColoredFriesIcon;
ICON_LOOKUP["dessert"] = ColoredDessertIcon;
ICON_LOOKUP["sweet"] = ColoredDessertIcon;

export const isUploadedImage = (value = "") => {
  if (typeof value !== "string") return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/uploads/");
};

/**
 * Universal Colored Food Icon Renderer:
 * - If an uploaded image URL is provided, renders the image.
 * - If a mapped vector icon key exists, renders the vector SVG.
 * - If a native emoji string is passed (🍕, 🍔, 🥪, 🍲, 🥤, etc.), renders the crisp native emoji.
 * - Otherwise gracefully falls back to a clean dining symbol.
 */
export const FoodIcon = ({ icon, className = "", size = 20, fallback = null }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!icon || imgError) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent size={size} className={className} />;
    }
    return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`inline-block select-none ${className}`}>🍽️</span>;
  }

  if (isUploadedImage(icon)) {
    return (
      <img
        src={resolveImageUrl(icon)}
        alt="Food icon"
        className={`object-cover rounded-md shadow-xs ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={() => setImgError(true)}
      />
    );
  }

  // If in mapped vector SVG icons
  if (ICON_LOOKUP[icon]) {
    const Component = ICON_LOOKUP[icon];
    return <Component size={size} className={className} />;
  }

  // If it's an emoji or short symbol, render crisp native emoji directly
  if (typeof icon === "string" && (icon.length <= 4 || /\p{Extended_Pictographic}/u.test(icon))) {
    return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`inline-block select-none ${className}`}>{icon}</span>;
  }

  if (fallback) {
    const FallbackComponent = fallback;
    return <FallbackComponent size={size} className={className} />;
  }

  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`inline-block select-none ${className}`}>🍽️</span>;
};

export default FoodIcon;
