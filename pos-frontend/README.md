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

## Google Search in coupon campaigns

The WhatsApp coupon campaign dialog can show embedded Google search results.
Create a Google Programmable Search Engine, enable searching the entire web if
desired, and set its public Search engine ID (`cx`) as
`VITE_GOOGLE_CSE_ID` in the POS frontend environment before building. No Google
API key is needed for the embedded search widget. Search queries are sent
directly to Google. The panel's **Open WhatsApp Web** button launches the
official WhatsApp Web site in a new tab; WhatsApp does not allow its web app to
be embedded inside the POS dialog.

The Coupons page also provides **Send a coupon to one customer**. Search with
at least the last nine phone digits, choose an active coupon, and review the
message before opening a prefilled WhatsApp chat or email draft. These links
do not send automatically: staff must review and send the message in WhatsApp
Web or their configured mail app. WhatsApp coupon messages are disabled until
the customer's explicit marketing consent is recorded.
