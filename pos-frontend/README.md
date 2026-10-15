# POS Frontend

## Local responsive preview

To preview the POS screens without a backend, create `.env.local` with:

```env
VITE_POS_DEMO=true
```

Then run `npm run dev` and open the local Vite URL. The preview uses a demo admin and sample orders/tables. It is development-only and read-only; production builds continue to use the configured API.

## Food Poster Maker

Admins can open **Poster Maker** from the dashboard, and a public guest version is available at `/poster-maker` without a POS account. It includes bundled CC0/public-domain food photos, item-specific Gemini image generation with six selectable art directions, poster typography styles, and PNG/JPG downloads. For live AI generation, create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY` in `pos-backend/.env`; never put it in frontend environment variables. Each item can be regenerated for a different composition. Source, creator, and license details for bundled photos are in [`public/poster-food/SOURCES.txt`](public/poster-food/SOURCES.txt). Google API quotas and possible charges depend on the selected account/model.
