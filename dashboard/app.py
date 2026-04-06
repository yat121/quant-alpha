import streamlit as st
import os
import json
import pandas as pd
from pathlib import Path
from dashboard.charts import equity_curve_chart, trade_list_table, monte_carlo_chart, heatmap_chart, performance_cards, monte_carlo
from backtester.engine import Backtester
from strategies.rsi_strategy import RSI4HStrategy

st.set_page_config(page_title="Quant-Alpha Dashboard", layout="wide")
st.title("📊 Quant-Alpha Trading Dashboard")

# Helper to list strategies
def list_strategies():
    strat_dir = Path(__file__).parents[1] / "strategies"
    files = [f.stem for f in strat_dir.glob("*_strategy.py")]
    return sorted(files)

# Sidebar Settings
with st.sidebar:
    st.header("Settings")
    market = st.selectbox("Market", ["MNQ", "MHI"])
    strategy_name = st.selectbox("Strategy", list_strategies())
    is_months = st.slider("In-sample months", 3, 24, 14)
    oos_months = st.slider("Out-of-sample months", 1, 6, 2)
    load_results = st.checkbox("Load saved results JSON", value=False)
    if st.button("▶️ Run Backtest"):
        # Dynamically import the strategy class
        module_path = f"strategies.{strategy_name}"
        mod = __import__(module_path, fromlist=["*"])
        strategy_cls = getattr(mod, strategy_name.title().replace('_', ''), None)
        if strategy_cls is None:
            st.error(f"Strategy class not found in {module_path}")
        else:
            backtester = Backtester(market=market, strategy=strategy_cls(), is_months=is_months, oos_months=oos_months)
            results = backtester.run()
            st.session_state['results'] = results
            # Save to JSON for later loading
            out_dir = Path("reports")
            out_dir.mkdir(exist_ok=True)
            json_path = out_dir / f"results_{market}_{strategy_name}_{is_months}_{oos_months}.json"
            with open(json_path, "w") as f:
                json.dump(results, f, default=str)
            st.success(f"Backtest completed. Results saved to {json_path}")
    if load_results:
        json_files = list(Path('reports').glob('results_*.json'))
        if json_files:
            selected_file = st.selectbox("Select results file", [str(p) for p in json_files])
            with open(selected_file) as f:
                st.session_state['results'] = json.load(f)
        else:
            st.info("No result JSON files found.")

# Main content
if 'results' not in st.session_state:
    st.info("Run a backtest or load saved results to view the dashboard.")
    st.stop()

results = st.session_state['results']
# Assuming backtester returns a dict with keys: equity (list of (date, value)), trades (list of dicts), metrics (dict)
 equity_df = pd.DataFrame(results['equity']).set_index('date')
 trades_df = pd.DataFrame(results['trades'])
 metrics = results.get('metrics', {})

# Monte Carlo simulations
 sims = monte_carlo(trades_df, n_simulations=1000)

# Tabs
tab1, tab2, tab3, tab4 = st.tabs(["Equity Curve", "Trade List", "Performance", "Monte Carlo"])

with tab1:
    oos_idx = int(len(equity_df) * is_months / (is_months + oos_months))
    fig = equity_curve_chart(equity_df['equity'], oos_idx)
    st.plotly_chart(fig, use_container_width=True)

with tab2:
    fig = trade_list_table(trades_df)
    st.plotly_chart(fig, use_container_width=True)

with tab3:
    html = performance_cards(metrics)
    st.markdown(html, unsafe_allow_html=True)

with tab4:
    fig = monte_carlo_chart(sims)
    st.plotly_chart(fig, use_container_width=True)
