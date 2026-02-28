from __future__ import annotations

from collections import defaultdict
from datetime import datetime

from trading_coach.data.models import Bar, Tick


class BarAggregator:
    """Aggregate ticks into OHLCV bars by timeframe in minutes."""

    def __init__(self) -> None:
        self.windows: dict[tuple[str, str], tuple[datetime, list[Tick]]] = defaultdict(tuple)

    def _bucket_time(self, ts: datetime, minutes: int) -> datetime:
        minute_bucket = ts.minute - (ts.minute % minutes)
        return ts.replace(second=0, microsecond=0, minute=minute_bucket)

    def update(self, tick: Tick, timeframe: str) -> Bar | None:
        minutes = int(timeframe.replace("m", ""))
        bucket = self._bucket_time(tick.ts, minutes)
        key = (tick.symbol, timeframe)
        current = self.windows.get(key)

        if not current:
            self.windows[key] = (bucket, [tick])
            return None

        current_bucket, ticks = current
        if bucket == current_bucket:
            ticks.append(tick)
            self.windows[key] = (current_bucket, ticks)
            return None

        finished = self._to_bar(tick.symbol, current_bucket, timeframe, ticks)
        self.windows[key] = (bucket, [tick])
        return finished

    @staticmethod
    def _to_bar(symbol: str, ts: datetime, timeframe: str, ticks: list[Tick]) -> Bar:
        prices = [t.price for t in ticks]
        volume = sum(t.size for t in ticks)
        return Bar(
            symbol=symbol,
            ts=ts,
            timeframe=timeframe,
            open=prices[0],
            high=max(prices),
            low=min(prices),
            close=prices[-1],
            volume=volume,
        )
