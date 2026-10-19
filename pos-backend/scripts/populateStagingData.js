require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const config = require("../config/config");

const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
const Deal = require("../models/dealModel");
const InventoryItem = require("../models/inventoryItemModel");
const Staff = require("../models/staffModel");

const DB_URI = (config.databaseURI || "mongodb://127.0.0.1:27017/pos-db")
  .replace("mongodb://localhost:27017", "mongodb://127.0.0.1:27017");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function run() {
  console.log("🚀 Connecting to MongoDB at:", DB_URI);
  await mongoose.connect(DB_URI);
  console.log("✅ MongoDB Connected successfully.\n");

  // 1. Ensure Categories exist with vibrant icons
  const CATEGORY_DEFINITIONS = [
    { name: "Pizzas", icon: "🍕", order: 1 },
    { name: "Pizza", icon: "🍕", order: 2 },
    { name: "Burgers & Sandwiches", icon: "🍔", order: 3 },
    { name: "Burgers & Shami", icon: "🍔", order: 4 },
    { name: "Shawarmas & Wraps", icon: "🌯", order: 5 },
    { name: "Shawarma", icon: "🌯", order: 6 },
    { name: "Starters & Sides", icon: "🍟", order: 7 },
    { name: "Beverages", icon: "🥤", order: 8 },
    { name: "Desserts", icon: "🍰", order: 9 },
    // Raw material / ingredient categories for inventory
    { name: "Sauces & Condiments", icon: "🥣", order: 10 },
    { name: "Breads & Dough", icon: "🍞", order: 11 },
    { name: "Dairy & Cheese", icon: "🧀", order: 12 },
    { name: "Meats & Proteins", icon: "🥩", order: 13 },
    { name: "Vegetables & Produce", icon: "🥗", order: 14 },
    { name: "Packaging & Supplies", icon: "📦", order: 15 },
  ];

  const categoryMap = new Map();
  for (const catDef of CATEGORY_DEFINITIONS) {
    let cat = await Category.findOne({
      name: { $regex: `^${escapeRegex(catDef.name)}$`, $options: "i" },
    });
    if (!cat) {
      cat = await Category.create(catDef);
      console.log(`  + Created Category: ${cat.name} (${cat.icon})`);
    } else {
      if (catDef.icon && (!cat.icon || cat.icon === "🍽️")) {
        cat.icon = catDef.icon;
        await cat.save();
      }
    }
    categoryMap.set(cat.name.toLowerCase(), cat._id);
  }

  // 2. Categorize all Inventory Items + Assign Cost & Selling Prices
  console.log("\n📦 Categorizing Inventory Items & Setting Valuations...");

  const INVENTORY_MAPPINGS = [
    {
      name: "Maida (Pizza Dough Flour)",
      category: "Breads & Dough",
      costPrice: 0.18,
      sellingPrice: 0.28,
      reorderLevel: 2000,
    },
    {
      name: "Chicken (Cooked/Shredded)",
      category: "Meats & Proteins",
      costPrice: 0.95,
      sellingPrice: 1.35,
      reorderLevel: 2000,
    },
    {
      name: "Cheese",
      category: "Dairy & Cheese",
      costPrice: 1.40,
      sellingPrice: 1.95,
      reorderLevel: 1000,
    },
    {
      name: "Mayonnaise",
      category: "Sauces & Condiments",
      costPrice: 0.55,
      sellingPrice: 0.85,
      reorderLevel: 500,
    },
    {
      name: "Pizza Sauce",
      category: "Sauces & Condiments",
      costPrice: 0.65,
      sellingPrice: 0.95,
      reorderLevel: 500,
    },
    {
      name: "Burger/Shami Bun",
      category: "Breads & Dough",
      costPrice: 30,
      sellingPrice: 45,
      reorderLevel: 20,
    },
    {
      name: "Egg",
      category: "Dairy & Cheese",
      costPrice: 22,
      sellingPrice: 30,
      reorderLevel: 30,
    },
    {
      name: "Shami Kabab Patty",
      category: "Meats & Proteins",
      costPrice: 0.70,
      sellingPrice: 1.10,
      reorderLevel: 1000,
    },
    {
      name: "Ketchup/Chilli Sauce (Burger)",
      category: "Sauces & Condiments",
      costPrice: 0.45,
      sellingPrice: 0.70,
      reorderLevel: 300,
    },
    {
      name: "Salad",
      category: "Vegetables & Produce",
      costPrice: 0.25,
      sellingPrice: 0.40,
      reorderLevel: 500,
    },
    {
      name: "Small Shawarma Bread",
      category: "Breads & Dough",
      costPrice: 22,
      sellingPrice: 35,
      reorderLevel: 20,
    },
    {
      name: "Large Shawarma Bread",
      category: "Breads & Dough",
      costPrice: 32,
      sellingPrice: 50,
      reorderLevel: 20,
    },
    {
      name: "Shawarma Garlic Sauce",
      category: "Sauces & Condiments",
      costPrice: 0.75,
      sellingPrice: 1.15,
      reorderLevel: 300,
    },
    {
      name: "Shawarma Chilli Sauce",
      category: "Sauces & Condiments",
      costPrice: 0.70,
      sellingPrice: 1.10,
      reorderLevel: 300,
    },
    // Supplementary items for comprehensive stock
    {
      name: "French Fries (Frozen Potato)",
      category: "Vegetables & Produce",
      unit: "g",
      quantity: 12000,
      reorderLevel: 2500,
      costPrice: 0.35,
      sellingPrice: 0.55,
    },
    {
      name: "Black Olives & Jalapeños",
      category: "Vegetables & Produce",
      unit: "g",
      quantity: 4500,
      reorderLevel: 1000,
      costPrice: 1.10,
      sellingPrice: 1.60,
    },
    {
      name: "Pizza Takeaway Boxes",
      category: "Packaging & Supplies",
      unit: "pcs",
      quantity: 350,
      reorderLevel: 50,
      costPrice: 35,
      sellingPrice: 50,
    },
    {
      name: "Cold Drink 1.5L Bottles",
      category: "Beverages",
      unit: "bottle",
      quantity: 45,
      reorderLevel: 10,
      costPrice: 160,
      sellingPrice: 220,
    },
    {
      name: "Mineral Water 500ml",
      category: "Beverages",
      unit: "bottle",
      quantity: 60,
      reorderLevel: 15,
      costPrice: 30,
      sellingPrice: 50,
    },
  ];

  for (const inv of INVENTORY_MAPPINGS) {
    const catId = categoryMap.get(inv.category.toLowerCase());
    const existing = await InventoryItem.findOne({
      name: { $regex: `^${escapeRegex(inv.name)}$`, $options: "i" },
    });

    if (existing) {
      existing.category = catId || existing.category;
      if (inv.costPrice) existing.costPrice = inv.costPrice;
      if (inv.sellingPrice) existing.sellingPrice = inv.sellingPrice;
      if (inv.reorderLevel) existing.reorderLevel = inv.reorderLevel;
      await existing.save();
      console.log(`  ✓ Updated inventory: ${inv.name} -> [${inv.category}] (Cost: Rs ${inv.costPrice})`);
    } else {
      await InventoryItem.create({
        name: inv.name,
        category: catId,
        unit: inv.unit || "g",
        quantity: inv.quantity || 5000,
        reorderLevel: inv.reorderLevel || 1000,
        costPrice: inv.costPrice || 0,
        sellingPrice: inv.sellingPrice || 0,
        isTrackable: true,
        notes: "Staging seed item",
      });
      console.log(`  + Created inventory: ${inv.name} -> [${inv.category}]`);
    }
  }

  // 3. Update Existing Dishes with Preferred Food Images & Add Staging Dishes
  console.log("\n🍕 Updating Dishes with Preferred High-Quality Food Images...");

  const DISHES_DATA = [
    {
      name: "Small Pizza",
      category: "Pizza",
      price: 490,
      originalPrice: 590,
      description: "Crispy personal crust topped with spiced chicken, rich marinara sauce, and gooey mozzarella.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
    },
    {
      name: "Medium Pizza",
      category: "Pizza",
      price: 1050,
      originalPrice: 1200,
      description: "Generous 10-inch pizza with double mozzarella, juicy chicken chunks, mushrooms, and herbs.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
    },
    {
      name: "Large Pizza",
      category: "Pizza",
      price: 1450,
      originalPrice: 1650,
      description: "Hearty 13-inch family pizza loaded with chicken tikka, black olives, sweet peppers, and cheese.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
    },
    {
      name: "Extra Large Pizza",
      category: "Pizza",
      price: 1850,
      originalPrice: 2100,
      description: "Huge 16-inch party pizza with premium toppings, stuffed cheese crust option, and dipping sauce.",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
    },
    {
      name: "GenZ Supreme Pizza",
      category: "Pizzas",
      price: 1550,
      originalPrice: 1750,
      description: "Chef's signature: smoked chicken, pepperoni, mushrooms, black olives, bell peppers, melted mozzarella.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
      variants: [
        { size: "Small (8\")", crust: "Pan Crust", price: 650, originalPrice: 750 },
        { size: "Medium (10\")", crust: "Pan Crust", price: 1150, originalPrice: 1300 },
        { size: "Large (13\")", crust: "Pan Crust", price: 1550, originalPrice: 1750 },
        { size: "Large (13\")", crust: "Cheese Stuffed", price: 1850, originalPrice: 2000 },
      ],
    },
    {
      name: "Chicken Fajita Pizza",
      category: "Pizzas",
      price: 1350,
      originalPrice: 1500,
      description: "Spicy Mexican fajita chicken chunks, caramelized onions, green capsicum, special spicy sauce.",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
      variants: [
        { size: "Small (8\")", crust: "Pan Crust", price: 590, originalPrice: 700 },
        { size: "Medium (10\")", crust: "Pan Crust", price: 1050, originalPrice: 1200 },
        { size: "Large (13\")", crust: "Pan Crust", price: 1450, originalPrice: 1650 },
      ],
    },
    {
      name: "Burger",
      category: "Burgers & Shami",
      price: 380,
      originalPrice: 450,
      description: "Classic grilled chicken burger with crisp iceberg lettuce, burger sauce, and melted cheddar.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      icon: "burger",
    },
    {
      name: "Crispy Zinger Crunch Burger",
      category: "Burgers & Sandwiches",
      price: 550,
      originalPrice: 650,
      description: "Crispy fried whole chicken breast, spicy mayo, iceberg lettuce in toasted brioche bun.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      icon: "burger",
    },
    {
      name: "Smash Beef Bacon Burger",
      category: "Burgers & Sandwiches",
      price: 750,
      originalPrice: 850,
      description: "Double smashed prime beef patties, melted cheddar, beef bacon jam, secret house sauce.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
      icon: "burger",
    },
    {
      name: "Shami Bread",
      category: "Burgers & Shami",
      price: 250,
      originalPrice: 300,
      description: "Traditional slow-cooked lentil-beef shami kabab patty served in warm grilled burger bun.",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
      icon: "burger",
    },
    {
      name: "Double Anda",
      category: "Burgers & Shami",
      price: 280,
      originalPrice: 320,
      description: "Double fried egg bun burger with black pepper, roasted onion relish, and tangy house spread.",
      image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80",
      icon: "burger",
    },
    {
      name: "Small Shawarma",
      category: "Shawarma",
      price: 220,
      originalPrice: 260,
      description: "Classic pita wrap with shredded roasted chicken, pickled cucumber, and garlic toum.",
      image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood",
    },
    {
      name: "Arabic Chicken Shawarma Roll",
      category: "Shawarmas & Wraps",
      price: 380,
      originalPrice: 450,
      description: "Charcoal-grilled shredded chicken, authentic Lebanese garlic toum, pickled cucumber in flatbread.",
      image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood",
    },
    {
      name: "Loaded Cheesy Pizza Fries",
      category: "Starters & Sides",
      price: 480,
      originalPrice: 550,
      description: "Crispy golden french fries topped with pizza sauce, melted mozzarella, jalapeños, pepperoni.",
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood",
    },
    {
      name: "Buffalo Hot Wings (6 Pcs)",
      category: "Starters & Sides",
      price: 520,
      originalPrice: 600,
      description: "Crispy tossed chicken wings glazed in spicy tangy buffalo sauce, served with ranch dip.",
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
      icon: "bbq",
    },
    {
      name: "Garlic Parmesan Bread Sticks",
      category: "Starters & Sides",
      price: 320,
      originalPrice: 380,
      description: "Warm baked bread sticks brushed with roasted garlic herb butter and grated parmesan.",
      image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&auto=format&fit=crop&q=80",
      icon: "bakery",
    },
    {
      name: "Fresh Mint Margarita",
      category: "Beverages",
      price: 280,
      originalPrice: 320,
      description: "Chilled fresh crushed mint, lemon juice, ice, and sparkling soda.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
      icon: "drinks",
    },
    {
      name: "Chilled Coca-Cola 1.5L",
      category: "Beverages",
      price: 220,
      originalPrice: 240,
      description: "Family size ice-cold 1.5 Litre bottle.",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      icon: "drinks",
    },
    {
      name: "Molten Lava Chocolate Cake",
      category: "Desserts",
      price: 490,
      originalPrice: 550,
      description: "Warm Belgian chocolate cake with gooey molten center, served with vanilla scoop.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
      icon: "dessert",
    },
  ];

  for (const d of DISHES_DATA) {
    const catId = categoryMap.get(d.category.toLowerCase());
    const existing = await Dish.findOne({
      name: { $regex: `^${escapeRegex(d.name)}$`, $options: "i" },
    });

    if (existing) {
      existing.image = d.image;
      existing.price = d.price;
      existing.originalPrice = d.originalPrice || existing.originalPrice;
      existing.description = d.description || existing.description;
      if (catId) existing.category = catId;
      if (d.variants && d.variants.length > 0) existing.variants = d.variants;
      if (d.icon) existing.icon = d.icon;
      await existing.save();
      console.log(`  ✓ Updated Dish with image: ${d.name}`);
    } else {
      await Dish.create({
        name: d.name,
        category: catId,
        price: d.price,
        originalPrice: d.originalPrice,
        description: d.description,
        image: d.image,
        icon: d.icon || "pizza",
        variants: d.variants || [],
      });
      console.log(`  + Created Dish with image: ${d.name}`);
    }
  }

  // 4. Seed Tables (Table 01 to 12)
  console.log("\n🪑 Seeding Tables...");
  const tableDocs = [];
  for (let i = 1; i <= 12; i++) {
    let t = await Table.findOne({ tableNo: i });
    if (!t) {
      t = await Table.create({
        tableNo: i,
        seats: i <= 4 ? 2 : i <= 8 ? 4 : i <= 10 ? 6 : 8,
        status: i === 3 || i === 7 ? "Booked" : "Available",
      });
      console.log(`  + Created Table ${i}`);
    }
    tableDocs.push(t);
  }

  // 5. Seed Deals
  console.log("\n🎁 Seeding Combo Deals...");
  const DEALS_DATA = [
    {
      name: "GenZ Duo Feast",
      badge: "BESTSELLER",
      price: 1850,
      originalPrice: 2200,
      description: "1 Medium Pizza + 2 Zinger Burgers + 1.5L Coke",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      items: [
        { label: "1 Medium Pizza", quantity: 1 },
        { label: "2 Zinger Burgers", quantity: 2 },
        { label: "1.5L Soft Drink", quantity: 1 },
      ],
    },
    {
      name: "Family Mega Feast",
      badge: "FAMILY PACK",
      price: 3450,
      originalPrice: 3990,
      description: "2 Large Pizzas + 6 Buffalo Wings + Garlic Bread + 1.5L Drink",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
      items: [
        { label: "2 Large Pizzas", quantity: 2 },
        { label: "6 Buffalo Wings", quantity: 1 },
        { label: "Garlic Bread", quantity: 1 },
        { label: "1.5L Drink", quantity: 1 },
      ],
    },
  ];

  for (const deal of DEALS_DATA) {
    const existing = await Deal.findOne({ name: deal.name });
    if (!existing) {
      await Deal.create(deal);
      console.log(`  + Created Deal: ${deal.name}`);
    }
  }

  // 6. Seed Active & Past Orders for Staging
  console.log("\n🧾 Seeding Staging Orders...");
  const sampleOrders = [
    {
      customerDetails: { name: "Ahmad Bilal", phone: "03001234567", guests: 3 },
      orderStatus: "In Progress",
      orderSource: "POS",
      orderNumber: "20261019001",
      table: tableDocs[2]?._id, // Table 3
      bills: { total: 2450, tax: 392, totalWithTax: 2842 },
      items: [
        { name: "GenZ Supreme Pizza", price: 1550, quantity: 1 },
        { name: "Buffalo Hot Wings (6 Pcs)", price: 520, quantity: 1 },
        { name: "Chilled Coca-Cola 1.5L", price: 220, quantity: 1 },
      ],
      paymentMethod: "Cash",
      orderDate: new Date(),
    },
    {
      customerDetails: { name: "Zainab Tariq", phone: "03219876543", guests: 2 },
      orderStatus: "Ready",
      orderSource: "POS",
      orderNumber: "20261019002",
      table: tableDocs[6]?._id, // Table 7
      bills: { total: 1850, tax: 296, totalWithTax: 2146 },
      items: [
        { name: "Chicken Fajita Pizza", price: 1050, quantity: 1 },
        { name: "Loaded Cheesy Pizza Fries", price: 480, quantity: 1 },
        { name: "Fresh Mint Margarita", price: 280, quantity: 1 },
      ],
      paymentMethod: "Card",
      orderDate: new Date(),
    },
    {
      customerDetails: { name: "Hamza Sheikh", phone: "03124567890", guests: 1, address: "Phase 6 DHA, Lahore" },
      orderStatus: "Ready to Deliver",
      orderSource: "Online",
      orderNumber: "20261019003",
      bills: { total: 1520, tax: 243, totalWithTax: 1763 },
      items: [
        { name: "Crispy Zinger Crunch Burger", price: 550, quantity: 2 },
        { name: "Arabic Chicken Shawarma Roll", price: 380, quantity: 1 },
      ],
      paymentMethod: "Online",
      orderDate: new Date(),
    },
  ];

  // Past closed orders so Metrics & Reports have rich numbers
  for (let i = 1; i <= 6; i++) {
    sampleOrders.push({
      customerDetails: { name: `Guest Customer #${100 + i}`, phone: `0300999000${i}`, guests: 2 },
      orderStatus: "Closed",
      orderSource: i % 2 === 0 ? "POS" : "Online",
      orderNumber: `202610190${10 + i}`,
      bills: { total: 2100 + i * 300, tax: 336 + i * 48, totalWithTax: 2436 + i * 348 },
      items: [
        { name: "GenZ Supreme Pizza", price: 1550, quantity: 1 },
        { name: "Fresh Mint Margarita", price: 280, quantity: 2 },
      ],
      paymentMethod: i % 2 === 0 ? "Cash" : "Card",
      orderDate: new Date(Date.now() - i * 3600 * 1000),
    });
  }

  for (const o of sampleOrders) {
    const existing = await Order.findOne({ orderNumber: o.orderNumber });
    if (!existing) {
      await Order.create(o);
      console.log(`  + Created Order: #${o.orderNumber} (${o.customerDetails.name}) - [${o.orderStatus}]`);
    }
  }

  // 7. Seed Staff Members
  console.log("\n👨‍🍳 Seeding Staff Members...");
  const STAFF_MEMBERS = [
    { name: "Shahzaib Naseem", designation: "Store Manager", phone: "03001234567", baseSalary: 75000, joinDate: "2024-01-15" },
    { name: "Kashif Ali", designation: "Head Pizza Chef", phone: "03111234567", baseSalary: 55000, joinDate: "2024-03-01" },
    { name: "Bilal Raza", designation: "Front Cashier", phone: "03221234567", baseSalary: 35000, joinDate: "2024-06-10" },
    { name: "Zubair Ahmad", designation: "Dispatch Rider", phone: "03331234567", baseSalary: 30000, joinDate: "2024-08-01" },
  ];

  for (const s of STAFF_MEMBERS) {
    const existing = await Staff.findOne({ name: s.name });
    if (!existing) {
      await Staff.create(s);
      console.log(`  + Created Staff: ${s.name} (${s.designation})`);
    }
  }

  console.log("\n✨ Staging data population completed successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Staging seed error:", err);
  process.exit(1);
});
