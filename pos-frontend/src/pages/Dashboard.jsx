import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdTableBar, MdCategory } from "react-icons/md";
import FoodIcon from "../utils/foodIcons";
import { BiSolidDish } from "react-icons/bi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { enqueueSnackbar } from "notistack";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import DealsManager from "../components/dashboard/DealsManager";
import CouponsManager from "../components/dashboard/CouponsManager";
import HeroSliderManager from "../components/dashboard/HeroSliderManager";
import ProfitExpenses from "../components/dashboard/ProfitExpenses";
import PaymentsOverview from "../components/dashboard/PaymentsOverview";
import TaxManager from "../components/dashboard/TaxManager";
import BuildYourOwnManager from "../components/dashboard/BuildYourOwnManager";
import StaffManagement from "../components/dashboard/StaffManagement";
import AssetManagement from "../components/dashboard/AssetManagement";
import MusicPlayer from "../components/shared/MusicPlayer";
import {
  getCategories,
  getDishes,
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

const tabs = ["Metrics", "Orders", "Payments", "Menu", "Deals", "Coupons", "Hero Slider", "Profit", "Inventory", "Staff", "Build Your Own", "Tax", "Music", "Assets"];
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
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(visibleTabs.includes(requestedTab) ? requestedTab : (isAdmin ? "Metrics" : "Assets"));
  useEffect(() => {
    setActiveTab(visibleTabs.includes(requestedTab) ? requestedTab : (isAdmin ? "Metrics" : "Assets"));
  }, [requestedTab, isAdmin]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };
  const [restockAmounts, setRestockAmounts] = useState({});
  const [categorySearch, setCategorySearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");

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

  return (
    <div className="pos-page-container space-y-4">
      {/* Contextual Action Bar when managing catalog dishes & tables */}
      {isAdmin && activeTab === "Menu" && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Menu & Catalog Engineering
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure dishes, categories, pricing, and floor tables
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {buttons.map(({ label, icon, action }) => (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="pos-btn-secondary py-1.5 text-xs font-semibold"
              >
                <span className="text-amber-500">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content Panes */}
      <div className="pt-1">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Payments" && <PaymentsOverview />}
        {activeTab === "Tax" && <TaxManager />}
      {activeTab === "Build Your Own" && <BuildYourOwnManager />}
      {activeTab === "Staff" && <StaffManagement />}
      {activeTab === "Music" && <MusicPlayer variant="manager" />}
      {activeTab === "Assets" && assetRoles.includes(String(role || "").toLowerCase()) && <AssetManagement role={role} />}
      {activeTab === "Menu" && (
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <h3 className="text-slate-900 dark:text-white text-base font-black mb-3">Categories</h3>
              <div className="mb-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
                  <FaSearch className="text-slate-400 text-xs shrink-0" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories…"
                    className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>
              {categorySearch.trim() ? (
                <div className="space-y-2">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-2.5 gap-2"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                            {isUploadedImage(category.icon) ? (
                              <img src={resolveImageUrl(category.icon)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FoodIcon icon={category.icon || category._id} className="text-xl text-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{category.name}</p>
                            <p className="text-slate-400 text-[11px] truncate">{category.description || "No description"}</p>
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
                    <p className="text-slate-400 text-xs">No categories match "{categorySearch}".</p>
                  )}
                </div>
              ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div className="space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <Draggable key={category._id} draggableId={category._id} index={index}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-2.5 gap-2">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(category.icon) ? (
                                      <img src={resolveImageUrl(category.icon)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <FoodIcon icon={category.icon || category._id} className="text-xl text-amber-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{category.name}</p>
                                    <p className="text-slate-400 text-[11px] truncate">{category.description || "No description"}</p>
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
                        <p className="text-slate-400 text-xs">No categories available.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <h3 className="text-slate-900 dark:text-white text-base font-black mb-3">Dishes</h3>
              <div className="mb-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
                  <FaSearch className="text-slate-400 text-xs shrink-0" />
                  <input
                    type="text"
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    placeholder="Search dishes…"
                    className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>
              {dishSearch.trim() ? (
                <div className="space-y-2">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-2.5 gap-2"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                            {isUploadedImage(dish.image) ? (
                              <img src={resolveImageUrl(dish.image)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FoodIcon icon={dish.icon || dish.name} className="text-xl text-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{dish.name}</p>
                            <p className="text-slate-400 text-[11px] truncate">
                              {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                              {dish.isInventoryTracked && (
                                <span className="ml-1.5 text-emerald-500 font-semibold">🔗 Tracked</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenModal("dishes", dish)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish)}
                            className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs">No dishes match "{dishSearch}".</p>
                  )}
                </div>
              ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dishes">
                  {(provided) => (
                    <div className="space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                      {dishes.length > 0 ? (
                        dishes.map((dish, index) => (
                          <Draggable key={dish._id} draggableId={dish._id} index={index}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-2.5 gap-2">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(dish.image) ? (
                                      <img src={resolveImageUrl(dish.image)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <FoodIcon icon={dish.icon || dish.name} className="text-xl text-amber-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-slate-900 dark:text-white font-bold text-xs truncate">{dish.name}</p>
                                    <p className="text-slate-400 text-[11px] truncate">
                                      {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                                      {dish.isInventoryTracked && (
                                        <span className="ml-1.5 text-emerald-500 font-semibold">🔗 Tracked</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleOpenModal("dishes", dish)}
                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDish(dish)}
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
                        <p className="text-slate-400 text-xs">No dishes available.</p>
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
        <div className="w-full pb-8">
          <DealsManager />
        </div>
      )}

      {activeTab === "Coupons" && (
        <div className="w-full pb-8">
          <CouponsManager />
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
        <div className="w-full pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-3.5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <h3 className="text-slate-900 dark:text-white text-base font-black mb-3">
                {editingInventory ? "Edit Inventory Item" : "Add Inventory Item"}
              </h3>

              <form onSubmit={handleInventorySubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={inventoryForm.name}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Item name"
                  />
                  <input
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Category name"
                  />
                  <input
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, unit: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Unit (pcs/bottle/kg)"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Current quantity"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.reorderLevel}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, reorderLevel: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Reorder level"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.costPrice}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, costPrice: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Cost price"
                  />
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.sellingPrice}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, sellingPrice: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    placeholder="Selling price"
                  />
                </div>

                <textarea
                  rows="2"
                  value={inventoryForm.notes}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, notes: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 w-full"
                  placeholder="Notes (optional)"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xs"
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
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <h3 className="text-slate-900 dark:text-white text-base font-black mb-3">Stock Overview</h3>
              <div className="mb-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
                  <FaSearch className="text-slate-400 text-xs shrink-0" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search inventory…"
                    className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredInventoryItems.length > 0 ? (
                  filteredInventoryItems.map((item) => (
                    <div key={item._id} className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-slate-900 dark:text-white font-bold text-xs">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">
                            {item.category?.name || "Uncategorized"} • {item.quantity} {item.unit}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.stockStatus === "low_stock" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : item.stockStatus === "out_of_stock" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                          {item.stockStatus === "low_stock" ? "Low stock" : item.stockStatus === "out_of_stock" ? "Out of stock" : "In stock"}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          value={restockAmounts[item._id] ?? ""}
                          onChange={(e) => setRestockAmounts({ ...restockAmounts, [item._id]: e.target.value })}
                          placeholder={`Add ${item.unit}`}
                          className="w-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs rounded-lg px-2 py-1 outline-none border border-slate-200 dark:border-slate-700"
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
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: 1, note: "Manual stock increment" })}
                          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => adjustInventoryMutation.mutate({ inventoryId: item._id, quantityChange: -1, note: "Manual stock decrement" })}
                          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => startInventoryEdit(item)}
                          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete inventory item "${item.name}"?`)) {
                              deleteInventoryMutation.mutate(item._id);
                            }
                          }}
                          className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs">
                    {inventorySearch.trim() ? `No inventory items match "${inventorySearch}".` : "No inventory items yet."}
                  </p>
                )}
              </div>
            </div>
          </div>
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
