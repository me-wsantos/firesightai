# FireSight AI Front-End Documentation

FireSight AI Front-End is a web application for wildfire risk prediction and monitoring. It is built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com). The frontend visualizes predictive and historical wildfire data, provides interactive filtering, and integrates an AI chatbot for wildfire insights.

![fire-prediction]()

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 🗂️ Project Structure

- `app/`
  - `components/` – UI components (Map, Sidebar, Chatbot, etc.)
  - `context/` – React context for global state ([`app/context/appContext.tsx`](app/context/appContext.tsx))
  - `fonts/` – Custom fonts
  - `interfaces/` – TypeScript interfaces
  - `lib/` – Utility functions
  - `service/` – API service functions
  - `styles/` – Tailwind and global CSS
  - `utils/` – Utility helpers
  - `api/` – Next.js API routes (fire prediction, agents)
- `public/images/` – Static images and logos
- `asset/` – Project assets (architecture, presentations)
- `doc/` – Documentation (ML model, endpoint, chatbot, front-end)

---

## 🌍 Main Features

- **Interactive Map**
  - Predictive wildfire risk map ([`app/components/MapViewPredictive.tsx`](app/components/MapViewPredictive.tsx))
  - Historical fire data map ([`app/components/MapViewHistorical.tsx`](app/components/MapViewHistorical.tsx))
  - Clickable map for location-based prediction
  - Region selector for NASA FIRMS data

- **Sidebar Filters**
  - Date and time selection
  - Real-time weather and fire risk indicators
  - Meteorological variables display ([`app/components/FilterSidebar.tsx`](app/components/FilterSidebar.tsx))

- **AI Chatbot**
  - Embedded chatbot ([`app/components/chatbot/ChatBot.tsx`](app/components/chatbot/ChatBot.tsx))
  - Integrates with Microsoft Azure Bot Framework and Copilot Studio

- **Responsive UI**
  - Tailwind CSS with custom design tokens
  - Dark mode support

---

## 🔌 API Integrations

- **Fire Prediction:**  
  - [`app/api/fireForecast/route.ts`](app/api/fireForecast/route.ts)  
    Fetches weather data from Open-Meteo and predicts wildfire risk using an Azure ML endpoint.

- **Historical Fire Data:**  
  - Fetches recent fire events from NASA FIRMS API.

- **Chatbot:**  
  - [`app/components/chatbot/ChatBot.tsx`](app/components/chatbot/ChatBot.tsx)  
    Integrates with Azure Bot Service via Direct Line.

---

## 🧩 Key Components

- [`app/page.tsx`](app/page.tsx): Main page layout, map, sidebar, and chatbot
- [`app/components/MapViewPredictive.tsx`](app/components/MapViewPredictive.tsx): Predictive fire risk map
- [`app/components/MapViewHistorical.tsx`](app/components/MapViewHistorical.tsx): Historical fire data map
- [`app/components/FilterSidebar.tsx`](app/components/FilterSidebar.tsx): Sidebar with filters and prediction details
- [`app/components/chatbot/ChatBot.tsx`](app/components/chatbot/ChatBot.tsx): Embedded AI chatbot
- [`app/context/appContext.tsx`](app/context/appContext.tsx): Global state management

---

## ⚙️ Configuration

- **Environment Variables:**  
  - `NEXT_PUBLIC_DIRECT_LINE_SECRET` (for chatbot Direct Line)
  - `NEXT_PUBLIC_NASA_API_KEY` (for NASA FIRMS API)

- **Tailwind CSS:**  
  - Configured in [`tailwind.config.ts`](tailwind.config.ts) and [`app/styles/index.css`](app/styles/index.css)

---

## 🛠️ Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint code

---

## 📦 Main Dependencies

- Next.js, React, Tailwind CSS, Leaflet, Axios, Radix UI, Bot Framework WebChat, class-variance-authority, date-fns, openmeteo

---