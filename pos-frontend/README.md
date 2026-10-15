# POS Frontend

## Local responsive preview

To preview the POS screens without a backend, create `.env.local` with:

```env
VITE_POS_DEMO=true
```

Then run `npm run dev` and open the local Vite URL. The preview uses a demo admin and sample orders/tables. It is development-only and read-only; production builds continue to use the configured API.

## POS music player

Manage the store playlist from **Dashboard → Music**. Paste a shared Google Drive folder link to open the folder and upload songs there, then add each song using its Google Drive file share link. Set the folder and each audio file to **Anyone with the link** access. The POS header keeps compact previous/play/next controls; playlist settings are saved in the current browser only.

Google Drive does not expose a shared folder's contents to the frontend without Drive API credentials or OAuth, so tracks must be added individually using their file links. Some Drive files may not stream in the browser; if playback fails, use a direct audio-hosting link or download the audio and host it with the POS site's static assets.
