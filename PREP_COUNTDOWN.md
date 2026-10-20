# Order preparation countdown, kitchen queue & Chef Pep alerts

**Backend** (`pos-backend`)
- `utils/prepTimer.js` (+ `prepTimer.test.js`): all rules - deadline, extensions, alert levels, settings validation, report maths.
- `services/prepAlertScheduler.js`: every 5s stamps "alert raised" once per level per deadline (atomic `updateMany`); also runs (throttled) inside `GET /api/order`.
- `models/orderModel.js`: new `prep` block (startedAt, durationMinutes, originalDeadline, deadline, readyAt, source, extensions[], totalExtensionMinutes, alerts{warn1,warn2,warn3,overdue}). Order creation time / source reuse `orderDate` / `orderSource`.
- `models/settingsModel.js` + `controllers/settingsController.js`: `orderPrep` settings (Admin-only PUT, existing route).
- `controllers/orderController.js`: stamps `prep` in `addOrder` (POS) and `addPublicOrder` (online); sets `prep.readyAt` when status becomes Ready / Ready to Deliver; new `extendPrepTime`, `getPrepReport`.
- `routes/orderRoute.js`: `PATCH /api/order/:id/prep/extend` (Admin/Cashier/Waiter), `GET /api/order/prep/report` (Admin/Cashier).
- No DB migration needed: new fields are optional; old orders simply have no timer and are never given invented timestamps.

**Frontend** (`pos-frontend/src`)
- `components/prep/`: `KitchenQueue` (Home), `PrepBadge`, `ExtendTimeModal`, `ChefMascot`, `PrepAlertCard`, `PrepAlertCenter` (mounted in `App.jsx`).
- `components/dashboard/PrepSettingsManager.jsx`: Dashboard > Settings > **Order Prep** (settings, mascot preview, performance report).
- Badges + Extend Time on `OrderCard` (dine-in/takeaway) and `OnlineOrders`.
- `utils/prepTimer.js`, `utils/prepSound.js`, `hooks/useNow.js` (one shared 1s ticker, no per-second requests), `hooks/usePrepSettings.js`.

**Testing alerts quickly**: Dashboard > Order Prep > "Preview Chef Pep alerts", or in development set `PREP_TEST_DURATION_SECONDS=90` in `pos-backend/.env` and place an order (see `.env.example`). Ignored in production.
