import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdTableBar,
  MdCategory,
  MdInsights,
  MdReceiptLong,
  MdPayments,
  MdRestaurantMenu,
  MdLocalOffer,
  MdViewCarousel,
  MdTrendingUp,
  MdInventory2,
  MdBadge,
  MdTune,
  MdAccountBalance,
  MdMusicNote,
  MdDevices,
  MdRateReview,
  MdQrCode2,
  MdAdd,
  MdStorefront,
  MdMenu,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdTimer,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { enqueueSnackbar } from "notistack";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import DealsManager from "../components/dashboard/DealsManager";
import CouponsCustomerMarketing from "../components/dashboard/CouponsCustomerMarketing";
import HeroSliderManager from "../components/dashboard/HeroSliderManager";
import ProfitExpenses from "../components/dashboard/ProfitExpenses";
import PaymentsOverview from "../components/dashboard/PaymentsOverview";
import TaxManager from "../components/dashboard/TaxManager";
import PrepSettingsManager from "../components/dashboard/PrepSettingsManager";
import BuildYourOwnManager from "../components/dashboard/BuildYourOwnManager";
import StaffManagement from "../components/dashboard/StaffManagement";
import UserManagement from "../components/dashboard/UserManagement";
import AssetManagement from "../components/dashboard/AssetManagement";
import ReviewsManager from "../components/dashboard/ReviewsManager";
import PaymentSettingsManager from "../components/dashboard/PaymentSettingsManager";
import BranchesManager from "../components/dashboard/BranchesManager";
import MusicPlayer from "../components/shared/MusicPlayer";
import {
  getCategories,
  getDishes,
  deleteCategory,
  deleteDish,
  reorderCategories,
  reorderDishes,
  getInventoryItems,
  exportInventoryReport,
  addInventoryItem,
  updateInventoryItem,
  adjustInventoryItem,
  deleteInventoryItem,
} from "../https";
import { resolveImageUrl } from "../utils";
import { MdSearch } from "react-icons/md";
import ExportButtons from "../components/dashboard/ExportButtons";
import { I, FoodIcon } from "../components/shared/AppIcons";

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const buttons = [
  { label: "Add Table", hint: "Dine-in seating", icon: <MdTableBar />, action: "table", tint: "#3b82f6" },
  { label: "Add Category", hint: "Group your menu", icon: <MdCategory />, action: "category", tint: "#a855f7" },
  { label: "Add Dishes", hint: "New menu item", icon: <BiSolidDish />, action: "dishes", tint: "#f6b100" },
];

// Sidebar sections. Order here is the order shown on screen.
const tabGroups = [
  { label: "Overview", tabs: ["Metrics", "Orders", "Payments", "Profit"] },
  { label: "Storefront", tabs: ["Menu", "Deals", "Coupons & Customer Marketing", "Hero Slider", "Build Your Own", "Reviews"] },
  { label: "Delivery & Pickup", tabs: ["Branches"] },
  { label: "Operations", tabs: ["Inventory", "Staff", "Assets", "User & Employees"] },
  { label: "Settings", tabs: ["Order Prep", "Payment Settings", "Tax", "Music"] },
];
const tabs = tabGroups.flatMap((g) => g.tabs);

// Icon per tab, so the bar can be scanned at a glance.
const tabIcons = {
  Metrics: <MdInsights />,
  Orders: <MdReceiptLong />,
  Payments: <MdPayments />,
  "Payment Settings": <MdQrCode2 />,
  Menu: <MdRestaurantMenu />,
  Deals: <MdLocalOffer />,
  "Coupons & Customer Marketing": <MdLocalOffer />,
  "Hero Slider": <MdViewCarousel />,
  Reviews: <MdRateReview />,
  "User & Employees": <MdBadge />,
  Profit: <MdTrendingUp />,
  Inventory: <MdInventory2 />,
  Staff: <MdBadge />,
  "Build Your Own": <MdTune />,
  "Order Prep": <MdTimer />,
  Tax: <MdAccountBalance />,
  Music: <MdMusicNote />,
  Assets: <MdDevices />,
  Branches: <MdStorefront />,
};
// Accent colour per section: drives the sidebar chips, the active pill and the page backdrop glow.
const tabTheme = {
  Metrics: "#3b82f6",
  Orders: "#f97316",
  Payments: "#10b981",
  Profit: "#22c55e",
  Menu: "#ef4444",
  Deals: "#ec4899",
  "Coupons & Customer Marketing": "#f6b100",
  "Hero Slider": "#a855f7",
  "Build Your Own": "#14b8a6",
  Reviews: "#f6b100",
  "User & Employees": "#0ea5e9",
  Branches: "#06b6d4",
  Inventory: "#8b5cf6",
  Staff: "#0ea5e9",
  Assets: "#84cc16",
  "Payment Settings": "#6366f1",
  "Order Prep": "#fb923c",
  Tax: "#f59e0b",
  Music: "#f43f5e",
};
const groupTheme = {
  Overview: "#3b82f6",
  Storefront: "#ec4899",
  "Delivery & Pickup": "#06b6d4",
  Operations: "#8b5cf6",
  Settings: "#f59e0b",
};
const Dashboard = () => {
  const queryClient = useQueryClient();
  const { role, permissions = [] } = useSelector((state) => state.user);
  const can = (permission) => permissions.includes(permission);
  const tabPermissions = {
    Metrics: "dashboard.view",
    Orders: "orders.view",
    Payments: "payments.process",
    "Payment Settings": "settings.manage",
    Menu: "menu.view",
    Deals: "deals.manage",
    "Coupons & Customer Marketing": "coupons.manage",
    "Hero Slider": "hero.manage",
    Reviews: "settings.manage",
    Profit: "finance.view",
    Inventory: "inventory.view",
    Staff: "staff.view",
    "Build Your Own": "menu.edit",
    "Order Prep": "settings.manage",
    Tax: "settings.manage",
    Music: "settings.view",
    Assets: "assets.view",
    Branches: "settings.manage",
    "User & Employees": "users.view",
  };
  const canSeeTab = (tab) => can(tabPermissions[tab]) &&
    (tab !== "Metrics" || (can("orders.view") && can("menu.view") && can("tables.view"))) &&
    (tab !== "Profit" || can("expenses.view"));
  const visibleGroups = tabGroups
    .map((group) => ({ ...group, tabs: group.tabs.filter(canSeeTab) }))
    .filter((group) => group.tabs.length > 0);
  const visibleTabs = visibleGroups.flatMap((group) => group.tabs);
  const defaultTab = visibleTabs.includes("Metrics") ? "Metrics" : visibleTabs[0] || "Metrics";
  const [sideOpen, setSideOpen] = useState(false); // mobile drawer
  const [sectionSearch, setSectionSearch] = useState("");
  const [sideCollapsed, setSideCollapsed] = useState(false); // desktop icon-only

  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  // /dashboard?tab=Inventory opens straight on that tab (used by the
  // low-stock popup's "Restock now" button).
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(visibleTabs.includes(requestedTab) ? requestedTab : defaultTab);
  useEffect(() => {
    setActiveTab(visibleTabs.includes(requestedTab) ? requestedTab : defaultTab);
  }, [requestedTab, defaultTab]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [categorySearch, setCategorySearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
    enabled: can("menu.view"),
  });

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
    enabled: can("menu.view"),
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
    placeholderData: keepPreviousData,
    refetchInterval: 15000, // stock changes with every order
    enabled: can("inventory.view"),
  });

  const categories = categoriesData?.data?.data ?? [];
  const dishes = dishesData?.data?.data ?? [];
  const inventoryItems = inventoryData?.data?.data ?? [];

  // Reordering (drag-and-drop) relies on the visible list's index matching
  // the real array — so filtered results are shown as a plain (non-drag)
  // list instead, and go back to the full draggable list once the search
  // box is cleared.
  const filteredCategories = categorySearch.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(categorySearch.trim().toLowerCase()))
    : categories;
  const filteredDishes = dishSearch.trim()
    ? dishes.filter(
        (d) =>
          d.name.toLowerCase().includes(dishSearch.trim().toLowerCase()) ||
          (d.category?.name || "").toLowerCase().includes(dishSearch.trim().toLowerCase())
      )
    : dishes;

  const defaultInventoryForm = {
    name: "",
    category: "",
    unit: "pcs",
    quantity: 0,
    reorderLevel: 0,
    costPrice: 0,
    sellingPrice: 0,
    notes: "",
  };

  const [inventoryForm, setInventoryForm] = useState(defaultInventoryForm);
  const [editingInventory, setEditingInventory] = useState(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryStatus, setInventoryStatus] = useState("");
  const filteredInventoryItems = inventorySearch.trim()
    ? inventoryItems.filter(
        (item) =>
          item.name.toLowerCase().includes(inventorySearch.trim().toLowerCase()) ||
          (item.category?.name || "").toLowerCase().includes(inventorySearch.trim().toLowerCase())
      )
    : inventoryItems;

  // `data` is passed when editing an existing category/dish so the Modal can
  // pre-fill the form and PUT instead of POST.
  const handleOpenModal = (action, data = null) => {
    setModalAction(action);
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["dishes"]);
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete category.", { variant: "error" });
    },
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: (order) => reorderCategories(order),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      enqueueSnackbar("Categories reordered", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to reorder categories.", { variant: "error" });
    },
  });


  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete dish.", { variant: "error" });
    },
  });

  const reorderDishesMutation = useMutation({
    mutationFn: (order) => reorderDishes(order),
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
      enqueueSnackbar("Dishes reordered", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to reorder dishes.", { variant: "error" });
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      setInventoryForm(defaultInventoryForm);
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      enqueueSnackbar("Inventory item added successfully!", { variant: "success" });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add inventory item.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      setEditingInventory(null);
      setInventoryForm(defaultInventoryForm);
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      enqueueSnackbar("Inventory item updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to update inventory item.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const adjustInventoryMutation = useMutation({
    mutationFn: adjustInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      enqueueSnackbar("Inventory updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to adjust inventory.", { variant: "error" });
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      enqueueSnackbar("Inventory item deleted successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete inventory item.", { variant: "error" });
    },
  });

  // Handle drag end for react-beautiful-dnd
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (destination.droppableId === "categories") {
      if (!can("categories.manage")) return;
      const newOrder = Array.from(categories);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      const payload = newOrder.map((c, idx) => ({ id: c._id, position: idx + 1 }));
      reorderCategoriesMutation.mutate(payload);
    }

    if (destination.droppableId === "dishes") {
      if (!can("menu.edit")) return;
      const newOrder = Array.from(dishes);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      const payload = newOrder.map((d, idx) => ({ id: d._id, position: idx + 1 }));
      reorderDishesMutation.mutate(payload);
    }
  };

  const handleDeleteCategory = (category) => {
    const confirmed = window.confirm(`Delete category "${category.name}" and all its dishes?`);
    if (confirmed) {
      deleteCategoryMutation.mutate(category._id);
    }
  };

  const handleDeleteDish = (dish) => {
    const confirmed = window.confirm(`Delete dish "${dish.name}"?`);
    if (confirmed) {
      deleteDishMutation.mutate(dish._id);
    }
  };

  const handleInventorySubmit = (event) => {
    event.preventDefault();

    if (!inventoryForm.name.trim()) {
      enqueueSnackbar("Please enter an inventory item name.", { variant: "warning" });
      return;
    }

    const payload = {
      name: inventoryForm.name.trim(),
      category: inventoryForm.category.trim(),
      unit: inventoryForm.unit.trim(),
      quantity: Number(inventoryForm.quantity) || 0,
      reorderLevel: Number(inventoryForm.reorderLevel) || 0,
      costPrice: Number(inventoryForm.costPrice) || 0,
      sellingPrice: Number(inventoryForm.sellingPrice) || 0,
      notes: inventoryForm.notes.trim(),
    };

    if (editingInventory) {
      updateInventoryMutation.mutate({ inventoryId: editingInventory._id, ...payload });
      return;
    }

    createInventoryMutation.mutate(payload);
  };

  const startInventoryEdit = (item) => {
    setEditingInventory(item);
    setInventoryForm({
      name: item.name,
      category: item.category?.name || "",
      unit: item.unit || "pcs",
      quantity: item.quantity,
      reorderLevel: item.reorderLevel,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      notes: item.notes || "",
    });
  };

  const pickTab = (tab) => {
    setSectionSearch("");
    setActiveTab(tab);
    setSideOpen(false);
    window.scrollTo({ top: 0 });
  };

  // Sidebar search: matches a section's name or its group's name.
  const sectionQuery = sectionSearch.trim().toLowerCase();
  const matchedGroups = sectionQuery
    ? visibleGroups
        .map((group) => ({
          ...group,
          tabs: group.label.toLowerCase().includes(sectionQuery)
            ? group.tabs
            : group.tabs.filter((tab) => tab.toLowerCase().includes(sectionQuery)),
        }))
        .filter((group) => group.tabs.length)
    : visibleGroups;

  const sidebar = (collapsed) => (
    <nav aria-label="Dashboard sections" className="flex flex-col gap-5">
      {!collapsed && (
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-[#f6b100] focus-within:bg-white/10">
          <MdSearch className="shrink-0 text-lg text-[#8a8a8a]" />
          <span className="sr-only">Search dashboard sections</span>
          <input
            type="search"
            value={sectionSearch}
            onChange={(e) => setSectionSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matchedGroups[0]) pickTab(matchedGroups[0].tabs[0]);
              if (e.key === "Escape") setSectionSearch("");
            }}
            placeholder="Search dashboard…"
            className="w-full min-w-0 bg-transparent text-sm text-[#f5f5f5] outline-none placeholder:text-[#6f6f6f]"
          />
        </label>
      )}
      {sectionQuery && matchedGroups.length === 0 && !collapsed && (
        <p className="px-3 text-sm text-[#8a8a8a]">No section matches “{sectionSearch}”.</p>
      )}
      {matchedGroups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="px-3 mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: groupTheme[group.label] || "#8a8a8a" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: groupTheme[group.label] || "#8a8a8a", boxShadow: `0 0 8px ${groupTheme[group.label] || "#8a8a8a"}` }} />
              {group.label}
            </p>
          )}
          {collapsed && <div className="mx-3 mb-1.5 border-t border-[#333]" />}
          <ul className="flex flex-col gap-1">
            {group.tabs.map((tab) => {
              const active = activeTab === tab;
              const c = tabTheme[tab] || "#f6b100";
              return (
                <li key={tab}>
                  <button
                    onClick={() => pickTab(tab)}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? tab : undefined}
                    style={
                      active
                        ? { background: `linear-gradient(135deg, ${c}, ${c}b3)`, boxShadow: `0 6px 18px ${c}55` }
                        : undefined
                    }
                    className={`group w-full flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2 text-left"
                    } ${
                      active
                        ? "text-white"
                        : "text-[#c4c4c4] hover:text-white hover:bg-white/5 hover:translate-x-0.5"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg transition-colors"
                      style={
                        active
                          ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                          : { background: `${c}24`, color: c }
                      }
                    >
                      {tabIcons[tab]}
                    </span>
                    {!collapsed && <span className="truncate">{tab}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div
      className="dash-wide bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-10 transition-[background] duration-500"
      style={{
        backgroundImage: `radial-gradient(900px 480px at 85% -5%, ${(tabTheme[activeTab] || "#f6b100")}2e, transparent 60%), radial-gradient(700px 420px at 10% 105%, ${(tabTheme[activeTab] || "#f6b100")}1f, transparent 60%), radial-gradient(500px 300px at 55% 45%, rgba(168,85,247,0.07), transparent 70%)`,
      }}
    >
      {/* Mobile: top bar with the current section + a button that opens the drawer */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#1f1f1f]/95 backdrop-blur border-b border-[#333] px-4 py-3">
        <button
          onClick={() => setSideOpen(true)}
          aria-label="Open sections menu"
          className="w-10 h-10 rounded-xl bg-[#262626] border border-[#333] text-[#f5f5f5] flex items-center justify-center text-xl"
        >
          <MdMenu />
        </button>
        <div className="flex items-center gap-2 text-[#f5f5f5] font-semibold">
          <span className="text-[#f6b100] text-lg">{tabIcons[activeTab]}</span>
          {activeTab}
        </div>
      </div>

      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSideOpen(false)} aria-hidden="true" />
          <aside
            className="relative w-72 max-w-[85%] h-full border-r border-white/10 p-4 overflow-y-auto"
            style={{ backgroundImage: `linear-gradient(180deg, ${(tabTheme[activeTab] || "#f6b100")}22 0%, transparent 28%), linear-gradient(180deg, #1d1d24 0%, #17171b 100%)` }}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[#f5f5f5] font-bold text-lg">Dashboard</span>
              <button
                onClick={() => setSideOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-lg bg-[#262626] text-[#f5f5f5] flex items-center justify-center text-lg"
              >
                <MdClose />
              </button>
            </div>
            {sidebar(false)}
          </aside>
        </div>
      )}

      <div className="flex items-start">
        {/* Desktop: fixed sidebar that stays in view while the page scrolls */}
        <aside
          className={`hidden lg:block shrink-0 sticky top-0 self-start h-screen overflow-y-auto border-r border-white/10 py-6 transition-[width] duration-200 ${
            sideCollapsed ? "w-[76px] px-2" : "w-64 px-3"
          }`}
          style={{
            backgroundImage: `linear-gradient(180deg, ${(tabTheme[activeTab] || "#f6b100")}22 0%, transparent 28%), linear-gradient(180deg, #1d1d24 0%, #17171b 100%)`,
          }}
        >
          <div className={`flex items-center mb-5 ${sideCollapsed ? "justify-center" : "justify-between px-3"}`}>
            {!sideCollapsed && <span className="text-[#f5f5f5] font-bold text-lg">Dashboard</span>}
            <button
              onClick={() => setSideCollapsed((v) => !v)}
              aria-label={sideCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="w-8 h-8 rounded-lg bg-[#262626] border border-[#333] text-[#b5b5b5] hover:text-[#f5f5f5] flex items-center justify-center"
            >
              {sideCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
            </button>
          </div>
          {sidebar(sideCollapsed)}
        </aside>

        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
            {(can("tables.manage") || can("categories.manage") || can("menu.create") || visibleTabs.length > 0) && (
              <div className="flex flex-col 2xl:flex-row 2xl:items-end 2xl:justify-between gap-5">
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, #ffffff, ${tabTheme[activeTab] || "#f6b100"})` }}
                  >
                    {activeTab}
                  </h1>
                  <p className="text-[#8a8a8a] text-sm mt-1">Manage your menu, orders and storefront in one place.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 2xl:min-w-[640px]">
                  {buttons.filter(({ action }) =>
                    (action === "table" && can("tables.manage")) ||
                    (action === "category" && can("categories.manage")) ||
                    (action === "dishes" && can("menu.create"))
                  ).map(({ label, hint, icon, action, tint }) => (
                    <button
                      key={action}
                      onClick={() => handleOpenModal(action)}
                      className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 hover:border-white/25 rounded-2xl px-2 sm:px-4 py-3 transition-all hover:-translate-y-0.5"
                    >
                      <span
                        className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `${tint}26`, color: tint }}
                      >
                        {icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[#f5f5f5] font-semibold leading-tight">{label}</span>
                        <span className="hidden sm:block text-[#8a8a8a] text-xs mt-0.5 truncate">{hint}</span>
                      </span>
                      <span className="hidden sm:flex w-8 h-8 rounded-full bg-[#1f1f1f] text-[#f5f5f5] items-center justify-center text-lg group-hover:bg-[#f6b100] group-hover:text-[#1f1f1f] transition-colors">
                        <MdAdd />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

      {activeTab === "Branches" && <BranchesManager />}
      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && <PaymentsOverview />}
      {activeTab === "Payment Settings" && <PaymentSettingsManager />}
      {activeTab === "Tax" && <TaxManager />}
      {activeTab === "Order Prep" && <PrepSettingsManager />}
      {activeTab === "Build Your Own" && <BuildYourOwnManager />}
      {activeTab === "Staff" && <StaffManagement />}
      {activeTab === "Reviews" && <ReviewsManager />}
      {activeTab === "Music" && <MusicPlayer variant="manager" />}
      {activeTab === "Assets" && can("assets.view") && <AssetManagement role={role} />}
      {activeTab === "User & Employees" && can("users.view") && <UserManagement />}
      {activeTab === "Menu" && (
        <div className="mx-auto w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">Categories</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full bg-[#1a1a1a] text-[#f5f5f5] text-sm rounded-lg px-4 py-2.5 outline-none border border-[#333] focus:border-[#525252] placeholder:text-[#6b6b6b]"
                />
              </div>
              {categorySearch.trim() ? (
                <div className="space-y-3">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-2"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                            {isUploadedImage(category.icon) ? (
                              <img src={resolveImageUrl(category.icon)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl text-[#f6b100]"><FoodIcon icon={category.icon} /></span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#f5f5f5] font-medium truncate">{category.name}</p>
                            <p className="text-[#ababab] text-sm truncate">{category.description || "No description"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {can("categories.manage") && <button
                            onClick={() => handleOpenModal("category", category)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>}
                          {can("categories.manage") && <button
                            onClick={() => handleDeleteCategory(category)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#ababab]">No categories match "{categorySearch}".</p>
                  )}
                </div>
              ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div className="space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <Draggable key={category._id} draggableId={category._id} index={index} isDragDisabled={!can("categories.manage")}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-2">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(category.icon) ? (
                                      <img src={resolveImageUrl(category.icon)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xl text-[#f6b100]"><FoodIcon icon={category.icon} /></span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#f5f5f5] font-medium truncate">{category.name}</p>
                                    <p className="text-[#ababab] text-sm truncate">{category.description || "No description"}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {can("categories.manage") && <button
                                    onClick={() => handleOpenModal("category", category)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Edit
                                  </button>}
                                  {can("categories.manage") && <button
                                    onClick={() => handleDeleteCategory(category)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Delete
                                  </button>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-[#ababab]">No categories available.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              )}
            </div>

            <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">Dishes</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Search dishes…"
                  className="w-full bg-[#1a1a1a] text-[#f5f5f5] text-sm rounded-lg px-4 py-2.5 outline-none border border-[#333] focus:border-[#525252] placeholder:text-[#6b6b6b]"
                />
              </div>
              {dishSearch.trim() ? (
                <div className="space-y-3">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-4"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                            {isUploadedImage(dish.image) ? (
                              <img src={resolveImageUrl(dish.image)} alt={dish.name || "Menu item"} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl text-[#f6b100]"><FoodIcon icon={dish.icon} /></span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#f5f5f5] font-medium truncate">{dish.name}</p>
                            <p className="text-[#ababab] text-sm truncate">
                              {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                              {dish.isInventoryTracked && (
                                <span className="ml-2 text-green-400"><I.Check className="inline mr-1" />Inventory linked</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {can("menu.edit") && <button
                            onClick={() => handleOpenModal("dishes", dish)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>}
                          {can("menu.delete") && <button
                            onClick={() => handleDeleteDish(dish)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#ababab]">No dishes match "{dishSearch}".</p>
                  )}
                </div>
              ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dishes">
                  {(provided) => (
                    <div className="space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                      {dishes.length > 0 ? (
                        dishes.map((dish, index) => (
                          <Draggable key={dish._id} draggableId={dish._id} index={index} isDragDisabled={!can("menu.edit")}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(dish.image) ? (
                                      <img src={resolveImageUrl(dish.image)} alt={dish.name || "Menu item"} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xl text-[#f6b100]"><FoodIcon icon={dish.icon} /></span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#f5f5f5] font-medium truncate">{dish.name}</p>
                                    <p className="text-[#ababab] text-sm truncate">
                                      {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                                      {dish.isInventoryTracked && (
                                        <span className="ml-2 text-green-400"><I.Check className="inline mr-1" />Inventory linked</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {can("menu.edit") && <button
                                    onClick={() => handleOpenModal("dishes", dish)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Edit
                                  </button>}
                                  {can("menu.delete") && <button
                                    onClick={() => handleDeleteDish(dish)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Delete
                                  </button>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-[#ababab]">No dishes available.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Deals" && (
        <div className="mx-auto w-full px-6 pb-10">
          <DealsManager />
        </div>
      )}

      {activeTab === "Coupons & Customer Marketing" && <CouponsCustomerMarketing />}

      {activeTab === "Hero Slider" && (
        <div className="mx-auto w-full px-6 pb-10">
          <HeroSliderManager />
        </div>
      )}

      {activeTab === "Profit" && (
        <div className="pb-10">
          <ProfitExpenses />
        </div>
      )}

      {activeTab === "Inventory" && (
        <div className="mx-auto w-full px-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            {can("inventory.manage") && <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">
                {editingInventory ? "Edit Inventory Item" : "Add Inventory Item"}
              </h3>

              <form onSubmit={handleInventorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={inventoryForm.name}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Item name"
                  />
                  <input
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Category name"
                  />
                  <input
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, unit: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Unit (pcs/bottle/kg)"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Current quantity"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.reorderLevel}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, reorderLevel: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Reorder level"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.costPrice}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, costPrice: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Cost price"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.sellingPrice}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, sellingPrice: e.target.value })}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
                    placeholder="Selling price"
                  />
                </div>

                <textarea
                  rows="3"
                  value={inventoryForm.notes}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, notes: e.target.value })}
                  className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none w-full"
                  placeholder="Notes (optional)"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    disabled={createInventoryMutation.isPending || updateInventoryMutation.isPending}
                  >
                    {editingInventory ? "Update Item" : "Save Item"}
                  </button>
                  {editingInventory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInventory(null);
                        setInventoryForm(defaultInventoryForm);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>}

            <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">Stock Overview</h3>
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-[#1a1a1a] p-3">
                <select
                  value={inventoryStatus}
                  onChange={(e) => setInventoryStatus(e.target.value)}
                  aria-label="Stock report filter"
                  className="rounded-lg border border-[#333] bg-[#262626] px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="">All items</option>
                  <option value="low">Low stock only</option>
                  <option value="out">Out of stock only</option>
                  <option value="in">In stock only</option>
                </select>
                <ExportButtons
                  label="Stock report"
                  fallbackName="stock-report"
                  request={(format) => exportInventoryReport({ format, status: inventoryStatus || undefined, search: inventorySearch.trim() || undefined })}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search inventory…"
                  className="w-full bg-[#1a1a1a] text-[#f5f5f5] text-sm rounded-lg px-4 py-2.5 outline-none border border-[#333] focus:border-[#525252] placeholder:text-[#6b6b6b]"
                />
              </div>
              <div className="space-y-3">
                {filteredInventoryItems.length > 0 ? (
                  filteredInventoryItems.map((item) => (
                    <div key={item._id} className="rounded-lg bg-[#1a1a1a] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[#f5f5f5] font-medium">{item.name}</p>
                          <p className="text-[#ababab] text-xs">
                            {item.category?.name || "Uncategorized"} • {item.quantity} {item.unit}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.stockStatus === "low_stock" ? "bg-yellow-600/20 text-yellow-300" : item.stockStatus === "out_of_stock" ? "bg-red-600/20 text-red-300" : "bg-green-600/20 text-green-300"}`}>
                          {item.stockStatus === "low_stock" ? "Low stock" : item.stockStatus === "out_of_stock" ? "Out of stock" : "In stock"}
                        </span>
                      </div>

                      {can("inventory.adjust") || can("inventory.manage") || can("inventory.delete") ? <div className="mt-3 flex flex-wrap items-center gap-2">
                        {can("inventory.adjust") && <>
                        <input
                          type="number"
                          min="0"
                          value={restockAmounts[item._id] ?? ""}
                          onChange={(e) => setRestockAmounts({ ...restockAmounts, [item._id]: e.target.value })}
                          placeholder={`Add ${item.unit}`}
                          className="w-24 bg-[#262626] text-white text-sm rounded px-2 py-1 outline-none border border-[#333]"
                        />
                        <button
                          onClick={() => {
                            const amount = Number(restockAmounts[item._id]);
                            if (!(amount > 0)) {
                              enqueueSnackbar(`Enter how many ${item.unit} to add.`, { variant: "warning" });
                              return;
                            }
                            adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: amount, note: "Restocked" });
                            setRestockAmounts({ ...restockAmounts, [item._id]: "" });
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-2 py-1 rounded text-sm font-medium"
                        >
                          Add stock
                        </button>
                        <button
                          onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: 1, note: "Manual stock increment" })}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: -1, note: "Manual stock decrement" })}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                        >
                          -1
                        </button>
                        </>}
                        {can("inventory.manage") && <button
                          onClick={() => startInventoryEdit(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>}
                        {can("inventory.delete") && <button
                          onClick={() => {
                            if (window.confirm(`Delete inventory item "${item.name}"?`)) {
                              deleteInventoryMutation.mutate(item._id);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>}
                      </div>
                      : null}
                    </div>
                  ))
                ) : (
                  <p className="text-[#ababab]">
                    {inventorySearch.trim() ? `No inventory items match "${inventorySearch}".` : "No inventory items yet."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        </main>
      </div>

      {isModalOpen && (
        <Modal action={modalAction} setIsModalOpen={setIsModalOpen} initialData={modalInitialData} />
      )}
    </div>
  );
};

export default Dashboard;
