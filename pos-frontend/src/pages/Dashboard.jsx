import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdTableBar, MdCategory, MdDeleteSweep } from "react-icons/md";
import FoodIcon from "../utils/foodIcons";
import { BiSolidDish } from "react-icons/bi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { enqueueSnackbar } from "notistack";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import DealsManager from "../components/dashboard/DealsManager";
import HeroSliderManager from "../components/dashboard/HeroSliderManager";
import ProfitExpenses from "../components/dashboard/ProfitExpenses";
import PaymentsOverview from "../components/dashboard/PaymentsOverview";
import TaxManager from "../components/dashboard/TaxManager";
import BuildYourOwnManager from "../components/dashboard/BuildYourOwnManager";
import StaffManagement from "../components/dashboard/StaffManagement";
import AssetManagement from "../components/dashboard/AssetManagement";
import MusicPlayer from "../components/shared/MusicPlayer";
import SectionSummaryView from "../components/dashboard/SectionSummaryView";
import InventoryDrawer from "../components/dashboard/InventoryDrawer";
import InventoryAnalytics from "../components/dashboard/InventoryAnalytics";
import WastageModal from "../components/dashboard/WastageModal";
import PrinterManager from "../components/dashboard/PrinterManager";

import {
  getCategories,
  getDishes,
  getOrders,
  deleteCategory,
  deleteDish,
  reorderCategories,
  reorderDishes,
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  adjustInventoryItem,
  deleteInventoryItem,
} from "../https";
import { resolveImageUrl } from "../utils";

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

export const summaryTabs = [
  "Finance Operations",
  "Stock Operations",
  "Menu Operations",
  "HR Operations",
  "Marketing Operations",
  "Admin Operations",
  "Inventory_Summary",
  "Menu_Summary",
  "Orders_Summary",
  "CRM_Summary",
  "Settings_Summary",
];

const tabs = [
  "Metrics",
  "Orders",
  "Payments",
  "Menu",
  "Categories",
  "Deals",
  "Hero Slider",
  "Profit",
  "Inventory",
  "Staff",
  "Build Your Own",
  "Tax",
  "Printers",
  "Music",
  "Assets",
  ...summaryTabs,
];
const assetRoles = ["admin", "accountant", "asset manager", "read only"];

const Dashboard = () => {
  const queryClient = useQueryClient();
  const role = useSelector((state) => state.user.role);
  const isAdmin = String(role || "").toLowerCase() === "admin";
  const visibleTabs = isAdmin ? tabs : ["Assets"];

  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const legacyTabMap = {
    Inventory_Summary: "Stock Operations",
    Menu_Summary: "Menu Operations",
    Orders_Summary: "Finance Operations",
    CRM_Summary: "HR Operations",
    Settings_Summary: "Admin Operations",
  };

  const rawTab = searchParams.get("tab");
  const requestedTab = legacyTabMap[rawTab] || rawTab;

  useEffect(() => {
    if (rawTab && legacyTabMap[rawTab]) {
      navigate(`/dashboard?tab=${legacyTabMap[rawTab]}`, { replace: true });
    }
  }, [rawTab, navigate]);

  const [activeTab, setActiveTab] = useState(
    visibleTabs.includes(requestedTab) ? requestedTab : (isAdmin ? "Metrics" : "Assets")
  );

  useEffect(() => {
    setActiveTab(visibleTabs.includes(requestedTab) ? requestedTab : (isAdmin ? "Metrics" : "Assets"));
  }, [requestedTab, isAdmin, visibleTabs]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };
  const [restockAmounts, setRestockAmounts] = useState({});
  const [categorySearch, setCategorySearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");
  const [selectedDishCategory, setSelectedDishCategory] = useState("all");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
    enabled: isAdmin,
  });

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
    enabled: isAdmin,
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
    placeholderData: keepPreviousData,
    refetchInterval: 15000, // stock changes with every order
    enabled: isAdmin,
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
    enabled: isAdmin,
  });

  const categories = categoriesData?.data?.data ?? [];
  const dishes = dishesData?.data?.data ?? [];
  const inventoryItems = inventoryData?.data?.data ?? [];
  const orders = ordersData?.data?.data ?? [];

  const categoryDishCounts = useMemo(() => {
    const counts = {};
    dishes.forEach((d) => {
      const catId = d.category?._id || d.category;
      if (catId) counts[catId] = (counts[catId] || 0) + 1;
    });
    return counts;
  }, [dishes]);

  // Reordering (drag-and-drop) relies on the visible list's index matching
  // the real array — so filtered results are shown as a plain (non-drag)
  // list instead, and go back to the full draggable list once the search
  // box is cleared.
  const filteredCategories = categorySearch.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(categorySearch.trim().toLowerCase()))
    : categories;

  const filteredDishes = useMemo(() => {
    let result = dishes;
    if (selectedDishCategory !== "all") {
      result = result.filter(
        (d) =>
          (d.category?._id || d.category) === selectedDishCategory ||
          (d.category?.name || "") === selectedDishCategory
      );
    }
    if (dishSearch.trim()) {
      const q = dishSearch.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.category?.name || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [dishes, selectedDishCategory, dishSearch]);

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

  const [editingInventory, setEditingInventory] = useState(null);
  const [isInventoryDrawerOpen, setIsInventoryDrawerOpen] = useState(false);
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);
  const [wastageSelectedItem, setWastageSelectedItem] = useState(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("all");


  const existingInventoryCategories = useMemo(() => {
    return Array.from(
      new Set(
        inventoryItems
          .map((i) => i.category?.name || i.category)
          .filter(Boolean)
      )
    );
  }, [inventoryItems]);

  const filteredInventoryItems = inventoryItems.filter((item) => {
    const matchesSearch =
      !inventorySearch.trim() ||
      item.name.toLowerCase().includes(inventorySearch.trim().toLowerCase()) ||
      (item.category?.name || "").toLowerCase().includes(inventorySearch.trim().toLowerCase());
    const matchesStatus =
      inventoryStatusFilter === "all" ||
      (inventoryStatusFilter === "low_stock" && item.stockStatus === "low_stock") ||
      (inventoryStatusFilter === "out_of_stock" && item.stockStatus === "out_of_stock") ||
      (inventoryStatusFilter === "in_stock" && (!item.stockStatus || item.stockStatus === "in_stock"));
    return matchesSearch && matchesStatus;
  });

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
      setIsInventoryDrawerOpen(false);
      setEditingInventory(null);
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
      setIsInventoryDrawerOpen(false);
      setEditingInventory(null);
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
      const newOrder = Array.from(categories);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      const payload = newOrder.map((c, idx) => ({ id: c._id, position: idx + 1 }));
      reorderCategoriesMutation.mutate(payload);
    }

    if (destination.droppableId === "dishes") {
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

  const handleDrawerSubmit = (formData) => {
    const payload = {
      name: formData.name.trim(),
      category: formData.category?.trim() || "Uncategorized",
      unit: formData.unit?.trim() || "pcs",
      quantity: Number(formData.quantity) || 0,
      reorderLevel: Number(formData.reorderLevel) || 0,
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      notes: formData.notes?.trim() || "",
    };

    if (editingInventory) {
      updateInventoryMutation.mutate({ inventoryId: editingInventory._id, ...payload });
      return;
    }

    createInventoryMutation.mutate(payload);
  };

  const startInventoryEdit = (item) => {
    setEditingInventory(item);
    setIsInventoryDrawerOpen(true);
  };

  const handleOpenAddInventory = () => {
    setEditingInventory(null);
    setIsInventoryDrawerOpen(true);
  };

  return (
    <div className="pos-page-container space-y-4">
      {/* Tab Content Panes */}
      <div className="pt-1">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Payments" && <PaymentsOverview />}
        {activeTab === "Tax" && <TaxManager />}
        {activeTab === "Printers" && <PrinterManager />}
        {activeTab === "Build Your Own" && <BuildYourOwnManager />}
        {activeTab === "Staff" && <StaffManagement />}
        {activeTab === "Music" && <MusicPlayer variant="manager" />}
        {activeTab === "Assets" && assetRoles.includes(String(role || "").toLowerCase()) && <AssetManagement role={role} />}

        {/* Hub / Summary Views for Parent Navigation Items */}
        {summaryTabs.includes(activeTab) && (
          <SectionSummaryView
            tabKey={activeTab}
            onOpenModal={handleOpenModal}
            dishes={dishes}
            categories={categories}
            inventoryItems={inventoryItems}
            lowStockCount={inventoryItems.filter((i) => (i.quantity || 0) <= (i.reorderLevel || 0)).length}
            orders={orders}
          />
        )}

        {/* Dedicated Food Categories Management View */}
        {activeTab === "Categories" && (
          <div className="w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                      Food Categories Management
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {categories.length} Categories
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Drag to reorder how categories display to cashiers and online customers.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenModal("category")}
                  className="pos-btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <MdCategory size={15} />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="max-w-md">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
                  <FaSearch className="text-slate-400 text-xs shrink-0" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories by name…"
                    className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400 font-medium"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch("")}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {categorySearch.trim() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-3 gap-2.5 hover:border-amber-500/40 transition"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                            <FoodIcon icon={category.icon || category.name} size={24} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{category.name}</p>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {categoryDishCounts[category._id] || 0} dishes
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] truncate mt-0.5">{category.description || "No description"}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenModal("category", category)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs col-span-full py-4 text-center">No categories match "{categorySearch}".</p>
                  )}
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="categories">
                    {(provided) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" ref={provided.innerRef} {...provided.droppableProps}>
                        {categories.length > 0 ? (
                          categories.map((category, index) => (
                            <Draggable key={category._id} draggableId={category._id} index={index}>
                              {(providedDraggable) => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-3 gap-2.5 hover:border-amber-500/50 transition cursor-grab active:cursor-grabbing"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                                      <FoodIcon icon={category.icon || category.name} size={24} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{category.name}</p>
                                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                          {categoryDishCounts[category._id] || 0} dishes
                                        </span>
                                      </div>
                                      <p className="text-slate-400 text-[11px] truncate mt-0.5">{category.description || "No description"}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleOpenModal("category", category)}
                                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(category)}
                                      className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="text-slate-400 text-xs col-span-full py-4 text-center">No categories available.</p>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Dishes & Product Catalog View */}
        {activeTab === "Menu" && (
          <div className="w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                      Dishes & Product Catalog
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {dishes.length} Dishes
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Configure dish recipes, portion sizes, prices, and automated inventory ingredient links.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenModal("dishes")}
                  className="pos-btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <BiSolidDish size={16} />
                  <span>Add Dish</span>
                </button>
              </div>

              {/* Filters & Search Row */}
              <div className="space-y-3">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
                    <FaSearch className="text-slate-400 text-xs shrink-0" />
                    <input
                      type="text"
                      value={dishSearch}
                      onChange={(e) => setDishSearch(e.target.value)}
                      placeholder="Search dishes by name or category…"
                      className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400 font-medium"
                    />
                    {dishSearch && (
                      <button
                        onClick={() => setDishSearch("")}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills (Only categories with dishes) */}
                {categories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSelectedDishCategory("all")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        selectedDishCategory === "all"
                          ? "bg-amber-500 text-slate-950 font-bold shadow-2xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-slate-700/60"
                      }`}
                    >
                      All Dishes ({dishes.length})
                    </button>
                    {categories
                      .filter((cat) => (categoryDishCounts[cat._id] || 0) > 0)
                      .map((cat) => {
                        const isSel = selectedDishCategory === cat._id || selectedDishCategory === cat.name;
                        const count = categoryDishCounts[cat._id] || 0;
                        return (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => setSelectedDishCategory(isSel ? "all" : cat._id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                              isSel
                                ? "bg-amber-500 text-slate-950 font-bold shadow-2xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-slate-700/60"
                            }`}
                          >
                            <span>{cat.icon || "🍽️"}</span>
                            <span>{cat.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSel ? "bg-slate-950/20 text-slate-950" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Dishes Cards: Spacious 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <div
                      key={dish._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5 sm:p-4 gap-3 hover:border-amber-500/50 hover:shadow-xs transition"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Food Image / Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0 border border-amber-500/20 shadow-2xs">
                          {dish.image ? (
                            <img
                              src={isUploadedImage(dish.image) ? resolveImageUrl(dish.image) : dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <FoodIcon icon={dish.icon || dish.name} size={30} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                              {dish.name}
                            </p>
                            {dish.isInventoryTracked && (
                              <span className="shrink-0 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                ⚡ Stock Tracked
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {dish.category?.name || "Uncategorized"}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                              Rs {dish.price?.toLocaleString()}
                            </span>
                            {dish.originalPrice > dish.price && (
                              <span className="line-through text-slate-400 text-xs">
                                Rs {dish.originalPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Variants count if present */}
                          {dish.variants?.length > 0 && (
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              {dish.variants.length} Sizes/Crusts configured
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenModal("dishes", dish)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs col-span-full py-8 text-center font-medium">
                    No dishes match the selected category or search filter.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      {activeTab === "Deals" && (
        <div className="w-full pb-8">
          <DealsManager />
        </div>
      )}

      {activeTab === "Hero Slider" && (
        <div className="w-full pb-8">
          <HeroSliderManager />
        </div>
      )}

      {activeTab === "Profit" && (
        <div className="pb-10">
          <ProfitExpenses />
        </div>
      )}

      {activeTab === "Inventory" && (
        <div className="w-full pb-8 space-y-4">
          {/* Metronic-Grade Store Inventory Analytical Dashboard */}
          <InventoryAnalytics
            inventoryItems={inventoryItems}
            onFilterCategory={(cat) => setInventorySearch(cat === "Uncategorized" ? "" : cat)}
          />

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700/80 flex-1 max-w-sm">
                <FaSearch className="text-slate-400 text-xs shrink-0" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search inventory items, categories…"
                  className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
                />
              </div>

              <select
                value={inventoryStatusFilter}
                onChange={(e) => setInventoryStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setWastageSelectedItem(null);
                  setIsWastageModalOpen(true);
                }}
                className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-2xs"
              >
                <MdDeleteSweep className="text-sm" />
                <span>Log Spoilage</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddInventory}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <FaPlus className="text-[10px]" />
                <span>Add Item</span>
              </button>
            </div>
          </div>


          {/* Metronic Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Item Name</th>
                    <th className="py-3 px-3.5">Stock Level</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Unit Price</th>
                    <th className="py-3 px-3.5">Quick Adjust</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {filteredInventoryItems.length > 0 ? (
                    filteredInventoryItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3.5 font-medium">
                          <p className="text-slate-900 dark:text-white font-bold text-xs">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">{item.category?.name || "Uncategorized"}</p>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span>{" "}
                          <span className="text-slate-400 text-[11px]">{item.unit}</span>
                          <span className="text-slate-400 text-[10px] block">Min: {item.reorderLevel}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.stockStatus === "low_stock"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                                : item.stockStatus === "out_of_stock"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                            }`}
                          >
                            {item.stockStatus === "low_stock"
                              ? "Low stock"
                              : item.stockStatus === "out_of_stock"
                              ? "Out of stock"
                              : "Available"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          <p className="text-slate-900 dark:text-white font-semibold text-xs">Rs {item.sellingPrice || item.costPrice || 0}</p>
                          {item.costPrice > 0 && <p className="text-slate-400 text-[10px]">Cost: Rs {item.costPrice}</p>}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={restockAmounts[item._id] ?? ""}
                              onChange={(e) => setRestockAmounts({ ...restockAmounts, [item._id]: e.target.value })}
                              placeholder={`+${item.unit}`}
                              className="w-16 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-md px-1.5 py-1 outline-none border border-slate-200 dark:border-slate-700"
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
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 rounded-md text-xs font-bold"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: 1, note: "Manual stock increment" })}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-1.5 py-1 rounded-md text-xs font-bold"
                              title="+1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: -1, note: "Manual stock decrement" })}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-1.5 py-1 rounded-md text-xs font-bold"
                              title="-1"
                            >
                              -1
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setWastageSelectedItem(item);
                                setIsWastageModalOpen(true);
                              }}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 px-2 py-1 rounded-md text-xs font-semibold"
                              title="Log spoilage/wastage on this item"
                            >
                              Spoilage
                            </button>
                            <button
                              onClick={() => startInventoryEdit(item)}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete inventory item "${item.name}"?`)) {
                                  deleteInventoryMutation.mutate(item._id);
                                }
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-1 rounded-md text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                        {inventorySearch.trim() ? `No inventory items match "${inventorySearch}".` : "No inventory items found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Inventory Side Drawer Overlay for Add / Edit */}
          <InventoryDrawer
            isOpen={isInventoryDrawerOpen}
            onClose={() => setIsInventoryDrawerOpen(false)}
            initialData={editingInventory}
            onSubmit={handleDrawerSubmit}
            isSubmitting={createInventoryMutation.isPending || updateInventoryMutation.isPending}
            existingCategories={existingInventoryCategories}
          />

          {/* Kitchen Spoilage & Wastage Log Modal */}
          <WastageModal
            isOpen={isWastageModalOpen}
            onClose={() => setIsWastageModalOpen(false)}
            items={inventoryItems}
            preselectedItem={wastageSelectedItem}
          />
        </div>
      )}

      </div>

      {isModalOpen && (
        <Modal action={modalAction} setIsModalOpen={setIsModalOpen} initialData={modalInitialData} />
      )}
    </div>
  );
};

export default Dashboard;
