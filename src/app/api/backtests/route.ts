import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const backtestDir = path.join(process.cwd(), "../../../alpha-backtest");
    const files = fs.readdirSync(backtestDir).filter((f) => f.endsWith(".json"));

    if (files.length === 0) {
      return NextResponse.json(null);
    }

    // Get latest file
    const latestFile = files.sort().reverse()[0];
    const data = JSON.parse(fs.readFileSync(path.join(backtestDir, latestFile), "utf8"));

    const result = {
      filename: latestFile,
      strategy: data.metadata?.strategy || "RSI Reversal",
      market: data.metadata?.symbol || "BTC/USDC",
      metadata: {
        symbol: data.metadata?.symbol || "BTC/USDC",
        rsi_low: data.metadata?.rsi_low || 30,
        rsi_high: data.metadata?.rsi_high || 70,
        period_days: data.metadata?.period_days || 180,
        train_days: data.metadata?.train_days || 126,
        test_days: data.metadata?.test_days || 54,
        taker_fee_pct: data.metadata?.taker_fee_pct || 0.035,
        run_at: data.metadata?.run_at || new Date().toISOString(),
      },
      summary: data.summary || {
        total_test_trades: 0,
        total_test_profit_pct: 0,
        avg_test_profit_factor: 0,
        avg_test_sharpe_ratio: 0,
        avg_test_max_drawdown_pct: 0,
        recovery_factor: 0,
      },
      test_results: data.test_results || {},
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error reading backtest:", error);
    return NextResponse.json(null);
  }
}
