# GenZ Pizza Land — Online Store (genzpizza.online)

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

The public site includes a privacy policy at `/privacy`, a generated sitemap
at `/sitemap.xml`, and crawler rules at `/robots.txt`. Configure the static
host to serve `404.html` with an HTTP 404 status for unknown paths while
keeping `/` and `/privacy` mapped to the SPA entry point. SEO metadata and
canonical links are updated per route. The POS dashboard is a separate,
private app and is marked `noindex`.

## Deploying to genzpizza.online

1. `npm run build` — outputs static files to `dist/`.
2. Point the `genzpizza.online` domain's web server (nginx / Vercel /
   Netlify / whatever you use) at that `dist/` folder as a static site.
3. Make sure `VITE_BACKEND_URL` is set to your **public** backend URL
   (`https://apipos.muscatfood.com`) at build time — Vite bakes env vars
   into the build, so this can't be changed after the fact without
   rebuilding.
4. On the backend, `https://genzpizza.online` (and `www.`) are already
   allow-listed in CORS (`pos-backend/app.js`) — if you use a different
   domain, add it there too.

### Example nginx config

```nginx
server {
    listen 80;
    server_name genzpizza.online www.genzpizza.online;
    root /var/www/genzpizza-online/dist;
    index index.html;

    location = / {
        try_files /index.html =404;
    }

    location = /privacy {
        try_files /index.html =404;
    }

    location = /privacy/ {
        return 301 /privacy;
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

(Then add SSL with `certbot --nginx -d genzpizza.online -d www.genzpizza.online`.)
