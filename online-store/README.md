# GenZ Pizza Land — Online Store (genzpizza.muscatfood.com)

A small, standalone customer-facing ordering site. It talks to the **same
backend** as the POS (`apipos.muscatfood.com`), using public, no-login
endpoints:

- `GET  /api/category/public`
- `GET  /api/dish/public`
- `POST /api/order/public/checkout`
- `GET  /api/order/public/:id`

Orders placed here land in the POS's normal orders collection with
`orderSource: "Online"` and `orderStatus: "Pending"`, and show up in the
POS's **Online Orders** tab (`/online-orders`) for staff to Accept/Cancel
and move through Preparing → Ready to Deliver → Completed. This app polls
`/api/order/public/:id` every 8s so the customer sees live status updates.

## Local setup

```bash
cd online-store
cp .env.example .env   # point VITE_BACKEND_URL at your backend
npm install
npm run dev
```

The public site includes customer help at `/help`, terms at `/terms`, a
privacy policy at `/privacy`, a sitemap at `/sitemap.xml`, and crawler rules
at `/robots.txt`. Configure the static host to serve `404.html` with an HTTP
404 status for unknown paths while keeping `/`, `/help`, `/terms`, and
`/privacy` mapped to the SPA entry point. SEO metadata and canonical links
are updated per route. The POS dashboard is a separate, private app and is
marked `noindex`.

Customer accounts created from the storefront are activated immediately and
signed in without email approval or verification. Their customer session is
limited to storefront account and ordering endpoints; it does not grant access
to POS or admin APIs. Customers may also continue to place orders without
creating an account.

To enable Google Analytics 4, set `VITE_GA_MEASUREMENT_ID` to the site's
measurement ID (format `G-...`) in the storefront environment before building.
The app sends a page view on the initial load and client-side route changes.
Leave it empty to disable analytics. Update the privacy policy if your data
practices change.

For indexing, verify `https://genzpizza.muscatfood.com` in Google Search
Console and submit `https://genzpizza.muscatfood.com/sitemap.xml` under
**Sitemaps**. The sitemap
lists the public home, help, terms, and privacy pages; `robots.txt` allows
crawling and points crawlers to that sitemap. Analytics does not submit pages
for indexing or guarantee when Google will index them.

## Deploying to genzpizza.muscatfood.com

1. `npm run build` — outputs static files to `dist/`.
2. Point the `genzpizza.muscatfood.com` domain's web server (nginx / Vercel /
   Netlify / whatever you use) at that `dist/` folder as a static site.
3. Make sure `VITE_BACKEND_URL` is set to your **public** backend URL
   (`https://apipos.muscatfood.com`) at build time — Vite bakes env vars
   into the build, so this can't be changed after the fact without
   rebuilding.
4. On the backend, `https://genzpizza.muscatfood.com` is already
   allow-listed in CORS (`pos-backend/app.js`) — if you use a different
   domain, add it there too.

### Example nginx config

```nginx
server {
    listen 80;
    server_name genzpizza.muscatfood.com;
    root /var/www/genzpizza-muscatfood/dist;
    index index.html;

    location = / {
        try_files /index.html =404;
    }

    location = /privacy {
        try_files /index.html =404;
    }

    location = /help {
        try_files /index.html =404;
    }

    location = /terms {
        try_files /index.html =404;
    }

    location = /privacy/ {
        return 301 /privacy;
    }

    location = /help/ {
        return 301 /help;
    }

    location = /terms/ {
        return 301 /terms;
    }

    location / {
        try_files $uri =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

(Then add SSL with `certbot --nginx -d genzpizza.muscatfood.com`.)
