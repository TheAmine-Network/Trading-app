from __future__ import annotations

import pandas as pd

from trading_coach.data.models import Signal


def mean_reversion_signal(symbol: str, row: pd.Series) -> Signal | None:
    """VWAP z-score reversion with liquidity and spread checks."""

    z = row.get("dist_vwap_z", 0.0)
    if row.get("rel_volume_20", 0.0) < 0.8:
        return None
    if row.get("spread_proxy_bps", 999) > 30:
        return None

    if z <= -2.0:
        return Signal(
            symbol=symbol,
            ts=row["ts"],
            strategy="mean_reversion_vwap",
            score=min(1.0, 0.55 + abs(z) / 5),
            direction="long",
            reason="Price dislocated below VWAP (negative z-score)",
        )
    if z >= 2.0:
        return Signal(
            symbol=symbol,
            ts=row["ts"],
            strategy="mean_reversion_vwap",
            score=min(1.0, 0.55 + abs(z) / 5),
            direction="short",
            reason="Price dislocated above VWAP (positive z-score)",
        )
    return None
