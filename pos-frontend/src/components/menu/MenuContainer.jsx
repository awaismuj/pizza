import React, { useEffect, useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories, getDishes, getDeals } from "../../https";
import { addItems } from "../../redux/slices/cartSlice";
import { resolveImageUrl } from "../../utils";
import { useUITheme } from "../../context/UIThemeContext";
import { FoodIcon } from "../../utils/foodIcons";

const MenuIcon = ({ icon }) => (
  <span className="inline-flex items-center justify-center mr-1.5 align-middle shrink-0">
    <FoodIcon icon={icon} size={18} />
  </span>
);

const palette = ["#b73e3e", "#5b45b0", "#7f167f", "#735f32", "#1d2569", "#285430", "#b73e3e", "#5b45b0"];

const categoryIcons = {
  starters: "🍲",
  salads: "🥗",
  pizza: "🍕",
  beverages: "🍹",
  soups: "🍜",
  desserts: "🍰",
  "main course": "🍛",
  "alcoholic drinks": "🍺",
};

const getCategoryIcon = (name = "") => {
  const key = name.toLowerCase();
  return categoryIcons[key] || categoryIcons[key.split(" ")[0]] || "🍽️";
};

// `onAddToCart`, when passed, receives each cart-line object instead of it
// being dispatched to the global (dine-in) redux cart — this is what lets
// the Outdoor/Takeaway window reuse this exact same menu-browsing UI
// against its own local, table-free cart.
const MenuContainer = ({ onAddToCart }) => {
  const dispatch = useDispatch();
  const { isClean } = useUITheme();
  const cartLines = useSelector((state) => state.cart);
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const [search, setSearch] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("all"); // "all" | "Vegetarian" | "Spicy" | "Chef Special" | "Gluten-Free"
  // { [dishId]: { size, crust } } — which size/crust is currently picked
  // for items that have variants. Defaults to the first variant once its
  // dish is seen, so there's always a valid (priced) selection.
  const [variantSelections, setVariantSelections] = useState({});

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
    refetchInterval: 10000, // keeps "Only N left" in step with live inventory
  });

  // Same live deal list the storefront and admin dashboard use — a deal is
  // just another line item here, sold as a bundle at its own fixed price.
  const { data: dealsData } = useQuery({
    queryKey: ["deals"],
    queryFn: getDeals,
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
  });

  const dynamicMenus = React.useMemo(() => {
    const categories = categoriesData?.data?.data ?? [];
    const dishes = dishesData?.data?.data ?? [];
    const deals = (dealsData?.data?.data ?? []).filter((d) => d.isActive !== false);

    const categoryMenus = categories.map((category, index) => ({
      id: category._id,
      name: category.name,
      bgColor: palette[index % palette.length],
      icon: category.icon || getCategoryIcon(category.name),
      items: dishes
        .filter((dish) => {
          if (!dish.category) return false;
          const categoryId = typeof dish.category === "string" ? dish.category : dish.category._id;
          return categoryId === category._id || dish.category?.name === category.name;
        })
        .map((dish) => ({
          id: dish._id,
          name: dish.name,
          price: Number(dish.price) || 0,
          description: dish.description || "",
          variants: Array.isArray(dish.variants) ? dish.variants : [],
          category: category.name,
          icon: dish.icon || "🍽️",
          isInventoryTracked: Boolean(dish.isInventoryTracked),
          dietaryTags: Array.isArray(dish.dietaryTags) ? dish.dietaryTags : (Array.isArray(dish.tags) ? dish.tags : []),
          tags: Array.isArray(dish.tags) ? dish.tags : [],
          // Live from inventory: how many can still be sold (null = untracked).
          availableQty: typeof dish.availableQty === "number" ? dish.availableQty : null,
          isDeal: false,
        })),
    }));


    // A synthetic "Deals" tab, same shape as a category, prepended so it's
    // the first thing staff see — deals are usually the fastest sell.
    if (deals.length > 0) {
      const dealMenu = {
        id: "__deals__",
        name: "Deals",
        bgColor: "#c8102e",
        icon: "🔥",
        items: deals.map((deal) => ({
          id: deal._id,
          name: deal.name,
          price: Number(deal.price) || 0,
          description:
            deal.description ||
            (deal.items || []).map((it) => (it.quantity > 1 ? `${it.quantity}x ${it.label}` : it.label)).join(", "),
          variants: [],
          category: "Deals",
          icon: deal.icon || "🔥",
          isInventoryTracked: false,
          availableQty: typeof deal.availableQty === "number" ? deal.availableQty : null,
          isDeal: true,
          dealItems: deal.items || [],
        })),
      };
      return [dealMenu, ...categoryMenus];
    }

    return categoryMenus;
  }, [categoriesData, dishesData, dealsData]);

  // Every item across every category/deal tab, flattened once, so the
  // search box can match against the whole menu regardless of which tab is
  // currently selected — the cashier shouldn't have to know which category
  // "Wings" lives in.
  const allItems = React.useMemo(
    () => dynamicMenus.flatMap((menu) => menu.items.map((item) => ({ ...item, menuName: menu.name }))),
    [dynamicMenus]
  );

  const matchesDietary = React.useCallback(
    (item) => {
      if (dietaryFilter === "all") return true;
      const tags = [...(item.dietaryTags || []), ...(item.tags || [])];
      return tags.includes(dietaryFilter);
    },
    [dietaryFilter]
  );

  const searchResults = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      if (dietaryFilter === "all") return null;
      return allItems.filter(matchesDietary);
    }
    const starts = [];
    const contains = [];
    allItems.forEach((item) => {
      if (!matchesDietary(item)) return;
      const name = item.name.toLowerCase();
      if (name.startsWith(q)) starts.push(item);
      else if (name.includes(q)) contains.push(item);
    });
    return [...starts, ...contains];
  }, [search, allItems, dietaryFilter, matchesDietary]);


  useEffect(() => {
    if (!selected && dynamicMenus.length > 0) {
      setSelected(dynamicMenus[0]);
    }

    if (selected && !dynamicMenus.some((menu) => menu.id === selected.id)) {
      setSelected(dynamicMenus[0] || null);
    }
  }, [dynamicMenus, selected]);

  // Units of this dish/deal already sitting in the dine-in cart (the
  // Outdoor screen keeps its own local cart, so it only checks per add).
  const qtyAlreadyInCart = (item) =>
    onAddToCart
      ? 0
      : cartLines
          .filter((line) => (item.isDeal ? line.dealId === item.id : line.dishId === item.id))
          .reduce((sum, line) => sum + (line.quantity || 0), 0);

  // Tells staff exactly how many can still be added, straight from live stock.
  // Returns true when `wanted` units are OK.
  const checkStock = (item, wanted) => {
    if (item.availableQty === null || item.availableQty === undefined) return true;
    if (item.availableQty <= 0) {
      enqueueSnackbar(`${item.name} is out of stock.`, { variant: "warning" });
      return false;
    }
    const inCart = qtyAlreadyInCart(item);
    if (inCart + wanted > item.availableQty) {
      const canAdd = Math.max(0, item.availableQty - inCart);
      enqueueSnackbar(
        `Only ${item.availableQty} ${item.name} in stock${inCart > 0 ? ` (${inCart} already in this order)` : ""}. Please select ${canAdd}.`,
        { variant: "warning" }
      );
      return false;
    }
    return true;
  };

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 99) return;
    const item = allItems.find((i) => i.id === id);
    // When switching to another item the counter carries over, so compare
    // against the count this tap would produce.
    if (item && !checkStock(item, (itemId === id ? itemCount : 0) + 1)) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  // Unique sizes (in the order they were defined) and, for the size
  // currently picked, the crusts actually offered at that size — so the
  // crust dropdown never shows a combination that doesn't have a price.
  const sizeOptions = (item) => [...new Set(item.variants.map((v) => v.size))];
  const crustOptions = (item, size) =>
    item.variants.filter((v) => v.size === size && v.crust).map((v) => v.crust);

  const getSelection = (item) => {
    const picked = variantSelections[item.id];
    const size = picked?.size || item.variants[0]?.size || "";
    const crustsForSize = crustOptions(item, size);
    const crust = picked?.crust && crustsForSize.includes(picked.crust) ? picked.crust : crustsForSize[0] || "";
    return { size, crust };
  };

  const setSelection = (item, patch) => {
    setVariantSelections((prev) => ({
      ...prev,
      [item.id]: { ...getSelection(item), ...patch },
    }));
  };

  const resolvedVariant = (item) => {
    if (item.variants.length === 0) return null;
    const { size, crust } = getSelection(item);
    return item.variants.find((v) => v.size === size && (v.crust || "") === (crust || "")) || item.variants[0];
  };

  const priceFor = (item) => {
    const variant = resolvedVariant(item);
    return variant ? variant.price : item.price;
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;
    if (!checkStock(item, itemCount)) return;

    const { id, name, icon } = item;
    let newObj;

    if (item.isDeal) {
      const price = item.price;
      newObj = {
        id: `${id}-${Date.now()}`,
        dealId: id,
        name,
        icon,
        pricePerQuantity: price,
        quantity: itemCount,
        price: price * itemCount,
        isDeal: true,
        // Carried through so the backend can deduct real stock for each
        // dish inside the bundle, exactly like an online-store deal order.
        dealItems: item.dealItems || [],
      };
    } else {
      const variant = resolvedVariant(item);
      const price = priceFor(item);
      const variantLabel = variant ? [variant.size, variant.crust].filter(Boolean).join(", ") : "";

      newObj = {
        id: `${id}-${Date.now()}`,
        dishId: id,
        name: variantLabel ? `${name} (${variantLabel})` : name,
        icon,
        pricePerQuantity: price,
        quantity: itemCount,
        price: price * itemCount,
        size: variant?.size,
        crust: variant?.crust || undefined,
      };
    }

    if (onAddToCart) {
      onAddToCart(newObj);
    } else {
      dispatch(addItems(newObj));
    }
    setItemCount(0);
  };

  const renderItemCard = (item) => {
    const hasVariants = item.variants.length > 0;
    const selection = hasVariants ? getSelection(item) : null;
    const crusts = hasVariants ? crustOptions(item, selection.size) : [];
    const displayPrice = priceFor(item);
    const isOutOfStock = item.availableQty !== null && item.availableQty <= 0;

    return (
      <div
        key={item.id}
        className={`flex flex-col justify-between gap-3 p-4 rounded-2xl transition-all duration-150 min-h-[175px] border ${
          isClean
            ? "bg-white border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md"
            : "bg-slate-900/90 border-slate-800 hover:border-amber-500/50 shadow-md hover:shadow-amber-500/5"
        }`}
      >
        <div className="flex items-start justify-between w-full gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm sm:text-base font-bold line-clamp-2 break-words leading-tight flex items-center ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              <span className="inline-flex items-center justify-center mr-1.5 align-middle shrink-0">
                <FoodIcon icon={item.icon} size={16} />
              </span>
              <span>{item.name}</span>
              {item.isDeal && (
                <span className="ml-2 align-middle text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  DEAL
                </span>
              )}
            </h3>
            {item.description && (
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isClean ? "text-slate-500" : "text-slate-400"}`}>
                {item.description}
              </p>
            )}
            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                      tag === "Vegetarian"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                        : tag === "Spicy"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                        : tag === "Chef Special"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                        : tag === "Gluten-Free"
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25"
                        : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {tag === "Vegetarian" ? "🌱" : tag === "Spicy" ? "🌶️" : tag === "Chef Special" ? "👑" : tag === "Gluten-Free" ? "🌾" : "👶"} {tag}
                  </span>
                ))}
              </div>
            )}
            {item.availableQty !== null && item.availableQty <= 5 && (

              <p
                className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${
                  isOutOfStock ? "text-rose-500" : "text-amber-500"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {isOutOfStock ? "Out of stock" : `Only ${item.availableQty} left`}
              </p>
            )}
          </div>

          <button
            onClick={() => handleAddToCart(item)}
            disabled={isOutOfStock}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shrink-0 transition disabled:opacity-30 disabled:pointer-events-none shadow-xs"
            title="Add to cart"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>

        {hasVariants && (
          <div className="flex items-center gap-2 w-full pt-1">
            <select
              value={selection.size}
              onChange={(e) => setSelection(item, { size: e.target.value, crust: "" })}
              className={`flex-1 min-w-0 text-xs rounded-xl px-2.5 py-2 outline-none border transition ${
                isClean
                  ? "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:bg-white"
                  : "bg-slate-950/80 text-white border-slate-800 focus:border-amber-500"
              }`}
            >
              {sizeOptions(item).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {crusts.length > 0 && (
              <select
                value={selection.crust}
                onChange={(e) => setSelection(item, { crust: e.target.value })}
                className={`flex-1 min-w-0 text-xs rounded-xl px-2.5 py-2 outline-none border transition ${
                  isClean
                    ? "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:bg-white"
                    : "bg-slate-950/80 text-white border-slate-800 focus:border-amber-500"
                }`}
              >
                {crusts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div
          className={`flex items-center justify-between gap-2 w-full pt-2 border-t mt-auto ${
            isClean ? "border-slate-100" : "border-slate-800/80"
          }`}
        >
          <div>
            <span
              className={`text-[10px] uppercase font-bold block leading-none ${
                isClean ? "text-slate-400" : "text-slate-400"
              }`}
            >
              Price
            </span>
            <p
              className={`text-base sm:text-lg font-black font-mono mt-0.5 ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              Rs {displayPrice}
            </p>
          </div>

          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-xl gap-2 sm:gap-4 shrink-0 border ${
              isClean ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"
            }`}
          >
            <button
              onClick={() => decrement(item.id)}
              className={`w-7 h-7 rounded-lg font-bold text-base flex items-center justify-center transition ${
                isClean
                  ? "bg-white text-slate-900 hover:bg-slate-200 shadow-xs"
                  : "bg-slate-800 hover:bg-slate-700 text-amber-400"
              }`}
            >
              &minus;
            </button>
            <span
              className={`text-xs sm:text-sm font-black min-w-4 text-center ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              {itemId === item.id ? itemCount : "0"}
            </span>
            <button
              onClick={() => increment(item.id)}
              className={`w-7 h-7 rounded-lg font-bold text-base flex items-center justify-center transition ${
                isClean
                  ? "bg-white text-slate-900 hover:bg-slate-200 shadow-xs"
                  : "bg-slate-800 hover:bg-slate-700 text-amber-400"
              }`}
            >
              &#43;
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (dynamicMenus.length === 0) {
    return (
      <div className="px-10 py-16 text-center text-[#ababab]">
        <p className="text-lg font-semibold text-[#f5f5f5]">No menu items yet</p>
        <p className="mt-1 text-sm">Add a category and a dish from the Dashboard → Menu tab to get started.</p>
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="w-full mb-3">
        <div
          className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xs transition ${
            isClean
              ? "bg-white border border-slate-200/90 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20"
              : "bg-slate-900/90 border border-slate-800 focus-within:border-amber-500/60 shadow-md"
          }`}
        >
          <FaSearch className={isClean ? "text-slate-400 shrink-0" : "text-slate-500 shrink-0"} size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search menu dishes, pizza, burgers, deals…"
            className={`bg-transparent flex-1 text-xs sm:text-sm outline-none ${
              isClean ? "text-slate-900 placeholder:text-slate-400" : "text-white placeholder:text-slate-500"
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={`shrink-0 ${isClean ? "text-slate-400 hover:text-slate-700" : "text-slate-400 hover:text-white"}`}
              aria-label="Clear search"
            >
              <FaTimes size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Dietary Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {[
          { id: "all", label: "All Items" },
          { id: "Vegetarian", label: "🌱 Vegetarian" },
          { id: "Spicy", label: "🌶️ Spicy" },
          { id: "Chef Special", label: "👑 Chef Special" },
          { id: "Gluten-Free", label: "🌾 Gluten-Free" },
          { id: "Kids Friendly", label: "👶 Kids Friendly" },
        ].map((chip) => {
          const isCurrent = dietaryFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setDietaryFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap border shrink-0 ${
                isCurrent
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-black"
                  : isClean
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {searchResults ? (
        <div className="w-full">

          <p
            className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {searchResults.length === 0
              ? `No items match "${search}"`
              : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${search}"`}
          </p>
          <div className="grid grid-cols-2 gap-2.5 w-full sm:grid-cols-3 xl:grid-cols-4">
            {searchResults.map(renderItemCard)}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:grid-cols-3 xl:grid-cols-4 mb-3">
            {dynamicMenus.map((menu) => {
              const isSelected = selected?.id === menu.id;
              return (
                <div
                  key={menu.id}
                  className={`flex flex-col items-start justify-between gap-1.5 p-3 rounded-2xl cursor-pointer transition-all duration-150 border min-h-[75px] sm:min-h-[85px] ${
                    isSelected
                      ? isClean
                        ? "bg-amber-50/80 border-2 border-amber-500 text-slate-950 shadow-sm"
                        : "bg-amber-500/10 border-2 border-amber-500 text-white shadow-sm"
                      : isClean
                      ? "bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 shadow-xs hover:bg-slate-50/80"
                      : "bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 shadow-md"
                  }`}
                  onClick={() => {
                    setSelected(menu);
                    setItemId(0);
                    setItemCount(0);
                  }}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <h3
                      className={`text-xs sm:text-sm font-extrabold line-clamp-2 break-words min-w-0 flex-1 leading-tight ${
                        isSelected
                          ? isClean ? "text-amber-950" : "text-amber-400"
                          : isClean ? "text-slate-900" : "text-white"
                      }`}
                    >
                      <MenuIcon icon={menu.icon} /> {menu.name}
                    </h3>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20 shrink-0 mt-1" />
                    )}
                  </div>
                  <p
                    className={`text-[11px] font-bold ${
                      isSelected
                        ? isClean ? "text-amber-700" : "text-amber-400"
                        : isClean
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {menu.items.length} {menu.items.length === 1 ? "Item" : "Items"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="w-full my-2 border-t border-slate-200/80 dark:border-slate-800/80" />

          {/* Dishes Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:grid-cols-3 xl:grid-cols-4 pt-1">
            {(selected?.items || []).filter(matchesDietary).map(renderItemCard)}
          </div>

        </>
      )}
    </>
  );
};

export default MenuContainer;
