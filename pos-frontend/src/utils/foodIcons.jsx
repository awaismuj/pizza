import React from "react";
import {
  MdRestaurant,
  MdLocalPizza,
  MdLunchDining,
  MdFastfood,
  MdLocalDrink,
  MdLocalCafe,
  MdDinnerDining,
  MdBakeryDining,
  MdIcecream,
  MdRamenDining,
  MdTakeoutDining,
  MdCake,
  MdSoupKitchen,
  MdSetMeal,
  MdBreakfastDining,
  MdBento,
  MdOutdoorGrill,
  MdLocalOffer,
  MdLocalBar
} from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { resolveImageUrl } from "./index";

export const VECTOR_FOOD_ICONS = [
  { id: "pizza", label: "Pizza", icon: MdLocalPizza, emojiMatch: ["🍕"] },
  { id: "burger", label: "Burger", icon: MdLunchDining, emojiMatch: ["🍔"] },
  { id: "fastfood", label: "Shawarma / Fast Food", icon: MdFastfood, emojiMatch: ["🌭", "🍟", "🥪"] },
  { id: "drinks", label: "Cold Drinks / Soda", icon: MdLocalDrink, emojiMatch: ["🥤", "🍹", "🧃"] },
  { id: "coffee", label: "Hot Beverages", icon: MdLocalCafe, emojiMatch: ["☕"] },
  { id: "bbq", label: "BBQ & Grill", icon: MdOutdoorGrill, emojiMatch: ["🍗", "🍖"] },
  { id: "pasta", label: "Noodles & Pasta", icon: MdRamenDining, emojiMatch: ["🍜", "🍝"] },
  { id: "platter", label: "Main Dishes & Rice", icon: MdDinnerDining, emojiMatch: ["🍛", "🍲"] },
  { id: "bakery", label: "Bakes & Breads", icon: MdBakeryDining, emojiMatch: ["🥖", "🍞"] },
  { id: "dessert", label: "Cakes & Sweets", icon: MdCake, emojiMatch: ["🍰", "🍩"] },
  { id: "icecream", label: "Ice Cream", icon: MdIcecream, emojiMatch: ["🍨", "🍦"] },
  { id: "soup", label: "Soups & Starters", icon: MdSoupKitchen, emojiMatch: ["🥣"] },
  { id: "deals", label: "Special Deals", icon: FaFire, emojiMatch: ["🔥", "⭐"] },
  { id: "dining", label: "Fine Dining", icon: MdRestaurant, emojiMatch: ["🍽️"] },
];

// Map lookup table for instantaneous resolution of both IDs and legacy emojis
const ICON_LOOKUP = {};
VECTOR_FOOD_ICONS.forEach((item) => {
  ICON_LOOKUP[item.id] = item.icon;
  if (item.emojiMatch) {
    item.emojiMatch.forEach((emoji) => {
      ICON_LOOKUP[emoji] = item.icon;
    });
  }
});

// Fallback mappings for any other random emojis
ICON_LOOKUP["🍺"] = MdLocalBar;
ICON_LOOKUP["🍷"] = MdLocalBar;
ICON_LOOKUP["🥗"] = MdRestaurant;
ICON_LOOKUP["🍣"] = MdSetMeal;
ICON_LOOKUP["🍱"] = MdBento;

export const isUploadedImage = (value = "") => {
  if (typeof value !== "string") return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/uploads/");
};

/**
 * Universal food icon renderer: renders crisp vector React icons
 * for custom IDs, legacy emoji strings, and image URLs.
 */
export const FoodIcon = ({ icon, className = "", size = 20, fallback = MdRestaurant }) => {
  if (!icon) {
    const FallbackComponent = fallback;
    return <FallbackComponent size={size} className={className} />;
  }

  // If user uploaded an image URL
  if (isUploadedImage(icon)) {
    return (
      <img
        src={resolveImageUrl(icon)}
        alt="Food icon"
        className={`object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Lookup in vector icons table
  const Component = ICON_LOOKUP[icon] || fallback;
  return <Component size={size} className={className} />;
};

export default FoodIcon;
