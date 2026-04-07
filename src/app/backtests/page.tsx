import fs from "fs";
import path from "path";

function getBacktestData() {
  try {
    const backtestDir = path.join(process.cwd(), "../../alpha-backtest");
    const files = fs.readdirSync(backtestDir).filter((f) => f.endsWith(".json"));
    if (files.length === 0) return null;
    const latestFile = files.sort().reverse()[0];
    return JSON.parse(fs.readFileSync(path.join(backtestDir, latestFile), "utf8"));
  } catch {
    return null;
  }
}

export default function Backtests() {
  const data = getBacktestData();

  // Determine if this is multi-period or single result
  const isMultiPeriod = data && data.results && Array.isArray(data.results);

  if (!data) {
    return (
      <div className="hero">
        <div className="hero-date">No Data</div>
        <h1 className="hero-title">📈 Backtest Results</h1>
        <p className="hero-tagline">Run a backtest first to see results here</p>
      </div>
    );
  }

  if (isMultiPeriod) {
    return <MultiPeriodBacktests data={data} />;
  }

  // Single backtest result (original format)
  const meta = data.metadata || {};
  const summary = data.summary || {};
  const testResults = data.test_results || {};

  return (
    <>
      <div className="hero">
        <div className="hero-date">{meta.symbol || "BTC/USDC"}</div>
        <h1 className="hero-title">📈 {meta.strategy || "RSI Reversal"} — {meta.symbol || "BTC/USDC"}</h1>
        <p className="hero-tagline">
          RSI {meta.rsi_low || 30}/{meta.rsi_high || 70} | {meta.period_days || 180} days
          ({meta.train_days || 0}d train / {meta.test_days || 0}d test) | Fee: {meta.taker_fee_pct?.toFixed(3) || 0.035}%
        </p>
      </div>

      <div className="content">
        {/* Metrics Goals */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Performance Metrics (Test Set)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Profit Factor</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: summary.avg_test_profit_factor > 1.75 ? "var(--green)" : "var(--red)" }}>
                {summary.avg_test_profit_factor?.toFixed(2) || "N/A"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Target: &gt; 1.75</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Sharpe Ratio</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: summary.avg_test_sharpe_ratio > 2.0 ? "var(--green)" : "var(--red)" }}>
                {summary.avg_test_sharpe_ratio?.toFixed(2) || "N/A"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Target: &gt; 2.0</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Max Drawdown</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: summary.avg_test_max_drawdown_pct < 15 ? "var(--green)" : "var(--red)" }}>
                {summary.avg_test_max_drawdown_pct?.toFixed(1) || "N/A"}%
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Target: &lt; 15%</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Recovery Factor</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: summary.recovery_factor > 3.0 ? "var(--green)" : "var(--red)" }}>
                {summary.recovery_factor?.toFixed(2) || "N/A"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Target: &gt; 3.0</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Total Profit</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: (summary.total_test_profit_pct || 0) >= 0 ? "var(--green)" : "var(--red)" }}>
                {(summary.total_test_profit_pct || 0) >= 0 ? "+" : ""}{summary.total_test_profit_pct?.toFixed(1) || "N/A"}%
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Test set</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div className="metric-label">Total Trades</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)" }}>
                {summary.total_test_trades || 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>Test set</div>
            </div>
          </div>
        </div>

        {/* Per Timeframe Results */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Per Timeframe Results (Test Set)</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>TF</th>
                  <th style={{ textAlign: "right" }}>Trades</th>
                  <th style={{ textAlign: "right" }}>Win%</th>
                  <th style={{ textAlign: "right" }}>Profit</th>
                  <th style={{ textAlign: "right" }}>PF</th>
                  <th style={{ textAlign: "right" }}>Sharpe</th>
                  <th style={{ textAlign: "right" }}>MDD</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(testResults).map(([tf, r]: [string, any]) => (
                  <tr key={tf}>
                    <td style={{ fontWeight: 600, color: "var(--accent2)" }}>{tf.toUpperCase()}</td>
                    <td style={{ textAlign: "right" }}>{r.total_trades || 0}</td>
                    <td style={{ textAlign: "right" }}>{(r.win_rate || 0).toFixed(1)}%</td>
                    <td style={{ textAlign: "right", color: (r.total_profit_pct || 0) >= 0 ? "var(--green)" : "var(--red)" }}>
                      {(r.total_profit_pct || 0) >= 0 ? "+" : ""}{(r.total_profit_pct || 0).toFixed(1)}%
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {(r.profit_factor || 0) > 100 ? "∞" : (r.profit_factor || 0).toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{(r.sharpe_ratio || 0).toFixed(2)}</td>
                    <td style={{ textAlign: "right", color: "var(--red)" }}>{(r.max_drawdown_pct || 0).toFixed(1)}%</td>
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

// Multi-period comparison view
function MultiPeriodBacktests({ data }: { data: any }) {
  const results = data.results || [];
  const periods = data.periods || [];
  const timeframes = data.timeframes || [];

  // Group by timeframe
  const byTimeframe: { [key: string]: any[] } = {};
  results.forEach((r: any) => {
    if (!byTimeframe[r.timeframe]) byTimeframe[r.timeframe] = [];
    byTimeframe[r.timeframe].push(r);
  });

  // Period labels
  const periodLabel = (days: number) => {
    if (days >= 1460) return "4Y";
    if (days >= 730) return "2Y";
    return "1Y";
  };

  // Best result finder
  const bestResult = results.reduce((best: any, r: any) => {
    if (!best) return r;
    // Prioritize by profit factor > 1.75, then by Sharpe
    const bestPF = (best.profit_factor || 0) > 1.75 ? 1 : 0;
    const rPF = (r.profit_factor || 0) > 1.75 ? 1 : 0;
    if (rPF > bestPF) return r;
    if (rPF === bestPF && (r.sharpe_ratio || 0) > (best.sharpe_ratio || 0)) return r;
    return best;
  }, null);

  return (
    <>
      <div className="hero">
        <div className="hero-date">BTC/USDC RSI {data.rsi_low}/{data.rsi_high}</div>
        <h1 className="hero-title">📊 Multi-Period Backtest Analysis</h1>
        <p className="hero-tagline">
          RSI Crossover Strategy | 70/30 train/test split | Fee: {data.taker_fee_pct?.toFixed(3) || 0.035}%
        </p>
      </div>

      <div className="content">
        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
          <div className="card" style={{ padding: "16px", border: "1px solid rgba(99,102,241,0.3)" }}>
            <div className="metric-label">Best Result</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--green)" }}>
              {bestResult ? `${bestResult.timeframe.toUpperCase()} ${periodLabel(bestResult.period_days)}` : "N/A"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
              PF: {bestResult?.profit_factor?.toFixed(2) || "N/A"}, Sharpe: {bestResult?.sharpe_ratio?.toFixed(2) || "N/A"}
            </div>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <div className="metric-label">Periods Tested</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent2)" }}>{periods.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>1Y, 2Y, 4Y</div>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <div className="metric-label">Timeframes</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent2)" }}>{timeframes.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>1H, 4H</div>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <div className="metric-label">Total Tests</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>{results.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>combined results</div>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Period Comparison (Test Set)</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>TF</th>
                  <th style={{ textAlign: "right" }}>Trades</th>
                  <th style={{ textAlign: "right" }}>Win%</th>
                  <th style={{ textAlign: "right" }}>Profit</th>
                  <th style={{ textAlign: "right" }}>PF</th>
                  <th style={{ textAlign: "right" }}>Sharpe</th>
                  <th style={{ textAlign: "right" }}>MDD</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r: any, i: number) => {
                  const pfPass = (r.profit_factor || 0) > 1.75;
                  const sharpePass = (r.sharpe_ratio || 0) > 2.0;
                  const mddPass = (r.max_drawdown_pct || 100) < 15;
                  const profitOk = (r.total_profit_pct || 0) > 0;
                  const allPass = pfPass && sharpePass && mddPass && profitOk;
                  
                  return (
                    <tr key={i} style={{ background: allPass ? "rgba(34,197,94,0.1)" : undefined }}>
                      <td style={{ fontWeight: 600 }}>{periodLabel(r.period_days)}</td>
                      <td style={{ fontWeight: 600, color: "var(--accent2)" }}>{r.timeframe.toUpperCase()}</td>
                      <td style={{ textAlign: "right" }}>{r.total_trades || 0}</td>
                      <td style={{ textAlign: "right" }}>{(r.win_rate || 0).toFixed(1)}%</td>
                      <td style={{ textAlign: "right", color: profitOk ? "var(--green)" : "var(--red)", fontFamily: "monospace" }}>
                        {profitOk ? "+" : ""}{(r.total_profit_pct || 0).toFixed(1)}%
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: pfPass ? "var(--green)" : "var(--red)" }}>
                        {(r.profit_factor || 0) > 1000 ? "∞" : (r.profit_factor || 0).toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: sharpePass ? "var(--green)" : "var(--red)" }}>
                        {(r.sharpe_ratio || 0) > 1000 ? "∞" : (r.sharpe_ratio || 0).toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: mddPass ? "var(--green)" : "var(--red)" }}>
                        {(r.max_drawdown_pct || 0).toFixed(1)}%
                      </td>
                      <td>
                        {allPass ? (
                          <span className="badge green">PASS</span>
                        ) : (
                          <span className="badge red">FAIL</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Comparison */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">Visual Comparison</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* Profit Chart */}
            <div className="card">
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>Total Profit (%)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {results.map((r: any, i: number) => {
                  const maxProfit = Math.max(...results.map((x: any) => Math.abs(x.total_profit_pct || 0)), 10);
                  const height = Math.abs(r.total_profit_pct || 0) / maxProfit * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ 
                        width: "100%", 
                        height: `${height}%`, 
                        minHeight: 4,
                        background: (r.total_profit_pct || 0) >= 0 ? "var(--green)" : "var(--red)",
                        borderRadius: 4,
                        transition: "height 0.3s"
                      }} />
                      <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{periodLabel(r.period_days)}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600 }}>{r.timeframe.toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profit Factor Chart */}
            <div className="card">
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>Profit Factor (target &gt; 1.75)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {results.map((r: any, i: number) => {
                  const maxPF = Math.max(...results.map((x: any) => x.profit_factor || 0), 2);
                  const height = Math.min(((r.profit_factor || 0) / maxPF) * 100, 100);
                  const color = (r.profit_factor || 0) > 1.75 ? "var(--green)" : "var(--red)";
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ 
                        width: "100%", 
                        height: `${Math.max(height, 5)}%`, 
                        minHeight: 4,
                        background: color,
                        borderRadius: 4,
                        transition: "height 0.3s"
                      }} />
                      <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{periodLabel(r.period_days)}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600 }}>{(r.profit_factor || 0) > 1000 ? "∞" : (r.profit_factor || 0).toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sharpe Ratio Chart */}
            <div className="card">
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>Sharpe Ratio (target &gt; 2.0)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {results.map((r: any, i: number) => {
                  const maxSharpe = Math.max(...results.map((x: any) => x.sharpe_ratio || 0), 3);
                  const height = Math.min(((r.sharpe_ratio || 0) / maxSharpe) * 100, 100);
                  const color = (r.sharpe_ratio || 0) > 2.0 ? "var(--green)" : "var(--red)";
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ 
                        width: "100%", 
                        height: `${Math.max(Math.abs(height), 5)}%`, 
                        minHeight: 4,
                        background: color,
                        borderRadius: 4,
                        transition: "height 0.3s"
                      }} />
                      <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{periodLabel(r.period_days)}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600 }}>{(r.sharpe_ratio || 0) > 1000 ? "∞" : (r.sharpe_ratio || 0).toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Max Drawdown Chart */}
            <div className="card">
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>Max Drawdown % (target &lt; 15%)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {results.map((r: any, i: number) => {
                  const maxDD = Math.max(...results.map((x: any) => x.max_drawdown_pct || 0), 30);
                  const height = ((r.max_drawdown_pct || 0) / maxDD) * 100;
                  const color = (r.max_drawdown_pct || 100) < 15 ? "var(--green)" : "var(--red)";
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ 
                        width: "100%", 
                        height: `${Math.max(height, 5)}%`, 
                        minHeight: 4,
                        background: color,
                        borderRadius: 4,
                        transition: "height 0.3s"
                      }} />
                      <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{periodLabel(r.period_days)}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600 }}>{(r.max_drawdown_pct || 0).toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="card" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 8 }}>📊 Key Insights</div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>
            {(() => {
              const profitable = results.filter((r: any) => (r.total_profit_pct || 0) > 0);
              const passing = results.filter((r: any) => (r.profit_factor || 0) > 1.75 && (r.sharpe_ratio || 0) > 2.0);
              
              let insight = `${profitable.length}/${results.length} periods showed positive returns. `;
              if (passing.length > 0) {
                const best = passing.reduce((a: any, b: any) => (a.sharpe_ratio || 0) > (b.sharpe_ratio || 0) ? a : b);
                insight += `${passing.length} met all targets. Best: ${best.timeframe.toUpperCase()} ${periodLabel(best.period_days)} with Sharpe ${best.sharpe_ratio?.toFixed(2)}. `;
              } else {
                insight += "No period met all targets simultaneously. ";
              }
              
              // Find trend
              const byPeriod: { [key: number]: number } = {};
              results.forEach((r: any) => {
                if (!byPeriod[r.period_days]) byPeriod[r.period_days] = 0;
                byPeriod[r.period_days] += r.total_profit_pct || 0;
              });
              
              const years = Object.keys(byPeriod).map(Number).sort();
              if (years.length >= 2) {
                const first = byPeriod[years[0]] || 0;
                const last = byPeriod[years[years.length - 1]] || 0;
                if (last < first) {
                  insight += `⚠️ Strategy performance degrades over longer periods (possibly due to regime changes).`;
                } else {
                  insight += `📈 Strategy performs better over longer periods.`;
                }
              }
              
              return insight;
            })()}
          </div>
        </div>

        {/* Metadata */}
        <div style={{ marginTop: 16, fontSize: "0.7rem", color: "var(--muted)", fontFamily: "monospace" }}>
          Strategy: {data.strategy} | RSI: {data.rsi_low}/{data.rsi_high} (period: {data.rsi_period || 14}) | Run: {data.run_at ? new Date(data.run_at).toLocaleString() : "N/A"}
        </div>
      </div>
    </>
  );
}
