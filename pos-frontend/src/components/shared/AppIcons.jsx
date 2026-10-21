import React from "react";
import {
  FaPizzaSlice, FaBurger, FaHotdog, FaDrumstickBite, FaIceCream, FaCakeCandles, FaBowlRice,
  FaMartiniGlass, FaBeerMugEmpty, FaMugHot, FaBottleWater, FaCheese, FaUtensils, FaFire,
  FaStar, FaBowlFood, FaMotorcycle, FaStore, FaCreditCard, FaMoneyBill, FaLocationDot,
  FaPuzzlePiece, FaClock, FaCheck, FaXmark, FaCommentDots, FaCartShopping, FaBullseye,
  FaCamera, FaMobileScreen, FaHourglassHalf, FaCircleCheck, FaCircleXmark, FaWandMagicSparkles,
  FaBreadSlice, FaCookieBite, FaPepperHot, FaLeaf, FaWineGlass, FaPhone, FaTriangleExclamation,
  FaBagShopping, FaHandHoldingHeart, FaBolt, FaTruckFast, FaQuoteLeft,
} from "react-icons/fa6";

/* One icon set for the whole storefront (and the POS dashboard, which carries
   an identical copy of this file) so nothing depends on how a given phone or
   OS draws emoji. */

export const I = {
  Pizza: FaPizzaSlice, Burger: FaBurger, Hotdog: FaHotdog, Chicken: FaDrumstickBite,
  IceCream: FaIceCream, Cake: FaCakeCandles, Rice: FaBowlRice, Cocktail: FaMartiniGlass,
  Beer: FaBeerMugEmpty, Coffee: FaMugHot, Drink: FaBottleWater, Cheese: FaCheese,
  Utensils: FaUtensils, Flame: FaFire, Star: FaStar, Bowl: FaBowlFood, Rider: FaMotorcycle,
  Store: FaStore, Card: FaCreditCard, Cash: FaMoneyBill, Pin: FaLocationDot,
  Puzzle: FaPuzzlePiece, Clock: FaClock, Check: FaCheck, Close: FaXmark,
  Chat: FaCommentDots, Cart: FaCartShopping, Target: FaBullseye, Camera: FaCamera,
  Phone: FaMobileScreen, Hourglass: FaHourglassHalf, CheckCircle: FaCircleCheck,
  CrossCircle: FaCircleXmark, Sparkles: FaWandMagicSparkles, Bread: FaBreadSlice,
  Cookie: FaCookieBite, Pepper: FaPepperHot, Leaf: FaLeaf, Wine: FaWineGlass, Call: FaPhone,
  Warning: FaTriangleExclamation, Bag: FaBagShopping, Heart: FaHandHoldingHeart,
  Bolt: FaBolt, Fast: FaTruckFast, Quote: FaQuoteLeft,
};

/* Category / deal "icon" values. New values are keys (e.g. "pizza"); values
   saved before this change are emoji, so both are understood. */
const FOOD = {
  pizza: I.Pizza, burger: I.Burger, hotdog: I.Hotdog, chicken: I.Chicken, icecream: I.IceCream,
  cake: I.Cake, rice: I.Rice, cocktail: I.Cocktail, beer: I.Beer, coffee: I.Coffee,
  drink: I.Drink, cheese: I.Cheese, utensils: I.Utensils, flame: I.Flame, star: I.Star,
  bowl: I.Bowl, bread: I.Bread, cookie: I.Cookie, pepper: I.Pepper, salad: I.Leaf, wine: I.Wine,
};

const EMOJI_TO_KEY = {
  "🍕": "pizza", "🍔": "burger", "🍟": "burger", "🌭": "hotdog", "🌮": "bread", "🌯": "bread",
  "🥪": "bread", "🍗": "chicken", "🍖": "chicken", "🍦": "icecream", "🍩": "cookie",
  "🍰": "cake", "🎂": "cake", "🍛": "rice", "🍚": "rice", "🍜": "bowl", "🍲": "bowl",
  "🍣": "rice", "🥗": "salad", "🥤": "drink", "🧃": "drink", "☕": "coffee", "🍹": "cocktail",
  "🍷": "wine", "🍺": "beer", "🧀": "cheese", "🔥": "flame", "⭐": "star", "🌶": "pepper",
  "🍽": "utensils",
};

export const FOOD_ICON_OPTIONS = [
  ["pizza", "Pizza"], ["burger", "Burger"], ["hotdog", "Hot dog"], ["chicken", "Chicken"],
  ["bread", "Wraps & sandwiches"], ["rice", "Rice"], ["bowl", "Bowls & soups"], ["salad", "Salad"],
  ["cheese", "Cheese"], ["pepper", "Spicy"], ["drink", "Cold drink"], ["coffee", "Hot drink"],
  ["cocktail", "Mocktail"], ["icecream", "Ice cream"], ["cookie", "Snacks"], ["cake", "Dessert"],
  ["flame", "Hot deal"], ["star", "Popular"], ["utensils", "General"],
].map(([key, label]) => ({ key, label }));

export const foodIconKey = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "utensils";
  if (FOOD[raw]) return raw;
  const base = raw.replace(/\uFE0F/g, "");
  return EMOJI_TO_KEY[base] || "utensils";
};

export const FoodIcon = ({ icon, ...props }) => {
  const Cmp = FOOD[foodIconKey(icon)] || I.Utensils;
  return <Cmp aria-hidden="true" {...props} />;
};
