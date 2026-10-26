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
# Publishable key ID only; never put a payment secret in VITE_ variables.
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

## Coupons and promotions

The POS dashboard includes **Coupons & Customer Marketing** and shared
percentage and fixed-amount codes for POS and online orders, with status and
date windows, campaign/per-phone limits, minimum eligible subtotal, optional
discount caps, product/category allowlists and exclusions, first-order checks,
and a stacking toggle. The storefront and POS validate codes through the
backend, and the backend recalculates item prices before persisting the order
and discount snapshot. A valid mobile number is required in both channels so
per-customer redemption limits do not collapse into a shared anonymous POS
identity. Existing Deals and Build Your Own behavior remain separate.

The optional first-time customer offer is configured in POS Dashboard >
Coupons. Online checkout checks the phone and server-priced cart, offers a
phone-bound code to eligible first-time customers, and revalidates that code
through the normal coupon path before applying it. Campaign limits are reserved
transactionally with order redemption. Before enabling this offer in
production, run `npm run migrate:welcome-offer-index` from `pos-backend` to
create the unique phone-key index that prevents duplicate offers under
concurrent requests.

Coupons & Customer Marketing adds database-backed welcome, Friday, birthday,
and manual campaign settings, execution history, customer coupon history, and
email/WhatsApp delivery logs. Welcome checks require a signed-in customer with
a verified email. Friday and birthday automation use the configured timezone
(initially `Asia/Karachi`); automatic Friday generation defaults off and can be
enabled from the POS. Campaign runs target active, verified customer accounts
with qualifying completed/closed order history. Administrators can select
customers from the customer database or preview and generate for all eligible
customers. Discount and expiry values are snapshotted when each coupon is
issued, and campaign executions are idempotent across backend instances.

Before deploying this module, back up the database and run
`npm run migrate:promotions` from `pos-backend`. The migration creates the
execution, issue, coupon-tier, and customer-assignment idempotency indexes; it
does not rewrite customer or order data. Use the existing SMTP configuration
for email. WhatsApp delivery requires the production Cloud API configuration
and approved template; mock mode does not send real messages. Both channels
require current recorded marketing consent, and provider acceptance is logged
as `sent` rather than confirmed delivery.

The **Send Coupons** campaign tool is under POS Dashboard > Coupons. Customer
phone contacts can be added from the recipient list or are captured from new
POS/online orders, then matched to completed/closed orders by phone. Contacts
created from orders start opted out. Coupon assignment can include an active
contact with a valid number and qualifying order; WhatsApp delivery also
requires explicit marketing consent, and all-eligible sends cannot include
opt-outs or invalid phone numbers.
Customer status is derived from account activity and linked/guest order
history; VIP filtering is not offered because the current customer model has
no VIP classification. Campaigns save recipient records and standard coupon
assignments before dispatch, use idempotency keys, and can be paused, cancelled,
or safely retried for provider-confirmed failures.

For a new campaign, scan/preview the recipients, save the campaign draft, use
**Generate & Assign Tokens**, then review the current eligible count and confirm
**Send to All Eligible** or **Send to Selected**. Token generation is
idempotent; a repeated scan does not create coupons, and dispatch is blocked
until each queued eligible recipient has a persisted, currently valid token.
The worker rechecks current order eligibility, marketing consent, number
validity, campaign state, and coupon validity immediately before sending.
Generated coupon codes appear in the POS with a per-customer copy action.
Coupon email delivery can be enabled during generation; only customers with a
saved email and recorded promotional consent are queued. Email delivery uses
the existing SMTP configuration and the campaign worker rechecks consent and
coupon validity before sending. The campaign results tab shows WhatsApp
delivery records; the separate campaign-activity button is not shown.

Campaign delivery uses the official WhatsApp Cloud API (`cloud`) or a
development-only no-delivery provider (`mock`). Linked-device/WhatsApp Web
automation is disabled and cannot send reports or campaign messages. Cloud API
use requires an approved template with five body parameters (`{{1}}` through
`{{5}}`) and production credentials. Configure `WHATSAPP_CAMPAIGN_PROVIDER=cloud`
in the backend environment. In POS → Coupons, the campaign results tab shows
provider readiness and per-recipient campaign records, including queued,
sending, sent, delivered, failed, and skipped counts with paginated recipient
details that refresh while a campaign is running. The configured test number is
the only destination for test sends. Cloud delivery callbacks are
signature-verified; accepted Cloud messages are recorded as sent, not delivered,
until WhatsApp confirms delivery. Profit reports remain available as PDF
downloads and email. Before launching campaigns, run
`npm run migrate:whatsapp-campaigns` from `pos-backend`. This creates
campaign/coupon idempotency and query indexes and adds the campaign permission
to persisted Admin/Super Admin roles; it does not rewrite customer or order
data.

For multiple backend instances, use `WHATSAPP_CAMPAIGN_PROVIDER=cloud` on every
instance and configure the same approved template and Cloud API credentials on
each one. All instances must use the same MongoDB database. The campaign worker
claims each recipient atomically in MongoDB and shares its send-rate slot there,
so replicas coordinate instead of each sending the same queued recipient. Run
the WhatsApp campaign migration before enabling sends. Do not configure a
separate local database per instance.

Cloud API delivery does not need Chromium or a linked-device session. Legacy
`WHATSAPP_ENABLED`, `WHATSAPP_SESSION_DIR`, and `REPORT_AUTO_SEND` variables are
ignored by the backend. Keep Cloud API credentials in the deployment secret
manager and rotate any credentials that were previously exposed or stored in
unsecured files.

To enable the customer phonebook, back up MongoDB, deploy the updated backend
files, and run `npm run migrate:customer-contacts` from `pos-backend` before
restarting the backend. The migration safely imports valid phone numbers from
historical orders into contact-only customer records and replaces the customer
email index with a partial unique index that applies only to real email strings,
so phone-only contacts do not need fake email addresses. Existing registered
customer records are retained. Imported and automatically captured contacts
are opted out of marketing by default; staff may record opt-in only after the
customer has explicitly agreed. New POS and online orders capture a phone
contact automatically after the order is saved. Phone-only contacts are
internal records and cannot sign in to the storefront. The migration is safe
to rerun and does not modify or delete orders.

### Price and redemption policy

The existing order calculation sequence is preserved: resolve current menu
prices → apply the existing Build Your Own discount (online only) → apply an
eligible coupon discount → calculate tax using the live Settings tax rate.
Coupons never reduce the eligible subtotal below zero. Order bills store the
discount, coupon code, and applied amount at order time, so later coupon edits
do not rewrite old receipt values. Online orders reserve a redemption while
Pending; cancellation or deletion reverses it. Completed/closed orders cannot
be cancelled through the existing workflow.

Coupon counters and the order/redemption records are written in a MongoDB
transaction. Production MongoDB must therefore support transactions (for
example, MongoDB Atlas or a replica set); standalone MongoDB instances are not
suitable for coupon checkout. Validation by itself does not consume a use.
The public validation endpoint uses a process-local IP limit; deployments
running multiple backend instances should put a shared/distributed rate
limiter at the gateway or replace the middleware with a shared store.

Public online checkout and POS Razorpay payment setup require an
`Idempotency-Key`. The storefront reuses its key for unchanged checkout
retries, and the POS reuses its key for the same payment amount. The backend
returns the original order/payment setup instead of creating duplicates.
Razorpay captured-payment webhooks are also persisted once per gateway
payment ID. Before enabling these changes, run
`npm run migrate:payment-idempotency` from `pos-backend` to add the required
unique and expiry indexes. The migration stops if prior webhook deliveries
left duplicate payment IDs; reconcile those records before retrying it.
Configure a unique `IDEMPOTENCY_SECRET` of at least 32 characters and keep it
stable across deployments. If omitted, the backend falls back to
`JWT_SECRET`; changing the idempotency secret invalidates hashes for active
retry keys.

The backend rejects MongoDB operator/dotted keys in JSON and query input,
limits JSON request bodies, adds baseline security headers, and rate-limits
sign-in, registration, checkout, payment setup/verification, and payment-proof uploads.
These in-memory rate limits are per backend process; use a shared
gateway/store for multi-instance production deployments. Production startup
also requires a unique `JWT_SECRET` of at least 32 characters.

The public storefront exposes its home, help, terms, and privacy policy pages
through `online-store/public/sitemap.xml` and `robots.txt`; the POS app is
marked `noindex`. The storefront includes an app-level not-found page and
static `404.html`; configure the web host to serve that file with an HTTP 404
status for unknown paths. Large uploaded images are resized/compressed in the
POS browser before upload when supported. Existing review spam controls
include a honeypot and rate limit; delivery quote and menu search inputs are
debounced.

### Deployment and rollback

1. Back up MongoDB before deployment.
2. Verify the configured `MONGODB_URI` points to a transaction-capable
   deployment.
3. Deploy the backend, then from `pos-backend` run
   `npm run migrate:payment-idempotency` to add the checkout/payment
   retry-protection indexes. Reconcile any duplicate legacy webhook payment
   IDs reported by the migration before retrying.
4. Before enabling the updated storefront, build and deploy `online-store`.
5. From `pos-backend`, run `npm run migrate` to apply the bootstrap index
   setup. This existing bootstrap command may also create the configured
   default admin if it does not exist; review its output.
6. Build/deploy `pos-frontend`. For customer registration,
   configure SMTP as described below; no scheduled job is required for the
   current manual assignment flow.
7. Create a draft coupon, verify its dates/rules, then activate it and test
   both POS and online checkouts with a small campaign limit before publishing.

Rollback consists of redeploying the prior application versions. No existing
orders are rewritten and no collection is dropped; coupon definitions and
redemption records are retained for audit. Do not manually delete coupon
records that have redemptions.

Customer accounts now use a separate `Customer` collection, email verification,
hashed passwords, and short-lived customer JWTs. Configure `SMTP_HOST`,
`SMTP_USER`, `SMTP_PASS`, and optionally `SMTP_PORT`/`SMTP_FROM` in
`pos-backend/.env` before enabling registration. If email delivery is not
configured, registration remains unverified and the customer cannot sign in;
configure SMTP before inviting customers. A customer can explicitly opt in or
withdraw marketing consent, but the application does not send promotional
messages.

Admins can assign private random codes to verified customer accounts. The
assignment is stored separately from its shared campaign, and the raw code is
shown only once after creation; assignment lists mask it. Customers can see
their currently available assignments after signing in and can use them in
online checkout. Private codes intentionally require an authenticated customer
account and are not redeemable through POS until POS has a secure customer
authentication flow. Shared coupons remain usable in both channels. Assignment
dates inherit the campaign window unless explicitly narrowed, and redemption
limits are checked again in the checkout transaction.

Customer phone numbers are unique identifiers in this initial account flow but
are not verified by SMS. They must not be treated as proof of identity; private
codes therefore require the verified-email account session. Phone-based order
history is used to retain first-order and per-customer coupon checks when a
guest customer later creates an account.

This is not yet the full requested promotion suite: implemented discount types
remain percentage and fixed amount. Free delivery, free products, BOGO,
loyalty/VIP/birthday/referral/win-back eligibility, automated assignment jobs,
pickup/delivery-specific coupon rules, assignment regeneration in the admin
UI, advanced campaign analytics/exports, and incremental revenue attribution
are not implemented. Do not advertise these as supported. Existing redemption
reporting remains limited to recorded redemption counts and discount amounts.

### Deploying customer accounts and private assignments

1. Configure SMTP and a public `BACKEND_URL` so verification links reach the
   deployed backend. Keep marketing consent opt-in; no promotional messages
   are sent by this release.
2. Back up MongoDB, deploy backend changes, and run `npm run migrate` from
   `pos-backend` to sync the additive customer and assignment indexes.
3. Deploy both frontend applications with the backend. Customer accounts and
   assigned-coupon lookups use the storefront's existing `VITE_BACKEND_URL`.
4. Test registration, verification, sign-in, consent withdrawal, coupon
   assignment, assignment ownership, coupon checkout, and cancellation in a
   transaction-capable non-production database before production rollout.

Rollback is an application rollback; keep customer, assignment, and redemption
collections intact for audit. No existing order records are rewritten.

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
