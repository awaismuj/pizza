# POS Frontend

## Local responsive preview

To preview the POS screens without a backend, create `.env.local` with:

```env
VITE_POS_DEMO=true
```

Then run `npm run dev` and open the local Vite URL. The preview uses a demo admin and sample orders/tables. It is development-only and read-only; production builds continue to use the configured API.

## Food Poster Maker

Admins can open **Poster Maker** from the dashboard, and a public guest version is available at `/poster-maker` without a POS account. It includes bundled CC0/public-domain food photos, item-specific OpenAI image generation with six selectable art directions, poster typography styles, and PNG/JPG downloads. For live AI generation, create an API key in the [OpenAI API dashboard](https://platform.openai.com/api-keys) and set `OPENAI_API_KEY` in `pos-backend/.env`; never put it in frontend environment variables. The default image model is `gpt-image-2.5-sunburst` and can be changed with `OPENAI_IMAGE_MODEL`. Each item can be regenerated for a different composition. OpenAI API access and usage are billed separately from ChatGPT subscriptions; check your account's billing and usage limits. Source, creator, and license details for bundled photos are in [`public/poster-food/SOURCES.txt`](public/poster-food/SOURCES.txt).
