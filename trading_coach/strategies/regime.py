from __future__ import annotations


def classify_regime(realized_vol: float, trend_strength: float) -> str:
    """Simple regime classifier for trend/range/high-vol."""

    if realized_vol > 0.03:
        return "high_vol"
    if abs(trend_strength) > 0.002:
        return "trend"
    return "range"
