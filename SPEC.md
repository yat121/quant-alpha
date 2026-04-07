# Quant-Alpha Trading Dashboard Specification

## Overview
A premium, dark‑theme trading dashboard built with Next.js (App Router) and Tailwind CSS. It provides a clean, responsive UI for viewing key performance metrics, backtest results, strategy configuration, and live market data.

## Color Palette (CSS Variables)
```css
:root {
  --color-bg: #0a0a0f;
  --color-accent: #6366f1;
  --color-card: #181824;
  --color-text-primary: #e5e7eb; /* Tailwind gray‑200 */
  --color-text-secondary: #9ca3af; /* Tailwind gray‑400 */
}
```

## Pages (App Router)
| Route | Description |
|-------|-------------|
| `/` | Overview: displays key metrics (Sharpe, max drawdown, win rate) and a quick market price ticker. |
| `/backtests` | Shows backtest results with an equity‑curve chart and a table of statistics. |
| `/strategies` | UI to configure strategy parameters (RSI, MACD, Bollinger Bands). Changes are stored locally (mock). |
| `/live` | Live market data view (mock for now, placeholder for IBKR integration). |

## Components
- **Layout** – shared dark layout with navigation sidebar and header.
- **MetricCard** – reusable card component for metrics with glow effect.
- **Chart** – wrapper around `recharts` (or `chart.js`) to render line/bar charts.
- **StrategyForm** – form with inputs for RSI, MACD, Bollinger parameters.
- **LocaleSwitcher** – toggle between English and Chinese.

## Data (mock)
- `data/overview.json` – sample metrics and price data.
- `data/backtest.json` – array of date‑price points for equity curve.
- `data/strategies.json` – default parameter values.
- `data/live.json` – placeholder live price feed.

## Tech Stack
- **Next.js** v14+ (App Router) – TypeScript
- **Tailwind CSS** – with custom CSS variables for theme
- **Recharts** – for interactive charts (fallback: Chart.js)
- **React Hook Form** – form handling in `/strategies`
- **i18next** – simple i18n for English/Chinese toggle

## Build Steps
1. `npm create next-app@latest dashboard --ts --app`
2. Install dependencies:
   ```bash
   cd dashboard
   npm i tailwindcss@latest postcss@latest autoprefixer@latest
   npm i recharts i18next react-i18next
   ```
3. Configure Tailwind and add CSS variables.
4. Implement pages and components using the mock data.
5. Run `npm run dev` to test locally.
6. Deploy with `vercel` (project will be detected automatically).

## Future Enhancements
- Replace mock data with real API calls to **yfinance** for market prices.
- Integrate **IBKR** SDK for live trading data and order execution.
- Add authentication and user‑specific settings.
- Implement chart zoom/pan and export functionality.

---
*Created by the sub‑agent for Desmond’s Quant‑Alpha project.*