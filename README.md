# Quant-Alpha Trading System

## Overview
Quant-Alpha is a modular backtesting and analysis platform for futures markets (Micro Nasdaq **MNQ** and Hong Kong Tech Index **MHI**). It provides:
- A pure‑Python backtesting engine (no external backtesting libraries)
- Volume‑based slippage and realistic transaction cost models
- A suite of performance metrics (Sharpe, Sortino, drawdowns, etc.)
- Example strategies (RSI, MACD, custom template)
- An interactive Streamlit dashboard for visual analysis

## Architecture
```
quant-alpha/
├── README.md
├── requirements.txt
├── strategies/          # strategy implementations
├── backtester/          # engine, data, cost & metric modules
├── dashboard/           # Streamlit UI
├── agents/              # orchestration helpers
└── reports/             # templates for generated reports
```

## Getting Started
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run a backtest (example RSI on MNQ):
   ```bash
   python backtest.py --market MNQ --strategy rsi4h --months 14 --oos-months 2
   ```
   Results are saved under `reports/`.
3. Launch the dashboard:
   ```bash
   streamlit run dashboard/app.py
   ```
   Use the sidebar to select market, strategy, and time windows.

## Adding a New Strategy
Create a new file under `strategies/` that defines a class with an `on_bar(self, df, i)` method returning a `Signal`. See `rsi_strategy.py` for a template.

## Required Tools
- **IBKR** installed for live data (optional, fallback to CSV/YFinance)
- **Python 3.10+**
- **yfinance**, **pandas**, **numpy**, **plotly**, **streamlit**, **scipy**

Happy coding!