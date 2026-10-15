// Uploaded images (category icons, dish photos) are returned by the backend as a
// relative path like "/uploads/xyz.png". Resolve that against the backend origin
// so <img> tags work regardless of which host the frontend itself is served from.
// Anything else (an emoji, a full http(s) URL, or nothing) is returned as-is.
export const resolveImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) {
    const backendBaseURL =
      import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${backendBaseURL}${value}`;
  }
  return value;
};

export const getBgColor = () => {
  const bgarr = [
    "#b73e3e",
    "#5b45b0",
    "#7f167f",
    "#735f32",
    "#1d2569",
    "#285430",
    "#f6b100",
    "#025cca",
    "#be3e3f",
    "#02ca3a",
  ];
  const randomBg = Math.floor(Math.random() * bgarr.length);
  const color = bgarr[randomBg];
  return color;
};

export const getAvatarName = (name) => {
  if(!name) return "";

  return name.split(" ").map(word => word[0]).join("").toUpperCase();

}

// Human-facing order number. Every order now gets a real sequential number
// assigned by the backend when it's created — "<YYYYMMDD><3-digit seq>",
// e.g. "20260927001" for the 1st order placed on 27 Sep 2026, "20260927002"
// for the 2nd, and so on, resetting to 001 each new day (see
// pos-backend/utils/orderNumber.js) — so this single field also tells you
// how many orders came in on any given day. Older orders created before
// this existed won't have one, so those fall back to the last 6 characters
// of their database _id (still unique per order, just not sequential/date
// based).
export const getOrderNumber = (order) => {
  if (order?.orderNumber) return order.orderNumber;
  const id = order?._id;
  if (!id) return "N/A";
  return String(id).slice(-6).toUpperCase();
};

export const formatDate = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
};

export const formatDateAndTime = (date) => {
  const dateAndTime = new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  })

  return dateAndTime;
}

// Short, space-tight time-only string for showing next to each stage in an
// order's timeline (e.g. "3:45 PM") - formatDateAndTime above is too long
// to fit under a stage label.
export const formatTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}