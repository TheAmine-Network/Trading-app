from __future__ import annotations

import numpy as np
import pandas as pd

from trading_coach.strategies.features import compute_features


def test_compute_features_columns_exist() -> None:
    n = 80
    close = np.linspace(100, 110, n)
    df = pd.DataFrame(
        {
            "ts": pd.date_range("2024-01-01", periods=n, freq="1min", tz="UTC"),
            "open": close - 0.2,
            "high": close + 0.4,
            "low": close - 0.5,
            "close": close,
            "volume": np.random.randint(1000, 3000, size=n),
        }
    )
    out = compute_features(df)
    expected = {"ret_1", "ret_5", "ret_15", "realized_vol_20", "atr_14", "vwap", "dist_vwap_z"}
    assert expected.issubset(set(out.columns))
