import React, { useEffect, useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories, getDishes, getDeals } from "../../https";
import { addItems } from "../../redux/slices/cartSlice";
import { resolveImageUrl } from "../../utils";
import { FoodIcon } from "../shared/AppIcons";

// A category icon is either an emoji or an uploaded photo (a path like
// "/uploads/fries-123.jpg"). Photos must be drawn as an <img>; printing the
// value as text is what showed the raw path next to the category name.
const isImageIcon = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const MenuIcon = ({ icon }) =>
  isImageIcon(icon) ? (
    <img
      src={resolveImageUrl(icon)}
      alt=""
      className="mr-1 inline-block h-7 w-7 rounded-md object-cover align-middle"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <FoodIcon icon={icon} className="mr-1 inline-block align-middle" />
  );

const palette = ["#b73e3e", "#5b45b0", "#7f167f", "#735f32", "#1d2569", "#285430", "#b73e3e", "#5b45b0"];

const categoryIcons = {
  starters: "bowl",
  salads: "salad",
  pizza: "pizza",
  beverages: "cocktail",
  soups: "bowl",
  desserts: "cake",
  "main course": "rice",
  "alcoholic drinks": "beer",
};

const getCategoryIcon = (name = "") => {
  const key = name.toLowerCase();
  return categoryIcons[key] || categoryIcons[key.split(" ")[0]] || "utensils";
};

// `onAddToCart`, when passed, receives each cart-line object instead of it
// being dispatched to the global (dine-in) redux cart — this is what lets
// the Outdoor/Takeaway window reuse this exact same menu-browsing UI
// against its own local, table-free cart.
const MenuContainer = ({ onAddToCart }) => {
  const dispatch = useDispatch();
  const cartLines = useSelector((state) => state.cart);
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const [search, setSearch] = useState("");
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
          icon: dish.icon || "utensils",
          isInventoryTracked: Boolean(dish.isInventoryTracked),
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
        icon: "flame",
        items: deals.map((deal) => ({
          id: deal._id,
          name: deal.name,
          price: Number(deal.price) || 0,
          description:
            deal.description ||
            (deal.items || []).map((it) => (it.quantity > 1 ? `${it.quantity}x ${it.label}` : it.label)).join(", "),
          variants: [],
          category: "Deals",
          icon: deal.icon || "flame",
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

  const searchResults = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const starts = [];
    const contains = [];
    allItems.forEach((item) => {
      const name = item.name.toLowerCase();
      if (name.startsWith(q)) starts.push(item);
      else if (name.includes(q)) contains.push(item);
    });
    return [...starts, ...contains];
  }, [search, allItems]);

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

    return (
      <div
        key={item.id}
        className="flex flex-col items-start justify-between gap-2 p-3 sm:p-4 rounded-lg min-h-[160px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
      >
        <div className="flex items-start justify-between w-full gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-[#f5f5f5] text-sm sm:text-lg font-semibold line-clamp-2 break-words">
              {item.icon ? <FoodIcon icon={item.icon} className="inline-block mr-1.5 align-[-2px] text-[#f6b100]" /> : null}
              {item.name}
              {item.isDeal && (
                <span className="ml-2 align-middle text-[10px] font-bold bg-[#c8102e] text-white px-1.5 py-0.5 rounded">
                  DEAL
                </span>
              )}
            </h1>
            {item.description && (
              <p className="text-[#ababab] text-xs mt-0.5 line-clamp-2">{item.description}</p>
            )}
            {item.availableQty !== null && item.availableQty <= 5 && (
              <p className={`text-xs font-semibold mt-1 ${item.availableQty <= 0 ? "text-red-500" : "text-yellow-400"}`}>
                {item.availableQty <= 0 ? "Out of stock" : `Only ${item.availableQty} left`}
              </p>
            )}
          </div>
          <button
            onClick={() => handleAddToCart(item)}
            disabled={item.availableQty !== null && item.availableQty <= 0}
            className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg shrink-0 disabled:opacity-40"
          >
            <FaShoppingCart size={18} />
          </button>
        </div>

        {hasVariants && (
          <div className="flex items-center gap-2 w-full">
            <select
              value={selection.size}
              onChange={(e) => setSelection(item, { size: e.target.value, crust: "" })}
              className="flex-1 min-w-0 bg-[#1f1f1f] text-[#f5f5f5] text-xs rounded px-2 py-2 outline-none border border-[#333]"
            >
              {sizeOptions(item).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {crusts.length > 0 && (
              <select
                value={selection.crust}
                onChange={(e) => setSelection(item, { crust: e.target.value })}
                className="flex-1 min-w-0 bg-[#1f1f1f] text-[#f5f5f5] text-xs rounded px-2 py-2 outline-none border border-[#333]"
              >
                {crusts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <p className="text-[#f5f5f5] text-base sm:text-xl font-bold">Rs {displayPrice}</p>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-2 py-2 sm:px-4 sm:py-3 rounded-lg gap-2 sm:gap-6 flex-1 min-w-[96px] max-w-[140px]">
            <button
              onClick={() => decrement(item.id)}
              className="text-yellow-500 text-xl sm:text-2xl leading-none"
            >
              &minus;
            </button>
            <span className="text-white text-sm sm:text-base">
              {itemId === item.id ? itemCount : "0"}
            </span>
            <button
              onClick={() => increment(item.id)}
              className="text-yellow-500 text-xl sm:text-2xl leading-none"
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
      {/* Search — matches by name anywhere on the menu (deals included),
          regardless of which category tab is currently open, so staff don't
          have to hunt for which tab an item lives in. */}
      <div className="px-4 sm:px-6 lg:px-10 pt-4">
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3">
          <FaSearch className="text-[#ababab] shrink-0" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search the menu — try “Wings”…"
            className="bg-transparent flex-1 text-[#f5f5f5] text-sm outline-none placeholder:text-[#6b6b6b]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#ababab] shrink-0" aria-label="Clear search">
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {searchResults ? (
        <div className="px-4 sm:px-6 lg:px-10 pt-4">
          <p className="text-[#ababab] text-xs font-medium mb-3">
            {searchResults.length === 0
              ? `No items match "${search}"`
              : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${search}"`}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(renderItemCard)}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4 py-4 w-full sm:gap-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4 lg:px-10">
            {dynamicMenus.map((menu) => {
              return (
                <div
                  key={menu.id}
                  // No fixed height - a long category name (e.g. "Burgers &
                  // Shami") wraps to 2 lines on a narrow mobile card, and a
                  // fixed h-[100px] used to clip/overlap that second line
                  // with the "selected" icon. min-h keeps cards the same
                  // size for the common (1-line) case without breaking the
                  // rare long-name one.
                  className="flex flex-col items-start justify-between gap-3 p-3 sm:p-4 rounded-lg min-h-[90px] sm:min-h-[100px] cursor-pointer"
                  style={{ backgroundColor: menu.bgColor }}
                  onClick={() => {
                    setSelected(menu);
                    setItemId(0);
                    setItemCount(0);
                  }}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <h1 className="text-[#f5f5f5] text-sm sm:text-lg font-semibold line-clamp-2 break-words min-w-0 flex-1">
                      <MenuIcon icon={menu.icon} /> {menu.name}
                    </h1>
                    {selected?.id === menu.id && (
                      <GrRadialSelected className="text-white shrink-0 mt-0.5" size={18} />
                    )}
                  </div>
                  <p className="text-[#ababab] text-xs sm:text-sm font-semibold">
                    {menu.items.length} Items
                  </p>
                </div>
              );
            })}
          </div>

          <hr className="border-[#2a2a2a] border-t-2 mt-4" />

          <div className="grid grid-cols-2 gap-3 px-4 py-4 w-full sm:gap-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4 lg:px-10">
            {selected?.items.map(renderItemCard)}
          </div>
        </>
      )}
    </>
  );
};

export default MenuContainer;
