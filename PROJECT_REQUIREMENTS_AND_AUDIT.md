# GenZ Pizza Land — POS & ERP Comprehensive Architecture, Requirements & Audit Specification

**Document Version:** 1.0.0  
**Audit Date:** October 17, 2026  
**System Classification:** Food & Beverage Point of Sale (POS) & Restaurant Enterprise Resource Planning (ERP)  
**Target Environments:** Counter POS Terminals, Kitchen Display Systems (KDS), Manager/Admin Back-Office, Storefront Web  

---

## 1. Executive Summary

This document serves as the **official single-source-of-truth functional and non-functional requirements specification and forensic codebase audit** for the **GenZ Pizza Land** enterprise restaurant management platform. 

The system operates on a **Dual-Mode Architecture**:
1. **Cashier Fast-Lane (Front-of-House POS):** Touch-optimized, distraction-free station for cashiers, waitstaff, and kitchen operators to process dine-in, takeaway, and online orders with zero learning curve.
2. **Manager ERP Portal (Back-Office Administration):** Permission-gated suite for executive metrics, audit ledger, profit & loss, inventory stock control, staff payroll, fixed asset register, menu engineering, and automated reporting.

---

## 2. Functional Requirements Audit & Status Matrix

### Legend
* ✅ **Implemented & Verified:** Fully functional in frontend and backend with database persistence.
* 🟡 **Partially Implemented:** Functional in core path, but requires polish or edge-case handling.
* ❌ **Missing / Roadmap Gap:** Identified gap that should be scheduled for future releases.

---

### Module 1: Order Processing & Billing (POS / KDS)
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-ORD-01** | Support Dine-In, Takeaway (Outdoor), and Online Delivery order types | ✅ | Unified order pipeline across all 3 channels. |
| **F-ORD-02** | Interactive Table Station Assignment (T1–T12) with live occupancy sync | ✅ | Tables turn busy upon order creation, release upon settlement. |
| **F-ORD-03** | Multi-Variant Dish Configuration (Size, Crust, Base Price adjustment) | ✅ | Fully integrated with live pricing calculation. |
| **F-ORD-04** | Combo Deals & Bundle Pricing with dynamic ingredient stock link | ✅ | Pre-configured deals and dynamic discount tiers. |
| **F-ORD-05** | View Itemized Order Details (Customer, Dishes, Variants, Bills, Notes) | ✅ | Modal available across Kitchen Display & Recent Orders. |
| **F-ORD-06** | Order Lifecycle Pipeline (`Pending` → `In Progress` → `Ready` → `Closed`/`Completed`) | ✅ | Real-time stage progression with color-coded status badges. |
| **F-ORD-07** | Order Item Modification (Edit items, change quantities before completion) | ✅ | Gated to Cashier and Admin roles with stock adjustment. |
| **F-ORD-08** | Order Cancellation with automatic stock rollback to inventory | ✅ | Safe stock reversal upon cancellation. |
| **F-ORD-09** | Deleted Orders Audit Trail & Soft-Delete Recovery Log | ✅ | Gated to Admin; soft-deleted records tracked in database. |
| **F-ORD-10** | Thermal Receipt Generation & Print Slip (80mm/58mm standard) | ✅ | Printable Invoice modal with company branding and tax breakdown. |
| **F-ORD-11** | Split-Bill Payment (Split by items or equal split across multiple cards/cash) | ❌ | **Missing Functional Requirement**: Orders currently settle under a single primary bill. |
| **F-ORD-12** | Direct ESC/POS Hardware Network/USB Kitchen Printer Automation | 🟡 | Currently relies on browser print dialog; direct raw ESC/POS driver bridge missing. |
| **F-ORD-13** | Audible Kitchen Chime / Bell Sound on New Ticket arrival | ❌ | **Missing Functional Requirement**: Audio notification cue on new online/dine-in ticket. |

---

### Module 2: Table & Floor Management
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-TAB-01** | Visual Floor Seating Plan with real-time station statuses | ✅ | Color-coded grid showing seat capacities and active guests. |
| **F-TAB-02** | 1-Tap Table Selection to begin order billing | ✅ | Auto-binds table ID to Redux cart and shifts table state. |
| **F-TAB-03** | Force Release Table (Admin override if order closed off-system) | ✅ | Instant recovery mechanism for stuck stations. |
| **F-TAB-04** | Table Station CRUD (Add tables, change seat capacity, remove station) | ✅ | Admin-only modal on table cards. |
| **F-TAB-05** | Advance Table Reservations & Guest Pre-Booking Calendar | ❌ | **Missing Functional Requirement**: No reservation scheduler for future dates/times. |
| **F-TAB-06** | Table Merge / Table Transfer (Moving guest order from T3 to T7) | ❌ | **Missing Functional Requirement**: Cashiers must cancel and recreate to move tables. |

---

### Module 3: Menu & Catalog Engineering
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-CAT-01** | Category Management (Add, Edit, Reorder drag-and-drop, Delete) | ✅ | Supported with colored SVG icons and image fallback. |
| **F-CAT-02** | Dish Catalog Management with Unsplash URLs and local uploads | ✅ | Multi-variant pricing, image validation, category linking. |
| **F-CAT-03** | Universal Multi-Colored Vector Food Icons | ✅ | Native vector SVGs for Pizza, Burger, Fastfood, Drinks, BBQ, Pasta, etc. |
| **F-CAT-04** | Automatic Broken Image Fallback (`onError` recovery) | ✅ | Automatically swaps broken images to vector food icons. |
| **F-CAT-05** | Build-Your-Own Dynamic Pizza Configurator | ✅ | Tiered discount manager for custom customer creations. |
| **F-CAT-06** | Customer Dietary Tags (Vegetarian, Spicy Level, Halal, Gluten-Free) | ❌ | **Missing Functional Requirement**: Tags for allergen and dietary filtering. |

---

### Module 4: Inventory & Stock Control
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-INV-01** | Raw Material Ledger (Name, SKU, Unit, Quantity, Purchase Price) | ✅ | Real-time stock counting and unit tracking. |
| **F-INV-02** | Dish-to-Ingredient Deduction linking (Selling pizza deducts dough & cheese) | ✅ | Deducts proportional inventory upon order confirmation. |
| **F-INV-03** | Low-Stock Visual Indicator & Pop-up Alert Badge | ✅ | Real-time count of items below safety threshold. |
| **F-INV-04** | Stock In / Stock Adjustment manual ledger with audit reason | ✅ | Adjust inventory balance with notes. |
| **F-INV-05** | Purchase Order (PO) Generation & Vendor / Supplier Directory | ❌ | **Missing Functional Requirement**: No vendor records or incoming PO workflows. |
| **F-INV-06** | Wastage & Spoilage Log (Tracking expired/damaged food stock) | ❌ | **Missing Functional Requirement**: Stock write-offs not itemized in dedicated ledger. |

---

### Module 5: Staff Management, HR & Permissions
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-HR-01** | Staff Employee Directory (Designation, CNIC, Phone, Address, Salary) | ✅ | Full staff roster with monthly base pay tracking. |
| **F-HR-02** | Daily Attendance Tracking (`Present`, `Absent`, `Half-Day`, `Leave`) | ✅ | Daily calendar check-in with monthly attendance history. |
| **F-HR-03** | Payroll Calculation with Advance Payments & Deductions | ✅ | Automatic net salary computation and payment status toggling. |
| **F-HR-04** | Salary Slip Generation & Email Dispatch | ✅ | Automated email distribution of payroll slips. |
| **F-HR-05** | User Login Account Approval Workflow (Admin email token link) | ✅ | Pending accounts cannot authenticate until approved. |
| **F-HR-06** | Permission-Based Portal Switcher (`Cashier` ↔ `Manager`) | ✅ | Gated by `canUserAccessERP`; positioned above `+ New Order`. |
| **F-HR-07** | Interactive Role & Portal Permission Control Panel | ✅ | Dedicated "System Access" tab with full CRUD and user search. |
| **F-HR-08** | Granular Capability Matrix (e.g. Can give discounts, Can void orders) | ✅ | Implemented interactive 9-point Capability Matrix with presets (Admin, Manager, Cashier, Kitchen, Rider, Accountant). Available in System Access tab and Staff Enrollment. |


---

### Module 6: Financials, Expenses & Fixed Assets
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-FIN-01** | Daily Shift Reconciliation & Real-Time Register Gross Sales | ✅ | Live computation comparing today's revenue to previous day. |
| **F-FIN-02** | Trading Profit & Loss Statement (Sales minus COGS and Operating Expenses) | ✅ | Real-time gross margin and net profit visualization. |
| **F-FIN-03** | Petty Cash / Cash Expense Ledger with quick record modal | ✅ | Log daily utility, supplies, and miscellaneous expenses. |
| **F-FIN-04** | Payment Gateway & Settlement Tracking (Cash, Card, Digital wallets) | ✅ | Breakdowns across payment instruments. |
| **F-FIN-05** | Fixed Asset Register (Ovens, Refrigeration, POS Hardware, Vehicles) | ✅ | Asset valuation, location assignment, document attachments. |
| **F-FIN-06** | Asset Straight-Line Depreciation Engine & Audit Log | ✅ | Run monthly depreciation schedules and asset disposals. |
| **F-FIN-07** | Shift Cash Drawer In/Out float reconciliation (Opening float vs Closing cash) | ❌ | **Missing Functional Requirement**: No formal opening float entry or blind drawer count. |

---

### Module 7: Reporting, Marketing & Store Ambiance
| ID | Requirement | Status | Notes |
|---|---|:---:|---|
| **F-REP-01** | Automated Daily Financial WhatsApp Summary Report | ✅ | End-of-day summary dispatch via linked WhatsApp session. |
| **F-REP-02** | PDF Performance Report Download | ✅ | PDF export of daily trading and order audit ledgers. |
| **F-REP-03** | Web Storefront Hero Banner Slider Manager | ✅ | Banner upload and sequencing for public website. |
| **F-REP-04** | In-Store Ambient Music Player with admin controls | ✅ | Integrated audio controller with compact and expanded modes. |
| **F-REP-05** | Customer Loyalty Points / SMS Marketing Automation | ❌ | **Missing Functional Requirement**: No customer loyalty points engine or SMS campaigns. |

---

## 3. Non-Functional Requirements (NFR) Audit & Status Matrix

### Legend
* ✅ **Compliant:** Meets production standards.
* 🟡 **Acceptable with Improvements:** Operational, but requires hardening or performance tuning.
* ❌ **Missing / Non-Compliant:** Significant architectural gap that must be addressed.

---

### Category 1: Performance & Efficiency
| ID | Requirement | Status | Current State & Recommendations |
|---|---|:---:|---|
| **NFR-PERF-01** | Sub-second POS Interaction Latency | ✅ | Redux local state ensures instant cart item addition and price recalculation. |
| **NFR-PERF-02** | Production Asset Bundle Size (< 500 kB chunks) | 🟡 | Main JS bundle is currently ~1,020 kB minified. **Recommendation:** Implement route-level dynamic imports (`React.lazy`) for Dashboard modules and Asset Management. |
| **NFR-PERF-03** | Database Query Efficiency & Indexing | 🟡 | Mongoose models have basic indexing; compound indexes recommended on `Order (orderDate, orderStatus, orderSource)` for large order volumes. |

---

### Category 2: Security & Authentication
| ID | Requirement | Status | Current State & Recommendations |
|---|---|:---:|---|
| **NFR-SEC-01** | Secure Cookie Session & JWT Storage | ✅ | `httpOnly`, `sameSite`, and environment-sensitive `secure` cookie flags implemented. |
| **NFR-SEC-02** | Password Hashing | ✅ | Bcrypt with salt rounds (10) applied on user save. |
| **NFR-SEC-03** | API Rate Limiting & Brute Force Defense | ❌ | **Missing Non-Functional Requirement**: `express-rate-limit` is not active on `/api/user/login` or public routes. Must be added to prevent credential stuffing. |
| **NFR-SEC-04** | Input Sanitization & XSS Defense | 🟡 | React escapes JSX expressions by default; backend needs `express-mongo-sanitize` to guard against NoSQL query injection on unfiltered queries. |
| **NFR-SEC-05** | CORS Lockdown | ✅ | Express CORS middleware configured with authorized origin matching. |

---

### Category 3: Reliability, Availability & Error Handling
| ID | Requirement | Status | Current State & Recommendations |
|---|---|:---:|---|
| **NFR-REL-01** | Graceful UI Error Recovery (No White Screens) | ✅ | Global `ErrorBoundary` catches unexpected component failures with diagnostic details and 1-tap reload. |
| **NFR-REL-02** | Defensive Data Sanitizers | ✅ | `formatCurrency` and `getAvatarName` fortified against `null`, `undefined`, or non-string inputs. |
| **NFR-REL-03** | Offline Resilience & PWA Caching | ❌ | **Missing Non-Functional Requirement**: If store Wi-Fi drops, terminal stops functioning. ServiceWorker caching and offline IndexedDB sync should be planned. |
| **NFR-REL-04** | Automated Database Backup & Disaster Recovery | ❌ | **Missing Non-Functional Requirement**: No automated nightly `mongodump` cron job currently configured in backend scripts. |

---

### Category 4: Usability, UX & Accessibility
| ID | Requirement | Status | Current State & Recommendations |
|---|---|:---:|---|
| **NFR-UX-01** | Non-Tech Cashier Ergonomics | ✅ | Single navigation anchor in sidebar, large touch targets, color-coded status badges, zero duplicate controls. |
| **NFR-UX-02** | Theme Adaptability (Dark Mode & Clean Light Mode) | ✅ | Persisted across sessions with high-contrast color palettes. |
| **NFR-UX-03** | Multi-Colored Food Aesthetics | ✅ | Zero wireframe or monochrome icons; rich colored SVGs used consistently. |

---

## 4. Priority Roadmap Checklist for Missing Requirements

### Phase 1: High Priority (Immediate Operational Impact)
- [ ] **Rate Limiting & NoSQL Sanitization**: Add `express-rate-limit` and `express-mongo-sanitize` in `pos-backend/server.js`.
- [ ] **Kitchen Audio Notification**: Add a chime audio effect (`new Audio('/sounds/bell.mp3').play()`) in `Orders.jsx` when a new order appears in the query cache.
- [ ] **Vite Code Splitting**: Split `Dashboard.jsx`, `AssetManagement.jsx`, and `StaffManagement.jsx` into lazy-loaded chunks to reduce initial bundle below 400 kB.

### Phase 2: Medium Priority (Cashier Workflow Enhancements)
- [ ] **Split-Bill Checkout**: Allow cashiers to split an order between two cards or Cash + Card in `Bill.jsx`.
- [ ] **Table Merge / Transfer**: Modal in `TableCard.jsx` to move an active table's order to another free table.
- [ ] **Automated MongoDB Backup Script**: Setup a scheduled backup script in `pos-backend/scripts/backupDatabase.js`.

### Phase 3: Long-Term Enterprise Capabilities
- [ ] **Offline PWA Sync**: ServiceWorker + IndexedDB to allow order taking during network dropouts.
- [ ] **Customer Loyalty Points & Promo Engine**: Redeemable loyalty reward balances tied to customer phone numbers.
- [ ] **ESC/POS Direct Hardware Print Bridge**: Local node/electron raw TCP printer listener for zero-click thermal slips.

---

*Verified and audited by Google Antigravity Agentic Systems.*
