"use client";
import { useState } from "react";
import { backtests, trades } from "../data/mock";

function fmt(v: number) {
  return (v >= 0 ? "+" : "") + v.toFixed(2);
}

export default function Backtests() {
  const equityCurve = [
    { date: "2025-01", equity: 10000 },
    { date: "2025-02", equity: 10250 },
    { date: "2025-03", equity: 10880 },
    { date: "2025-04", equity: 10640 },
    { date: "2025-05", equity: 11200 },
    { date: "2025-06", equity: 10920 },
    { date: "2025-07", equity: 11580 },
    { date: "2025-08", equity: 12200 },
    { date: "2025-09", equity: 11890 },
    { date: "2025-10", equity: 12540 },
    { date: "2025-11", equity: 13180 },
    { date: "2025-12", equity: 12820 },
    { date: "2026-01", equity: 13420 },
    { date: "2026-02", equity: 14010 },
    { date: "2026-03", equity: 14320 },
  ];

  return (
    <>
      <div className="hero">
        <div className="hero-date">Analytics</div>
        <h1 className="hero-title">📈 Backtest Results</h1>
        <p className="hero-tagline">Historical strategy performance and trade analysis</p>
      </div>

      <div className="content">
        {/* Equity Curve */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Equity Curve — RSI4H on MNQ</div>
          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* SVG chart */}
              <svg viewBox="0 0 800 200" style={{ width: "100%", height: 200 }}>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                {/* Area fill */}
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Path */}
                {(() => {
                  const min = Math.min(...equityCurve.map(e => e.equity));
                  const max = Math.max(...equityCurve.map(e => e.equity));
                  const range = max - min;
                  const pts = equityCurve.map((e, i) => {
                    const x = (i / (equityCurve.length - 1)) * 800;
                    const y = 200 - ((e.equity - min) / range) * 180 - 10;
                    return `${x},${y}`;
                  });
                  const area = `M0,200 L${pts.join(" L")} L800,200 Z`;
                  const line = `M${pts.join(" L")}`;
                  return (
                    <>
                      <path d={area} fill="url(#grad)" />
                      <path d={line} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
                      {equityCurve.map((e, i) => {
                        const x = (i / (equityCurve.length - 1)) * 800;
                        const y = 200 - ((e.equity - min) / range) * 180 - 10;
                        return <circle key={i} cx={x} cy={y} r="4" fill="#6366f1" />;
                      })}
                    </>
                  );
                })()}
                {/* Labels */}
                <text x="10" y="20" fill="#64748b" fontSize="11">$14,500</text>
                <text x="10" y="190" fill="#64748b" fontSize="11">$10,000</text>
                <text x="750" y="190" fill="#64748b" fontSize="11">Mar 2026</text>
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", padding: "0 4px" }}>
                <span>Jan 2025</span>
                <span>Dec 2025</span>
                <span>Mar 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Summary */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Performance Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "Sharpe Ratio", value: "1.83", color: "var(--accent2)" },
              { label: "Sortino Ratio", value: "2.10", color: "var(--accent2)" },
              { label: "Max Drawdown", value: "-12.4%", color: "var(--red)" },
              { label: "Win Rate", value: "62%", color: "var(--green)" },
              { label: "Profit Factor", value: "1.94", color: "var(--accent2)" },
              { label: "Total Trades", value: "87", color: "var(--text)" },
              { label: "Cost Impact", value: "$95.70", color: "var(--yellow)" },
              { label: "Total P&L", value: "+$4,320", color: "var(--green)" },
            ].map(m => (
              <div key={m.label} className="card" style={{ padding: "16px" }}>
                <div className="metric-label">{m.label}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color, marginTop: 6 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All Backtests */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">All Backtests</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Strategy</th>
                  <th>Market</th>
                  <th style={{ textAlign: "right" }}>Sharpe</th>
                  <th style={{ textAlign: "right" }}>Sortino</th>
                  <th style={{ textAlign: "right" }}>Max DD</th>
                  <th style={{ textAlign: "right" }}>Win Rate</th>
                  <th style={{ textAlign: "right" }}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {backtests.map(b => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td style={{ fontWeight: 600, color: "var(--accent2)" }}>{b.strategy}</td>
                    <td>{b.market}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{b.sharpe.toFixed(2)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{b.sortino.toFixed(2)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--red)" }}>{b.maxDD.toFixed(1)}%</td>
                    <td style={{ textAlign: "right" }}>{b.winRate}%</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: b.pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                      ${b.pnl.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade History */}
        <div>
          <div className="section-title">Recent Trades</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Symbol</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><span className={`badge ${t.type === "BUY" ? "blue" : "yellow"}`}>{t.type}</span></td>
                    <td style={{ fontWeight: 600, color: "var(--accent2)" }}>{t.symbol}</td>
                    <td style={{ textAlign: "right" }}>{t.qty}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>${t.price.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: t.pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl}
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
