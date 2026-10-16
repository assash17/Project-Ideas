# 24hr Story Feature

Client-side Instagram-style stories clone ([roadmap.sh project](https://roadmap.sh/projects/stories-feature)).

## Features

- Horizontal story rail with **+** to upload images
- Images resized to max **1080×1920**, stored as **base64** in **localStorage**
- Stories expire after **24 hours** (checked on load and every minute)
- Full-screen viewer with swipe, arrow keys, and on-screen navigation

## Run locally

```bash
npm install
npm run dev
```

## Scripts

- `npm run build` — production build
- `npm run lint` — oxlint
- `npm run preview` — preview production build
