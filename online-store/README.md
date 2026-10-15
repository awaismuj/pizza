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

    location / {
        try_files $uri /index.html;
    }
}
```

(Then add SSL with `certbot --nginx -d genzpizza.online -d www.genzpizza.online`.)
