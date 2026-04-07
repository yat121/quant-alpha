export const TAGLINES = [
  "Build in public. Ship fast. Learn louder.",
  "The best time to plant a tree was yesterday.",
  "Focus on what matters. Ignore the rest.",
  "Stay curious, keep coding, embrace failure.",
  "Progress over perfection, every single day.",
  "Consistency beats intensity.",
  "Your future self will thank you."
];

export const metrics = {
  sharpe: 1.83,
  maxDrawdown: -12.4,
  winRate: 62,
  totalPnL: 4320,
  sortino: 2.1,
  profitFactor: 1.94,
};

export const marketData = [
  { symbol: "MNQ", name: "Micro E-mini Nasdaq", price: 18420.50, change: 0.82 },
  { symbol: "MHI", name: "Micro E-mini Dow", price: 4215.25, change: -0.14 },
  { symbol: "BTC", name: "Bitcoin", price: 67420.00, change: 2.34 },
  { symbol: "ETH", name: "Ethereum", price: 3520.00, change: 1.87 },
];

export const backtests = [
  {
    id: 1,
    strategy: "RSI4H",
    market: "MNQ",
    period: "14 months",
    sharpe: 1.83,
    sortino: 2.1,
    maxDD: -12.4,
    winRate: 62,
    profitFactor: 1.94,
    totalTrades: 87,
    pnl: 4320,
    date: "2026-04-06",
  },
  {
    id: 2,
    strategy: "MACD",
    market: "MNQ",
    period: "12 months",
    sharpe: 0.94,
    sortino: 1.2,
    maxDD: -18.2,
    winRate: 55,
    profitFactor: 1.45,
    totalTrades: 62,
    pnl: 2180,
    date: "2026-04-05",
  },
  {
    id: 3,
    strategy: "Bollinger Bands",
    market: "MHI",
    period: "10 months",
    sharpe: 1.15,
    sortino: 1.5,
    maxDD: -8.6,
    winRate: 68,
    profitFactor: 2.1,
    totalTrades: 54,
    pnl: 2890,
    date: "2026-04-04",
  },
];

export const trades = [
  { id: 1, date: "2026-04-06", type: "BUY", symbol: "MNQ", qty: 1, price: 18410, pnl: 120 },
  { id: 2, date: "2026-04-05", type: "SELL", symbol: "MNQ", qty: 1, price: 18320, pnl: -45 },
  { id: 3, date: "2026-04-04", type: "BUY", symbol: "MHI", qty: 2, price: 4205, pnl: 230 },
  { id: 4, date: "2026-04-03", type: "BUY", symbol: "MNQ", qty: 1, price: 18280, pnl: 0 },
  { id: 5, date: "2026-04-02", type: "SELL", symbol: "MNQ", qty: 1, price: 18295, pnl: 85 },
];

export const positions = [
  { symbol: "MNQ", qty: 1, entry: 18380, current: 18420.50, pnl: 40.50 },
];

export const strategies = [
  {
    id: "rsi",
    name: "RSI Strategy",
    desc: "Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought)",
    params: [
      { label: "RSI Period", value: 14, min: 7, max: 28, step: 1 },
      { label: "Overbought", value: 70, min: 60, max: 90, step: 5 },
      { label: "Oversold", value: 30, min: 10, max: 40, step: 5 },
    ],
  },
  {
    id: "macd",
    name: "MACD Strategy",
    desc: "Buy when MACD crosses above signal, sell when it crosses below",
    params: [
      { label: "Fast EMA", value: 12, min: 5, max: 20, step: 1 },
      { label: "Slow EMA", value: 26, min: 15, max: 50, step: 1 },
      { label: "Signal", value: 9, min: 5, max: 20, step: 1 },
    ],
  },
  {
    id: "bb",
    name: "Bollinger Bands",
    desc: "Buy at lower band, sell at upper band, with mean reversion logic",
    params: [
      { label: "Period", value: 20, min: 10, max: 50, step: 5 },
      { label: "Std Dev", value: 2, min: 1, max: 3, step: 0.5 },
    ],
  },
];

export const account = {
  balance: 28450.00,
  buyingPower: 56900.00,
  openPositions: 1,
  dayPnL: 120.50,
};
