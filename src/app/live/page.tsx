"use client";
import { account, positions, marketData, trades } from "../data/mock";

export default function Live() {
  return (
    <>
      <div className="hero">
        <div className="hero-date">Real-Time</div>
        <h1 className="hero-title">🔴 Live Trading</h1>
        <p className="hero-tagline">Real-time market data and account status</p>
      </div>

      <div className="content">
        {/* Connection Status */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green)", display: "inline-block", boxShadow: "0 0 8px var(--green)" }} />
              <span style={{ color: "var(--green)" }}>Connected to IBKR</span>
            </span>
            <span className="badge" style={{ background: "var(--surface)", color: "var(--muted2)" }}>Paper Trading</span>
          </div>
        </div>

        {/* Account Summary */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Account Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "Balance", value: `$${account.balance.toLocaleString()}`, color: "var(--text)" },
              { label: "Buying Power", value: `$${account.buyingPower.toLocaleString()}`, color: "var(--accent2)" },
              { label: "Open Positions", value: account.openPositions.toString(), color: "var(--yellow)" },
              { label: "Day P&L", value: `${account.dayPnL >= 0 ? "+" : ""}$${account.dayPnL.toFixed(2)}`, color: account.dayPnL >= 0 ? "var(--green)" : "var(--red)" },
            ].map(a => (
              <div key={a.label} className="card" style={{ padding: "16px" }}>
                <div className="metric-label">{a.label}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: a.color, marginTop: 6 }}>{a.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Watchlist</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>Change</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map(m => (
                  <tr key={m.symbol}>
                    <td style={{ fontWeight: 700, color: "var(--accent2)" }}>{m.symbol}</td>
                    <td style={{ color: "var(--muted2)" }}>{m.name}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>${m.price.toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`badge ${m.change >= 0 ? "green" : "red"}`}>
                        {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change).toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-outline" style={{ padding: "4px 12px", fontSize: "0.75rem" }}>Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Positions */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Open Positions</div>
          {positions.length > 0 ? (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th style={{ textAlign: "right" }}>Qty</th>
                    <th style={{ textAlign: "right" }}>Entry</th>
                    <th style={{ textAlign: "right" }}>Current</th>
                    <th style={{ textAlign: "right" }}>P&L</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(p => (
                    <tr key={p.symbol}>
                      <td style={{ fontWeight: 700, color: "var(--accent2)" }}>{p.symbol}</td>
                      <td style={{ textAlign: "right" }}>{p.qty}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace" }}>${p.entry.toLocaleString()}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace" }}>${p.current.toLocaleString()}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: p.pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                        {p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-outline" style={{ padding: "4px 12px", fontSize: "0.75rem", color: "var(--red)" }}>Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ color: "var(--muted)" }}>No open positions</div>
            </div>
          )}
        </div>

        {/* Recent Trades */}
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
