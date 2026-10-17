require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const config = require("../config/config");

const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
const Deal = require("../models/dealModel");
const InventoryItem = require("../models/inventoryItemModel");
const Expense = require("../models/expenseModel");
const Staff = require("../models/staffModel");

const DB_URI = (config.databaseURI || "mongodb://127.0.0.1:27017/pos-db")
  .replace("mongodb://localhost:27017", "mongodb://127.0.0.1:27017");

async function seed() {
  console.log("🚀 Connecting to MongoDB at:", DB_URI);
  await mongoose.connect(DB_URI);
  console.log("✅ MongoDB Connected successfully.");

  // 1. Seed Categories
  const categoryDefs = [
    { name: "Pizzas" },
    { name: "Burgers & Sandwiches" },
    { name: "Shawarmas & Wraps" },
    { name: "Starters & Sides" },
    { name: "Beverages" },
    { name: "Desserts" }
  ];

  const categories = {};
  for (const def of categoryDefs) {
    let cat = await Category.findOne({ name: def.name });
    if (!cat) {
      cat = await Category.create(def);
      console.log(`  + Category created: ${cat.name}`);
    }
    categories[def.name] = cat._id;
  }

  // 2. Seed Dishes with Real Unsplash Food Images
  const dishesData = [
    {
      name: "GenZ Supreme Pizza",
      price: 1450,
      originalPrice: 1650,
      description: "Smoked chicken, pepperoni, mushrooms, black olives, bell peppers, melted mozzarella.",
      category: categories["Pizzas"],
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
      variants: [
        { size: "Small (8\")", crust: "Pan Crust", price: 650, originalPrice: 750 },
        { size: "Medium (10\")", crust: "Pan Crust", price: 1150, originalPrice: 1300 },
        { size: "Large (13\")", crust: "Pan Crust", price: 1550, originalPrice: 1750 },
        { size: "Large (13\")", crust: "Cheese Stuffed", price: 1850, originalPrice: 2000 }
      ]
    },
    {
      name: "Chicken Fajita Pizza",
      price: 1350,
      originalPrice: 1500,
      description: "Spicy fajita chicken chunks, caramelized onions, green capsicum, special spicy sauce.",
      category: categories["Pizzas"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
      variants: [
        { size: "Small (8\")", crust: "Pan Crust", price: 590, originalPrice: 700 },
        { size: "Medium (10\")", crust: "Pan Crust", price: 1050, originalPrice: 1200 },
        { size: "Large (13\")", crust: "Pan Crust", price: 1450, originalPrice: 1650 }
      ]
    },
    {
      name: "Double Pepperoni Delight",
      price: 1550,
      originalPrice: 1750,
      description: "Generous layers of beef pepperoni, extra gooey mozzarella, Italian herb seasoning.",
      category: categories["Pizzas"],
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
      icon: "pizza",
      variants: [
        { size: "Medium (10\")", crust: "Thin Crust", price: 1200, originalPrice: 1350 },
        { size: "Large (13\")", crust: "Thin Crust", price: 1650, originalPrice: 1850 }
      ]
    },
    {
      name: "Crispy Zinger Crunch Burger",
      price: 550,
      originalPrice: 650,
      description: "Crispy fried whole chicken breast, spicy mayo, iceberg lettuce in toasted brioche bun.",
      category: categories["Burgers & Sandwiches"],
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      icon: "burger"
    },
    {
      name: "Smash Beef Bacon Burger",
      price: 750,
      originalPrice: 850,
      description: "Double smashed prime beef patties, melted cheddar, beef bacon jam, secret house sauce.",
      category: categories["Burgers & Sandwiches"],
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
      icon: "burger"
    },
    {
      name: "Arabic Chicken Shawarma Roll",
      price: 380,
      originalPrice: 450,
      description: "Charcoal-grilled shredded chicken, authentic Lebanese garlic toum, pickled cucumber in flatbread.",
      category: categories["Shawarmas & Wraps"],
      image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood"
    },
    {
      name: "Spicy Mexican Tortilla Wrap",
      price: 450,
      originalPrice: 520,
      description: "Grilled chicken strips, jalapeños, chipotle sauce, melted cheese in toasted flour tortilla.",
      category: categories["Shawarmas & Wraps"],
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood"
    },
    {
      name: "Loaded Cheesy Pizza Fries",
      price: 480,
      originalPrice: 550,
      description: "Crispy golden french fries topped with pizza sauce, melted mozzarella, jalapeños, pepperoni.",
      category: categories["Starters & Sides"],
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
      icon: "fastfood"
    },
    {
      name: "Garlic Parmesan Bread Sticks",
      price: 320,
      originalPrice: 380,
      description: "Warm baked bread sticks brushed with roasted garlic herb butter and grated parmesan.",
      category: categories["Starters & Sides"],
      image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&auto=format&fit=crop&q=80",
      icon: "bakery"
    },
    {
      name: "Buffalo Hot Wings (6 Pcs)",
      price: 520,
      originalPrice: 600,
      description: "Crispy tossed chicken wings glazed in spicy tangy buffalo sauce, served with ranch dip.",
      category: categories["Starters & Sides"],
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
      icon: "bbq"
    },
    {
      name: "Fresh Mint Margarita",
      price: 280,
      originalPrice: 320,
      description: "Chilled fresh crushed mint, lemon juice, ice, and sparkling soda.",
      category: categories["Beverages"],
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
      icon: "drinks"
    },
    {
      name: "Chilled Coca-Cola 1.5L",
      price: 220,
      originalPrice: 240,
      description: "Family size ice-cold 1.5 Litre bottle.",
      category: categories["Beverages"],
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      icon: "drinks"
    },
    {
      name: "Molten Lava Chocolate Cake",
      price: 490,
      originalPrice: 550,
      description: "Warm Belgian chocolate cake with gooey molten center, served with vanilla scoop.",
      category: categories["Desserts"],
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
      icon: "dessert"
    }
  ];

  const seededDishes = [];
  for (const d of dishesData) {
    const existing = await Dish.findOne({ name: d.name });
    if (!existing) {
      const created = await Dish.create(d);
      seededDishes.push(created);
      console.log(`  + Dish created: ${created.name}`);
    } else {
      existing.image = d.image;
      existing.price = d.price;
      existing.originalPrice = d.originalPrice;
      existing.description = d.description;
      existing.variants = d.variants || [];
      await existing.save();
      seededDishes.push(existing);
    }
  }

  // 3. Seed Tables (Table 01 to 12)
  const tables = [];
  for (let i = 1; i <= 12; i++) {
    let t = await Table.findOne({ tableNo: i });
    if (!t) {
      t = await Table.create({
        tableNo: i,
        seats: i <= 4 ? 2 : i <= 8 ? 4 : i <= 10 ? 6 : 8,
        status: i === 3 || i === 7 ? "Booked" : "Available"
      });
      console.log(`  + Table ${i} created`);
    }
    tables.push(t);
  }

  // 4. Seed Deals
  const dealsData = [
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
        { label: "1.5L Soft Drink", quantity: 1 }
      ]
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
        { label: "1.5L Drink", quantity: 1 }
      ]
    }
  ];

  for (const deal of dealsData) {
    const existing = await Deal.findOne({ name: deal.name });
    if (!existing) {
      await Deal.create(deal);
      console.log(`  + Deal created: ${deal.name}`);
    }
  }

  // 5. Seed Inventory Raw Materials
  const rawMaterials = [
    { name: "Maida Pizza Flour", quantity: 45000, reorderLevel: 10000, unit: "g", sellingPrice: 180 },
    { name: "Mozzarella Cheese Blend", quantity: 22000, reorderLevel: 5000, unit: "g", sellingPrice: 1200 },
    { name: "Cooked Chicken Tikka", quantity: 18500, reorderLevel: 4000, unit: "g", sellingPrice: 950 },
    { name: "Spicy Pizza Sauce", quantity: 14000, reorderLevel: 3000, unit: "g", sellingPrice: 350 },
    { name: "Brioche Burger Buns", quantity: 140, reorderLevel: 30, unit: "pcs", sellingPrice: 45 },
    { name: "Shawarma Pita Bread", quantity: 120, reorderLevel: 25, unit: "pcs", sellingPrice: 35 },
    { name: "Garlic Mayo Toum", quantity: 8000, reorderLevel: 1500, unit: "g", sellingPrice: 400 }
  ];

  for (const item of rawMaterials) {
    const existing = await InventoryItem.findOne({ name: item.name });
    if (!existing) {
      await InventoryItem.create({ ...item, isTrackable: true, notes: "Client Demo Raw Material" });
    }
  }

  // 6. Seed Realistic Active and Historical Orders
  const today = new Date();
  const sampleOrders = [
    {
      customerDetails: { name: "Ahmad Bilal", phone: "03001234567", guests: 3 },
      orderStatus: "In Progress",
      orderSource: "POS",
      orderNumber: "20261017001",
      table: tables[2]?._id, // Table 3
      bills: { total: 2450, tax: 392, totalWithTax: 2842 },
      items: [
        { name: "GenZ Supreme Pizza (Large)", price: 1550, quantity: 1 },
        { name: "Buffalo Hot Wings (6 Pcs)", price: 520, quantity: 1 },
        { name: "Chilled Coca-Cola 1.5L", price: 220, quantity: 1 }
      ],
      paymentMethod: "Cash"
    },
    {
      customerDetails: { name: "Zainab Tariq", phone: "03219876543", guests: 2 },
      orderStatus: "Ready",
      orderSource: "POS",
      orderNumber: "20261017002",
      table: tables[6]?._id, // Table 7
      bills: { total: 1850, tax: 296, totalWithTax: 2146 },
      items: [
        { name: "Chicken Fajita Pizza (Medium)", price: 1050, quantity: 1 },
        { name: "Loaded Cheesy Pizza Fries", price: 480, quantity: 1 },
        { name: "Fresh Mint Margarita", price: 280, quantity: 1 }
      ],
      paymentMethod: "Credit Card"
    },
    {
      customerDetails: { name: "Hamza Sheikh", phone: "03124567890", guests: 1, address: "Phase 6 DHA, Lahore" },
      orderStatus: "Ready to Deliver",
      orderSource: "Online",
      orderNumber: "20261017003",
      bills: { total: 1520, tax: 243, totalWithTax: 1763 },
      items: [
        { name: "Crispy Zinger Crunch Burger", price: 550, quantity: 2 },
        { name: "Spicy Mexican Tortilla Wrap", price: 450, quantity: 1 }
      ],
      paymentMethod: "Online / Paid"
    },
    {
      customerDetails: { name: "Usman Ghani", phone: "03335551234", guests: 4 },
      orderStatus: "In Progress",
      orderSource: "POS",
      orderNumber: "20261017004",
      bills: { total: 3100, tax: 496, totalWithTax: 3596 },
      items: [
        { name: "Double Pepperoni Delight", price: 1550, quantity: 1 },
        { name: "Smash Beef Bacon Burger", price: 750, quantity: 1 },
        { name: "Garlic Parmesan Bread Sticks", price: 320, quantity: 1 },
        { name: "Molten Lava Chocolate Cake", price: 490, quantity: 1 }
      ],
      paymentMethod: "Cash"
    }
  ];

  // Also add 6 past Closed orders so Total Earnings shows realistic numbers (Rs 40k+)
  for (let i = 1; i <= 6; i++) {
    sampleOrders.push({
      customerDetails: { name: `Customer #${100 + i}`, phone: `0300000000${i}`, guests: 2 },
      orderStatus: "Closed",
      orderSource: i % 2 === 0 ? "POS" : "Online",
      orderNumber: `202610170${10 + i}`,
      bills: { total: 2200 + i * 350, tax: 350, totalWithTax: 2550 + i * 350 },
      items: [
        { name: "GenZ Supreme Pizza", price: 1450, quantity: 1 },
        { name: "Fresh Mint Margarita", price: 280, quantity: 2 }
      ],
      paymentMethod: i % 2 === 0 ? "Cash" : "Card",
      orderDate: new Date(Date.now() - i * 3600 * 1000)
    });
  }

  for (const o of sampleOrders) {
    const existing = await Order.findOne({ orderNumber: o.orderNumber });
    if (!existing) {
      await Order.create(o);
      console.log(`  + Order created: ${o.orderNumber} (${o.customerDetails.name})`);
    }
  }

  // 7. Seed Staff
  const staffMembers = [
    { name: "Shahzaib Naseem", designation: "Store Manager", phone: "03001234567", baseSalary: 75000, joinDate: "2024-01-15" },
    { name: "Kashif Ali", designation: "Head Pizza Chef", phone: "03111234567", baseSalary: 55000, joinDate: "2024-03-01" },
    { name: "Bilal Raza", designation: "Front Cashier", phone: "03221234567", baseSalary: 35000, joinDate: "2024-06-10" },
    { name: "Zubair Ahmad", designation: "Dispatch Rider", phone: "03331234567", baseSalary: 30000, joinDate: "2024-08-01" }
  ];

  for (const s of staffMembers) {
    const existing = await Staff.findOne({ name: s.name });
    if (!existing) {
      await Staff.create(s);
      console.log(`  + Staff created: ${s.name} (${s.designation})`);
    }
  }

  // 8. Seed Sample Daily Expenses
  const todayKey = new Date().toISOString().slice(0, 10);
  const sampleExpenses = [
    { description: "Dairy & Mozzarella Restock", amount: 14500, dayKey: todayKey },
    { description: "Branded Pizza Boxes (500 Pcs)", amount: 8200, dayKey: todayKey },
    { description: "Commercial Cylinder Gas Refill", amount: 6500, dayKey: todayKey }
  ];

  for (const exp of sampleExpenses) {
    const existing = await Expense.findOne({ description: exp.description, dayKey: exp.dayKey });
    if (!existing) {
      await Expense.create(exp);
      console.log(`  + Expense created: ${exp.description}`);
    }
  }

  console.log("\n🎉 Database successfully populated with rich client demonstration data!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
