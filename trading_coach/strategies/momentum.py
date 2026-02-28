from __future__ import annotations

import pandas as pd

from trading_coach.data.models import Signal


def momentum_signal(symbol: str, row: pd.Series) -> Signal | None:
    """Breakout momentum signal with volume and volatility filters."""

    if row.get("rel_volume_20", 0.0) < 1.2 or row.get("realized_vol_20", 0.0) < 0.005:
        return None

    if row["close"] > row["high_20"]:
        return Signal(
            symbol=symbol,
            ts=row["ts"],
            strategy="momentum_breakout",
            score=min(1.0, 0.5 + row["rel_volume_20"] / 4),
            direction="long",
            reason="Price breakout above 20-bar high with volume confirmation",
        )
    if row["close"] < row["low_20"]:
        return Signal(
            symbol=symbol,
            ts=row["ts"],
            strategy="momentum_breakout",
            score=min(1.0, 0.5 + row["rel_volume_20"] / 4),
            direction="short",
            reason="Price breakdown below 20-bar low with volume confirmation",
        )
    return None
