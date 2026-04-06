import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
import json
import os


def equity_curve_chart(equity: pd.Series, oos_idx: int, title: str = "Equity Curve"):
    """Return a Plotly figure of the equity curve.
    equity: Series indexed by datetime
    oos_idx: integer index where out-of-sample starts
    """
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=equity.index, y=equity.values, mode='lines', name='Equity'))
    # vertical line
    if 0 <= oos_idx < len(equity):
        oos_date = equity.index[oos_idx]
        fig.add_vline(x=oos_date, line_dash='dash', line_color='red', annotation_text='OOS')
    # drawdown shading
    rolling_max = equity.cummax()
    drawdown = equity - rolling_max
    fig.add_trace(go.Scatter(x=equity.index, y=drawdown, fill='tozeroy', name='Drawdown',
                             fillcolor='rgba(255,0,0,0.2)', line=dict(color='rgba(255,0,0,0)'))
    fig.update_layout(title=title, xaxis_title='Date', yaxis_title='Equity')
    return fig


def trade_list_table(trades: pd.DataFrame):
    """Create a Plotly table from trades DataFrame.
    Expected columns: entry_time, exit_time, side, entry_price, exit_price, pnl_usd, pnl_pct, rsi_entry, duration, costs
    """
    header = dict(values=list(trades.columns), fill_color='paleturquoise', align='left')
    cells = dict(values=[trades[col] for col in trades.columns], fill_color='lavender', align='left')
    fig = go.Figure(data=[go.Table(header=header, cells=cells)])
    return fig


def monte_carlo_chart(simulations: np.ndarray):
    """Create a histogram of Monte Carlo simulation final portfolio values.
    simulations: 2D array (n_simulations, time_steps) of equity curves
    """
    final_vals = simulations[:, -1]
    percentiles = np.percentile(final_vals, [5, 25, 50, 75, 95])
    fig = go.Figure()
    fig.add_trace(go.Histogram(x=final_vals, nbinsx=50, name='Final Portfolio'))
    # add lines for percentiles
    for p, val in zip([5, 25, 50, 75, 95], percentiles):
        fig.add_vline(x=val, line_dash='dash', line_color='black', annotation_text=f'{p}th')
    fig.update_layout(title='Monte Carlo Simulation Outcomes', xaxis_title='Final Equity', yaxis_title='Count')
    return fig


def heatmap_chart(params: list, sharpe_matrix: np.ndarray):
    """Heatmap where params is a tuple/list of two parameter arrays.
    sharpe_matrix shape must match len(param1) x len(param2).
    """
    param1, param2 = params
    fig = go.Figure(data=go.Heatmap(z=sharpe_matrix, x=param2, y=param1, colorscale='Viridis'))
    fig.update_layout(title='Sharpe Ratio Heatmap', xaxis_title='Param 2', yaxis_title='Param 1')
    return fig


def performance_cards(metrics: dict):
    """Return HTML string for metric cards using Streamlit markdown.
    metrics: dict of metric name -> value
    """
    # Simple markdown table style cards
    html = "<div style='display:flex;flex-wrap:wrap;gap:10px;'>"
    for k, v in metrics.items():
        html += f"<div style='background:#f0f0f0;padding:10px;border-radius:8px;min-width:120px'>" \
                f"<strong>{k}</strong><br>{v}</div>"
    html += "</div>"
    return html


def monte_carlo(trades: pd.DataFrame, n_simulations: int = 1000):
    """Generate Monte Carlo equity curve simulations.
    trades: DataFrame containing at least a 'pnl_usd' column.
    Returns a numpy array of shape (n_simulations, len(trades)+1) where first column is starting equity (1.0).
    """
    pnl = trades['pnl_usd'].values
    n = len(pnl)
    sims = np.zeros((n_simulations, n + 1))
    sims[:, 0] = 1.0  # start capital
    for i in range(n_simulations):
        shuffled = np.random.permutation(pnl)
        sims[i, 1:] = np.cumprod(1 + shuffled / 1.0)  # simple assumption: capital * (1+return)
    return sims
