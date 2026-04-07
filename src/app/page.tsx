"use client";
import { metrics, marketData, backtests, TAGLINES } from "./data/mock";

function fmt(v: number, prefix = "") {
  if (v >= 0) return `${prefix}${v.toLocaleString()}`;
  return `${prefix}${v.toLocaleString()}`;
}

export default function Dashboard() {
  const today = new Date();
  const tagline = TAGLINES[today.getDay()];

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-date">{today.toLocaleDateString("en-CA")} · Trading Dashboard</div>
        <h1 className="hero-title">📊 Quant-Alpha</h1>
        <p className="hero-tagline">"{tagline}"</p>
      </div>

      <div className="content">
        {/* Key Metrics */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Key Performance Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <div className="metric-card">
              <div className="metric-label">Sharpe Ratio</div>
              <div className="metric-value">{metrics.sharpe.toFixed(2)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Max Drawdown</div>
              <div className="metric-value red">{metrics.maxDrawdown.toFixed(1)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Win Rate</div>
              <div className="metric-value green">{metrics.winRate}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total P&L</div>
              <div className="metric-value green">${fmt(metrics.totalPnL)}</div>
            </div>
          </div>
        </div>

        {/* Market Prices */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Live Market Prices</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((m) => (
                  <tr key={m.symbol}>
                    <td style={{ fontWeight: 700, color: "var(--accent2)" }}>{m.symbol}</td>
                    <td style={{ color: "var(--muted2)" }}>{m.name}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>${m.price.toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`badge ${m.change >= 0 ? "green" : "red"}`}>
                        {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Backtests */}
        <div>
          <div className="section-title">Recent Backtests</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Strategy</th>
                  <th>Market</th>
                  <th style={{ textAlign: "right" }}>Sharpe</th>
                  <th style={{ textAlign: "right" }}>Max DD</th>
                  <th style={{ textAlign: "right" }}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {backtests.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td><span style={{ fontWeight: 600, color: "var(--accent2)" }}>{b.strategy}</span></td>
                    <td style={{ color: "var(--muted2)" }}>{b.market}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{b.sharpe.toFixed(2)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--red)" }}>{b.maxDD.toFixed(1)}%</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: b.pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                      ${b.pnl.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
