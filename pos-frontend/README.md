# POS Frontend

## Local responsive preview

To preview the POS screens without a backend, create `.env.local` with:

```env
VITE_POS_DEMO=true
```

Then run `npm run dev` and open the local Vite URL. The preview uses a demo admin and sample orders/tables. It is development-only and read-only; production builds continue to use the configured API.

## POS music player

Manage the store playlist from **Dashboard → Music**. Paste a shared Google Drive folder link to open the folder and upload songs there, then add each song using its Google Drive file share link. Set the folder and each audio file to **Anyone with the link** access. The POS header keeps compact previous/play/next controls; playlist settings are saved in the current browser only.

Google Drive does not expose a shared folder's contents to the frontend without Drive API credentials or OAuth, so tracks must be added individually using their file links. Playback is streamed through the authenticated POS backend because Google Drive blocks direct cross-origin audio playback. Deploy the backend music-stream route along with the frontend for playback to work.

## WhatsApp coupon sending

The coupon campaign dialog includes an in-page single-customer WhatsApp sender.
Search using at least the last nine phone digits, choose an active standard
percentage coupon, review the approved-template preview, and send from the POS.
The backend checks customer marketing consent, coupon eligibility, and
WhatsApp Cloud API readiness before sending. Configure the production-only
Cloud API credentials and approved five-parameter template in the backend
environment; mock mode does not deliver messages. A manual email draft remains
available only after staff confirms email consent.

Use **Open WhatsApp Web window** to open the official WhatsApp Web site in a
separate, resizable browser window while keeping the POS page open behind it.
Allow pop-ups for the POS site if the browser blocks the window. WhatsApp Web
does not permit embedding its logged-in session inside the POS, and linking
WhatsApp Web does not replace the Cloud API configuration required by the
in-panel sender.
