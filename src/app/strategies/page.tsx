"use client";
import { useState } from "react";
import { strategies } from "../data/mock";

function StrategyCard({ strategy }: { strategy: typeof strategies[0] }) {
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(strategy.params.map(p => [p.label, p.value]))
  );
  const [running, setRunning] = useState(false);

  function runBacktest() {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  }

  return (
    <div className="strategy-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="strategy-title">{strategy.name}</div>
          <div className="strategy-desc">{strategy.desc}</div>
        </div>
        <span className="badge green">Active</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {strategy.params.map(p => (
          <div key={p.label}>
            <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {p.label}: <span style={{ color: "var(--accent2)", fontWeight: 600 }}>{params[p.label]}</span>
            </label>
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={params[p.label]}
              onChange={e => setParams({ ...params, [p.label]: parseFloat(e.target.value) })}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--muted)", marginTop: 2 }}>
              <span>{p.min}</span><span>{p.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btn-primary" onClick={runBacktest} disabled={running}>
          {running ? "⏳ Running..." : "▶ Run Backtest"}
        </button>
        <button className="btn btn-outline">💾 Save Strategy</button>
      </div>
    </div>
  );
}

export default function Strategies() {
  return (
    <>
      <div className="hero">
        <div className="hero-date">Configuration</div>
        <h1 className="hero-title">⚙️ Strategies</h1>
        <p className="hero-tagline">Configure and run algorithmic trading strategies</p>
      </div>

      <div className="content">
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Available Strategies</div>
          <p style={{ fontSize: "0.85rem", color: "var(--muted2)", marginBottom: 24 }}>
            Adjust parameters and run backtests. All strategies use walk-forward validation with out-of-sample testing.
          </p>
        </div>

        {strategies.map(s => (
          <StrategyCard key={s.id} strategy={s} />
        ))}

        {/* Custom Strategy Template */}
        <div style={{ marginTop: 24 }}>
          <div className="section-title">Custom Strategy</div>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🛠️</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Build Your Own Strategy</div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted2)", marginBottom: 20 }}>
              Create custom trading strategies with Pine Script, Python, or the visual strategy builder.
            </p>
            <button className="btn btn-outline">Coming Soon</button>
          </div>
        </div>
      </div>
    </>
  );
}
