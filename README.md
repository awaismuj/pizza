# 🍕 **GenZ Pizza Land POS System**

A full-featured **GenZ Pizza Land POS System** built using the **MERN Stack** to streamline pizza shop operations, enhance customer experience, and manage orders, payments, and inventory with ease.

## ✨ **Features**

- 🍽️ **Order Management**  
  Efficiently manage customer orders with real-time updates and status tracking.

- 🪑 **Table Reservations**  
  Simplify table bookings and manage reservations directly from the POS.

- 🔐 **Authentication**  
  Secure login and role-based access control for admins, staff, and users.

- 💸 **Payment Integration**  
  Integrated with **Razorpay** (or other gateways) for seamless online payments.

- 🧾 **Billing & Invoicing**  
  Automatically generate detailed bills and invoices for every order.


## 🏗️ **Tech Stack**

| **Category**             | **Technology**                |
|--------------------------|-------------------------------|
| 🖥️ **Frontend**          | React.js, Redux, Tailwind CSS  |
| 🔙 **Backend**           | Node.js, Express.js           |
| 🗄️ **Database**          | MongoDB                       |
| 🔐 **Authentication**    | JWT, bcrypt                   |
| 💳 **Payment Integration**| Razorpay    |
| 📊 **State Management**   | Redux Toolkit                 |
| ⚡ **Data Fetching & Caching** | React Query            |
| 🔗 **APIs**              | RESTful APIs                   |

---
<br>

## ⚙️ Environment Setup

This project uses two environment files:

### 1) Backend environment file
Create a file named `.env` inside the `pos-backend` folder:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/pos-db
JWT_SECRET=change_this_to_a_long_random_secret_key

ADMIN_NAME=System Admin
ADMIN_EMAIL=devops.awais@gmail.com
ADMIN_PHONE=9999999999
# Set a strong, unique password before running the database bootstrap.
ADMIN_PASSWORD=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

For MongoDB Atlas, use a connection string like:

```env
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USER:YOUR_MONGODB_PASSWORD@cluster0.xxxxxx.mongodb.net/pos-db?retryWrites=true&w=majority
```

### 2) POS frontend environment file
Create a file named `.env` inside the `pos-frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=
```

### 3) Online store environment file
Create a file named `.env` inside the `online-store` folder:

```env
VITE_BACKEND_URL=http://localhost:3000
```

> These files are intentionally ignored by Git through each folder's `.gitignore` file, so real secrets are not pushed to the repository.

---

## 🚀 Fresh Clone Setup

Run these commands from the project root:

```bash
cp pos-backend/.env.example pos-backend/.env
cp pos-frontend/.env.example pos-frontend/.env

# Edit the .env files and fill in your MongoDB, JWT, and frontend URLs
```

Then install dependencies:

```bash
cd pos-backend
npm install

cd ../pos-frontend
npm install

cd ../online-store
npm install
```

---

## 🗃️ Database Migration and Seed

This project includes a simple MongoDB bootstrap flow so a new clone can be ready to run without manual database setup.

### Run all database setup steps

From the `pos-backend` folder:

```bash
npm run db:setup
```

This does the following:

- connects to MongoDB
- syncs database indexes
- creates an initial Admin only when `ADMIN_PASSWORD` is explicitly set
- does not create or print a default password

### Individual commands

```bash
npm run migrate
npm run migrate:staff-hr
npm run migrate:staff-hr
npm run migrate:asset-depreciation
npm run seed
```

`migrate` runs the database bootstrap process. Run `migrate:asset-depreciation` when deploying asset management to create its depreciation ledger indexes. `seed` is useful when you want to create the initial admin account and default data only.

### HR and payroll

Run `migrate:staff-hr` once before using HR/payroll in an existing database.
It creates employee IDs and HR indexes, and records legacy salary values as
effective from the migration date because earlier salary history cannot be
reconstructed. It also creates the private HR document, leave accrual, loan
repayment, and report audit indexes.

The HR/payroll workspace covers employee profiles, shift-aware attendance
and assignment history, employee self-service, private HR documents, leave
requests and monthly accrual/carry-forward, approved overtime, fixed-interest-
free staff loans, payroll previews and approval/finalization, payment tracking,
payslips, and filtered employee/attendance/leave/overtime/payroll/payment
reports. Reports export to CSV, Excel-compatible SpreadsheetML `.xls`, and
PDF. HR document files are kept in MongoDB and are available only through
authenticated, role-checked routes; do not expose them through the public
`/uploads` path.

Payroll tax and statutory contributions remain configurable rates rather than
jurisdiction-certified legal calculations. Configure and review these rules
with a qualified accountant before production payroll. Email notifications
require configured SMTP.

### User roles and access control

The existing `User` accounts and cookie-based JWT login are reused. Run the
safe, additive RBAC index migration when deploying the user/employee
management feature:

```bash
cd pos-backend
npm run migrate:rbac
```

Existing accounts keep their existing roles and passwords. Built-in role
permissions are resolved at request time; custom roles and security audit
events are stored in the `roles` and `userauditlogs` collections. Individual
permission overrides use this rule: role permissions are the baseline,
explicit grants add permissions, and explicit denials always win.

The RBAC migration only creates indexes; it does not rewrite or delete
existing users, passwords, orders, or other business records. Back up the
database before deployment as usual. To roll back the application, redeploy
the previous application version and leave the additive indexes, user fields,
roles, and audit records in place. Do not drop the RBAC collections or indexes
as part of rollback: they may contain employee permissions and security history
needed if the feature is redeployed.

#### Provisioning the first Super Admin

The application does not create a default-password owner account. Use an
existing, active, approved Admin account and explicitly promote it from an
operator-controlled environment with database access:

```bash
cd pos-backend
RBAC_OWNER_EMAIL=owner@example.com npm run rbac:promote-owner
```

The command does not create an account or display/change a password. It
refuses to run if an active Super Admin already exists, promotes only the
specified existing Admin, records the provisioning event, and invalidates
that account's existing sessions. Set `ADMIN_PASSWORD` explicitly if using
the separate fresh-database bootstrap to create an initial Admin. Never use
a shared or default credential.

#### Managing employee accounts

Sign in as an authorized Admin or Super Admin, then open **Dashboard →
User & Employees**. The form creates active accounts with a selected
predefined or custom role. The Users page supports search, role/status
filters, pagination, profile editing, role changes, permission overrides,
password resets, activation/deactivation, and audit history. Password
resets use administrator-set temporary passwords; employees must change
them before accessing other protected APIs.

Admin accounts can delegate only permissions they themselves have and
cannot create, manage, or promote Admin/Super Admin accounts. Owner-only
actions require the Super Admin role. Deactivation, role/permission changes,
and password resets revoke existing JWT sessions; permissions are reloaded
from MongoDB on each authenticated request.

---

## ▶️ Start the app

### Start backend

```bash
cd pos-backend
npm run dev
```

### Start POS frontend (admin/staff app)

```bash
cd pos-frontend
npm run dev
```

This starts the Vite dev server usually on:

```text
http://localhost:5173
```

### Start the online store (customer-facing storefront)

```bash
cd online-store
npm run dev
```

This starts on:

```text
http://localhost:5174
```

> Both dev ports (`5173` and `5174`) are already whitelisted in the backend's
> CORS config (`pos-backend/app.js`), so you can run all three apps side by
> side locally without extra configuration. In production, set `STORE_URL`
> in the backend's `.env` to your deployed storefront domain.

---

## 🏗️ Production build

For the frontend:

```bash
cd pos-frontend
npm run build
```

For the backend:

```bash
cd pos-backend
npm start
```

---

## 📦 Inventory Management

This project includes a MongoDB inventory module that tracks stock for items such as cold drinks, water bottles, and other consumables.

### Inventory flow

1. Open the admin dashboard, go to the **Menu** tab, and create a **Category**
   and then a **Dish** in that category.
2. Go to the **Inventory** tab and add a stock item (name, unit, quantity,
   reorder level, cost/selling price).
3. Edit the dish and turn on **"Deduct stock from inventory when this is
   ordered"**, then either:
   - **Single item** — map the dish 1:1 to one inventory item (e.g. a
     bottled drink), or
   - **Recipe** — list several ingredients and how much of each one dish
     uses (e.g. 200g flour + 100g cheese per pizza). Quantities are
     automatically converted between compatible units (g/kg, ml/l).
4. Stock is deducted automatically:
   - **Dine-in (POS) orders** — the moment the order is placed at the till.
   - **Online orders** — only once staff **Accept** the order from the
     Online Orders tab (not the instant a customer checks out), so a
     customer can't tie up stock by never following through.
5. If there isn't enough stock for an order, the order/accept is rejected
   with a message like:
   ```text
   Not available: Cold Drink. Only 2 bottle in stock, 3 bottle needed (short by 1 bottle).
   ```
6. **Cancelling an order gives the stock back automatically.** Any order
   that had stock deducted (dine-in, or online orders cancelled after being
   Accepted/Preparing/etc.) restores the exact amount it took when it's
   marked **Cancelled**. This is tracked per-order (`inventoryDeducted` on
   the order document) so stock can never be double-deducted or
   double-restored, and a Completed/Closed/Cancelled order can't be edited
   further.

### Inventory API endpoints

```text
GET    /api/inventory
POST   /api/inventory
PUT    /api/inventory/:id
PATCH  /api/inventory/:id/adjust
DELETE /api/inventory/:id
```

The inventory schema is defined in:

- `pos-backend/models/inventoryItemModel.js`
- `pos-backend/controllers/inventoryController.js`
- `pos-backend/routes/inventoryRoute.js`

### MongoDB note

This is designed for MongoDB. The inventory collection is created automatically when you run the app and seed the database. You can update the seed file at `pos-backend/scripts/seed.js` to add your own default stock items.

### 🍕 Pizza Land recipe seeder (`seed:pizzaland`)

`pos-backend/scripts/seedPizzaLandRecipes.js` bulk-creates the raw
ingredients (Maida, Chicken, Cheese, Mayonnaise, Pizza Sauce, Buns, Eggs,
Shami patty, sauces, salad, shawarma bread, etc.) and links them as
**recipes** to the standard menu — Small/Medium/Large/Extra Large Pizza,
Burger, Shami Bread, Double Anda, Small/Large Shawarma, Zinger — so ordering
any of them automatically deducts the right amount of each ingredient from
Inventory.

Run it from `pos-backend`:

```bash
npm run seed:pizzaland
```

It's safe to re-run:

- **Inventory items** are only created if missing — it never resets stock
  quantity you've already adjusted.
- **Dishes** are matched **by exact name** (case-insensitive). If a dish
  with that name already exists on your menu, only its recipe/ingredients
  are updated — its price, image, and category are left untouched. If no
  matching dish exists, a **new** dish is created with a placeholder price.

Before/after running it, read the console output carefully:

- It first prints your current menu (name + price) so you can compare it
  against the dish names the script is about to use.
- Any dish it can't match prints `⚠️ NOT FOUND` — meaning it just created a
  **new** dish instead of linking to your real one. Rename your existing
  dish (or edit the script's `name` field) to match, then re-run.
- Newly created dishes get **placeholder prices** (e.g. Rs. 450 for Small
  Pizza) and **placeholder opening stock** (e.g. 10,000 g Maida) since the
  source portion sheet had neither real prices nor real stock counts. Open
  Dashboard → Menu / Dashboard → Inventory afterwards and correct these to
  your actual numbers.
- A few recipe amounts were inferred from ranges/incomplete sheet data
  (e.g. Burger "60-70g" shami → 65g, "Double Anda" → assumed 2 eggs). These
  are called out with `// ASSUMED` comments at the top of the script and in
  the ingredient list — double-check them against your real recipe.

---

## 🎨 Branding / Logo

The GenZ Pizza Land logo lives in `/branding` at the project root, exported
at every size the apps need:

```text
branding/
  genz-pizza-land-logo.jpg   # original upload
  logo-512.png                # general use / social
  logo-192.png                # PWA / favicon (192px)
  apple-touch-icon.png        # 180px, iOS home-screen icon
  favicon-32.png / favicon-16.png
  favicon.ico                 # multi-resolution .ico (16+32)
```

It's wired into both frontend apps:

- **pos-frontend** (staff/admin POS) — browser tab icon + title
  (`index.html`), header logo (`components/shared/Header.jsx`), and the
  login/register page (`pages/Auth.jsx`). Source copy lives at
  `pos-frontend/src/assets/images/genz-pizza-land-logo.jpg`.
- **online-store** (customer storefront) — browser tab icon + title
  (`index.html`) and the header logo in the menu, loading, and
  order-tracking views (`src/App.jsx` / `src/App.css`, class
  `.gzp-logo-badge`). Source copy lives at
  `online-store/src/assets/genz-pizza-land-logo.jpg`.

To swap the logo later, replace the files in `/branding`, regenerate the
sized copies (any image tool, or `sharp`/ImageMagick), and re-copy them into
each app's `public/` and `src/assets/` folders.

---

## 🛠️ Recent fixes

- **Dashboard "Edit" on categories/dishes now actually loads existing
  data.** Previously, `pages/Dashboard.jsx` computed `modalInitialData` when
  you clicked Edit, but never passed it into `<Modal>` — so the edit form
  always opened blank, as if adding something new. Saving it would then try
  to *create* a duplicate instead of updating the item you clicked. Fixed
  by passing `initialData={modalInitialData}` into `<Modal>`. Editing a
  dish now correctly pre-fills its name, price, category, and (if inventory
  tracking is on) its ingredients/recipe, and Save now updates it in place.

---

## 🧩 Git workflow for .env files

Do not push real `.env` files. Keep them local.

Safe workflow:

```bash
# 1. Create your local env files
cp pos-backend/.env.example pos-backend/.env
cp pos-frontend/.env.example pos-frontend/.env

# 2. Fill in your real values
# 3. Check what is modified
git status

# 4. Add only the safe files to the commit
git add README.md pos-backend/.env.example pos-frontend/.env.example

# 5. Commit
git commit -m "Add environment examples and database bootstrap docs"

# 6. Push
git push origin main
```

If you use a different branch name, replace `main` with your branch name.

> The actual `.env` files remain local because they are already listed in each project's `.gitignore` file.

---

## �📺 **YouTube Playlist**

🎬 Follow the complete tutorial series on building this GenZ Pizza Land POS System on YouTube:  
👉 [Watch the Playlist](https://www.youtube.com/playlist?list=PL9OdiypqS7Nk0DHnSNFIi8RgEFJCIWB6X)  

## 📁 **Assets**

- 📦 **Project Assets:** [Google Drive](https://drive.google.com/drive/folders/193N-F1jpzyfPCRCLc9wCyaxjYu2K6PC_)

---

## 📋 **Flow Chart for Project Structure**

- 🗺️ **Visualize the Project Structure:** [View Flow Chart](https://app.eraser.io/workspace/IcU1b6EHu9ZyS9JKi0aY?origin=share)

---

## 🎨 **Design Inspiration**

- 💡 **UI/UX Design Reference:** [Behance Design](https://www.behance.net/gallery/210280099/Restaurant-POS-System-Point-of-Sale-UIUX-Design)

---

## 🖼️ **Project Screenshots**

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/ibjxvy5o1ikbsdebrjky.png" alt="Screenshot 1" width="300"/></td>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502773/ietao6dnw6yjsh4f71zn.png" alt="Screenshot 2" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/vesokdfpa1jb7ytm9abi.png" alt="Screenshot 3" width="300"/></td>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/setoqzhzbwbp9udpri1f.png" alt="Screenshot 4" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/fc4tiwzdoisqwac1j01y.png" alt="Screenshot 5" width="300"/></td>
  </tr>
</table>


✨ Feel free to explore, contribute, and enhance the project! 🚀

💡 To contribute, please check out the **CONTRIBUTING.md** for guidelines.

⭐ If you find this project helpful, don't forget to **star** the repository! 🌟
