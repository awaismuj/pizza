# Repository Guide for AI Coding Agents

Read this file and the linked project documentation before making changes. This is a map and a set of working rules, not a replacement for the source code: verify current behavior in the repository because code, dependencies, and deployment settings can change.

## Project at a glance

GenZ Pizza Land is a restaurant ordering and operations system. It is a JavaScript monorepo with three separately installed applications:

| Directory | Role | Main technologies |
| --- | --- | --- |
| `pos-backend/` | Shared REST API, authentication, business rules, scheduled jobs | Node.js, Express, MongoDB, Mongoose |
| `pos-frontend/` | Admin and staff point-of-sale interface | React 18, Vite, React Router, Redux Toolkit, TanStack Query, Tailwind CSS |
| `online-store/` | Customer-facing ordering storefront | React 18, Vite; calls public endpoints on the shared backend |

The API is mounted under `/api` in `pos-backend/app.js`. Backend route files connect HTTP endpoints to controllers; controllers coordinate models and services. The frontend API client is `pos-frontend/src/https/`. The online store's API client is `online-store/src/api.js`.

## Main product areas

- POS order entry, tables, kitchen/order status, online order handling, billing and receipts.
- Menu, categories, deals, coupons, hero slides and Build Your Own offers.
- Inventory, ingredients, stock usage, expenses, profit reports and exports.
- Staff, attendance, HR/payroll, user management and role-based permissions.
- Customer registration/accounts, public menu browsing, coupon validation and online checkout.
- Payment integrations/configuration, branches and delivery/pickup fulfillment, reviews and reporting.

The poster maker and its image-generation endpoint were removed. Do not restore them unless explicitly requested.

## Important business rules

- Order prices and coupon eligibility/discounts must be validated and recalculated on the backend. Do not trust client-supplied totals.
- Coupon eligible item/category lists are inclusive allow-lists when populated; an empty eligible list means all. Exclusions take priority. Fixed discounts cannot exceed the eligible subtotal.
- Coupon discounts reduce sales, but do not reduce the inventory cost of goods consumed. Pending online coupon redemptions are reservations; completed redemptions are actual uses. Follow the existing order lifecycle and tests when changing this behavior.
- Profit revenue uses discounted sales before tax plus delivery fees. Tax collected is excluded from sales revenue. COGS is based on the captured order cost. Consult `pos-backend/utils/profitService.js` and `pos-backend/controllers/profitController.js` before editing profit calculations.
- Role and permission definitions are centralized in `pos-backend/utils/rbac.js`; preserve backend authorization as well as frontend tab visibility.
- Coupon checkout uses MongoDB transactions. See the coupon and deployment guidance in the root README before changing its persistence flow.

## Project documentation and setup

- [`README.md`](./README.md) is the primary source for environment setup, install/start/build steps, database setup, RBAC, coupons and deployment guidance. Prefer linking to it over copying its details here.
- [`pos-frontend/README.md`](./pos-frontend/README.md) documents POS-specific preview and UI behavior.
- [`online-store/README.md`](./online-store/README.md) documents storefront local setup and deployment.
- Use each app's `.env.example` for variable names. Keep actual `.env` values private.

Install dependencies from each app directory with `npm install`, then use the relevant commands:

| App | Development | Build | Tests / lint |
| --- | --- | --- | --- |
| `pos-backend/` | `npm run dev` | No build step | `npm test` (`node --test`) |
| `pos-frontend/` | `npm run dev` | `npm run build` | `npm run lint` |
| `online-store/` | `npm run dev` | `npm run build` | No test or lint script currently defined |

The backend also defines migration, seed and data-maintenance scripts. Inspect their implementation and target environment before running any script that changes data.

## Working rules

1. Before editing, inspect `git status`, the relevant source, callers, tests and documentation. Preserve all pre-existing user changes; never overwrite or discard unrelated work.
2. Make focused changes using existing patterns. Search for existing helpers and call sites before adding duplicate logic.
3. Do not delete or consolidate code merely because it looks duplicated. First establish whether each occurrence is used, check imports/routes/configuration/tests, and remove only when necessary for the requested change.
4. Keep this guide factual and concise. Update it only when architecture, commands, important business rules or security practices change; put detailed feature documentation in the relevant README or code docs.
5. Run the smallest relevant test, lint or build command. If a required runtime/dependency is unavailable, report that limitation instead of claiming validation passed.
6. Report changed files, behavior, validation performed and any remaining limitation clearly. Do not commit or merge unless requested.

## Security and data safety

- Never commit, print, copy into documentation, or send `.env` contents, tokens, passwords, signing keys, payment secrets, customer PII or production database data. Add only safe variable names/placeholders to examples.
- The backend configuration contains development fallbacks for secrets. Those are not safe production credentials: production must use unique, strong secrets from the deployment's secret manager/environment.
- Enforce authentication, role/permission checks, validation and safe error handling on the server. Do not expose private customer data or coupon codes in list/report responses unless the existing endpoint is explicitly designed to do so.
- Never run destructive commands, production migrations, database resets, seeders or bulk data updates without checking their effects and obtaining explicit user approval when data may be changed or lost.
- Avoid logging credentials, authentication headers, payment data or unnecessary personal information. Keep CORS and rate limits appropriately narrow; do not disable protections to make a request pass.
