from __future__ import annotations

import numpy as np
import pandas as pd


def compute_features(df: pd.DataFrame) -> pd.DataFrame:
    """Compute feature set used by strategies from OHLCV bars."""

    out = df.copy()
    out["ret_1"] = out["close"].pct_change(1)
    out["ret_5"] = out["close"].pct_change(5)
    out["ret_15"] = out["close"].pct_change(15)

    out["realized_vol_20"] = out["ret_1"].rolling(20).std() * np.sqrt(20)

    tr = pd.concat(
        [
            (out["high"] - out["low"]),
            (out["high"] - out["close"].shift(1)).abs(),
            (out["low"] - out["close"].shift(1)).abs(),
        ],
        axis=1,
    ).max(axis=1)
    out["atr_14"] = tr.rolling(14).mean()

    cum_pv = (out["close"] * out["volume"]).cumsum()
    cum_vol = out["volume"].cumsum().replace(0, np.nan)
    out["vwap"] = cum_pv / cum_vol
    out["dist_vwap"] = out["close"] - out["vwap"]
    mean_dist = out["dist_vwap"].rolling(30).mean()
    std_dist = out["dist_vwap"].rolling(30).std().replace(0, np.nan)
    out["dist_vwap_z"] = (out["dist_vwap"] - mean_dist) / std_dist

    out["rel_volume_20"] = out["volume"] / out["volume"].rolling(20).mean().replace(0, np.nan)
    out["spread_proxy_bps"] = ((out["high"] - out["low"]) / out["close"]).abs() * 10_000
    return out
