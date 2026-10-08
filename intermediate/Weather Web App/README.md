# Weather Web App

Location-based weather dashboard inspired by [roadmap.sh — Weather Web App](https://roadmap.sh/projects/weather-app).

Built with **React**, **Vite**, **TypeScript**, **Zustand**, and **Framer Motion**. Weather data comes from the [Visual Crossing Timeline API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/).

## Setup

1. Copy `.env.example` to `.env.local` and set your API key:

   ```bash
   cp .env.example .env.local
   ```

   Sign up for a free key at [Visual Crossing](https://www.visualcrossing.com/weather-api).

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

Build for production:

```bash
npm run build
npm run preview
```

## Features

- Search by city, address, postal code, or `latitude,longitude`
- **Current conditions**: temperature (°C), wind (km/h), rain likelihood (%), and summary (e.g. Sunny, Cloudy)
- **Past 24 hours** and **next 24 hours** hourly outlook (horizontal scroll)
- **Refresh** re-fetches the active location
- **Stretch**: on first load, requests browser geolocation and shows weather for your position when allowed
- **Stretch**: loading skeletons and animated transitions (Framer Motion)

Units use `unitGroup=metric` in [`src/api/visualCrossing.ts`](src/api/visualCrossing.ts). Change to `us` for °F and mph if you prefer.

## Project structure

```
src/
  api/visualCrossing.ts   # Timeline API client
  lib/weatherMapper.ts    # API → view model (current + ±24h)
  store/weatherStore.ts   # Zustand state
  hooks/                  # Geolocation on mount
  components/             # UI
  styles/global.css
```

## Manual test checklist

1. Set `VITE_VISUAL_CROSSING_API_KEY` in `.env.local`, then `npm run dev`
2. Allow location when prompted → current weather and hourly sections appear
3. Search `Seoul, KR` → resolved address, current stats, past/next 24h chips
4. Click **Refresh** → brief loading state and updated data
5. Search an invalid location or remove the API key → error banner
6. Deny geolocation → idle hint; manual search still works
7. `npm run build` succeeds

## Notes

The API key is exposed in the browser bundle (same pattern as Visual Crossing’s JavaScript guides). Restrict or rotate keys in your Visual Crossing account for production use.
