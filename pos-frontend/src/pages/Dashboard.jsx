import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { enqueueSnackbar } from "notistack";
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
import FoodPosterGenerator from "../components/dashboard/FoodPosterGenerator";
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

const tabs = ["Metrics", "Orders", "Payments", "Menu", "Deals", "Coupons", "Hero Slider", "Profit", "Inventory", "Staff", "Build Your Own", "Tax", "Poster Maker"];

const Dashboard = () => {
  const queryClient = useQueryClient();

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
  const [activeTab, setActiveTab] = useState(tabs.includes(requestedTab) ? requestedTab : "Metrics");
  useEffect(() => {
    if (tabs.includes(requestedTab)) setActiveTab(requestedTab);
  }, [requestedTab]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [categorySearch, setCategorySearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
    placeholderData: keepPreviousData,
    refetchInterval: 15000, // stock changes with every order
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
    <div className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-10">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4 flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                className={`
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && <PaymentsOverview />}
      {activeTab === "Tax" && <TaxManager />}
      {activeTab === "Build Your Own" && <BuildYourOwnManager />}
      {activeTab === "Staff" && <StaffManagement />}
      {activeTab === "Poster Maker" && <FoodPosterGenerator />}
      {activeTab === "Menu" && (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">Categories</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="🔍 Search categories…"
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
                              <span className="text-xl">{category.icon || "🍽️"}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#f5f5f5] font-medium truncate">{category.name}</p>
                            <p className="text-[#ababab] text-sm truncate">{category.description || "No description"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenModal("category", category)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
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
                          <Draggable key={category._id} draggableId={category._id} index={index}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-2">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(category.icon) ? (
                                      <img src={resolveImageUrl(category.icon)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xl">{category.icon || "🍽️"}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#f5f5f5] font-medium truncate">{category.name}</p>
                                    <p className="text-[#ababab] text-sm truncate">{category.description || "No description"}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenModal("category", category)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Delete
                                  </button>
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
                  placeholder="🔍 Search dishes…"
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
                              <img src={resolveImageUrl(dish.image)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">{dish.icon || "🍽️"}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#f5f5f5] font-medium truncate">{dish.name}</p>
                            <p className="text-[#ababab] text-sm truncate">
                              {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                              {dish.isInventoryTracked && (
                                <span className="ml-2 text-green-400">🔗 Inventory linked</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenModal("dishes", dish)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
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
                          <Draggable key={dish._id} draggableId={dish._id} index={index}>
                            {(providedDraggable) => (
                              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-3 gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                    {isUploadedImage(dish.image) ? (
                                      <img src={resolveImageUrl(dish.image)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xl">{dish.icon || "🍽️"}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#f5f5f5] font-medium truncate">{dish.name}</p>
                                    <p className="text-[#ababab] text-sm truncate">
                                      {dish.category?.name || "Uncategorized"} • Rs {dish.price}
                                      {dish.isInventoryTracked && (
                                        <span className="ml-2 text-green-400">🔗 Inventory linked</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenModal("dishes", dish)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDish(dish)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                                  >
                                    Delete
                                  </button>
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

      {activeTab === "Coupons" && <CouponsManager />}

      {activeTab === "Deals" && (
        <div className="container mx-auto px-6 pb-10">
          <DealsManager />
        </div>
      )}

      {activeTab === "Hero Slider" && (
        <div className="container mx-auto px-6 pb-10">
          <HeroSliderManager />
        </div>
      )}

      {activeTab === "Profit" && (
        <div className="pb-10">
          <ProfitExpenses />
        </div>
      )}

      {activeTab === "Inventory" && (
        <div className="container mx-auto px-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="bg-[#262626] rounded-lg p-5">
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
            </div>

            <div className="bg-[#262626] rounded-lg p-5">
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">Stock Overview</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="🔍 Search inventory…"
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

                      <div className="mt-3 flex flex-wrap items-center gap-2">
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
                        <button
                          onClick={() => startInventoryEdit(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete inventory item "${item.name}"?`)) {
                              deleteInventoryMutation.mutate(item._id);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
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

      {isModalOpen && (
        <Modal action={modalAction} setIsModalOpen={setIsModalOpen} initialData={modalInitialData} />
      )}
    </div>
  );
};

export default Dashboard;
