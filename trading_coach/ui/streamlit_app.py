from __future__ import annotations

import pandas as pd
import requests
import streamlit as st

API_URL = st.secrets.get("api_url", "http://127.0.0.1:8000")

st.set_page_config(page_title="Trading Coach", layout="wide")
st.title("Trading Coach IBKR (Paper)")
st.caption("Aide à la décision court terme avec contrôle du risque. Aucune promesse de performance.")

col1, col2, col3 = st.columns(3)
health = requests.get(f"{API_URL}/health", timeout=3).json()
watchlist = requests.get(f"{API_URL}/watchlist", timeout=3).json()
risk = requests.get(f"{API_URL}/risk", timeout=3).json()

col1.metric("Status", health["status"])
col2.metric("Paper mode", str(health["paper_only"]))
col3.metric("Risk allowed", str(risk["allowed"]))

st.subheader("Watchlist & Regime")
regime_df = pd.DataFrame(
    [{"symbol": s, "regime": watchlist["regimes"].get(s, "unknown")} for s in watchlist["symbols"]]
)
st.dataframe(regime_df, use_container_width=True)

st.subheader("Trade Plans")
plans = requests.get(f"{API_URL}/trade-plans", timeout=3).json()
st.dataframe(pd.DataFrame(plans), use_container_width=True)

st.subheader("Signals")
signals = requests.get(f"{API_URL}/signals", timeout=3).json()
st.dataframe(pd.DataFrame(signals), use_container_width=True)

st.subheader("Journal")
journal = requests.get(f"{API_URL}/journal", timeout=3).json()
st.dataframe(pd.DataFrame(journal), use_container_width=True)
