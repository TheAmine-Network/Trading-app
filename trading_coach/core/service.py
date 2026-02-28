from __future__ import annotations

import asyncio
from collections import defaultdict

import pandas as pd
import structlog

from trading_coach.core.config import settings
from trading_coach.data.aggregation import BarAggregator
from trading_coach.data.ibkr_client import IBKRClient
from trading_coach.data.models import Bar, Signal, TradePlan
from trading_coach.risk.engine import RiskEngine
from trading_coach.storage.repository import Repository
from trading_coach.strategies.features import compute_features
from trading_coach.strategies.mean_reversion import mean_reversion_signal
from trading_coach.strategies.momentum import momentum_signal
from trading_coach.strategies.regime import classify_regime

logger = structlog.get_logger(__name__)


class TradingService:
    """Main orchestrator for market data, signals, and trade plans."""

    def __init__(self) -> None:
        self.client = IBKRClient()
        self.repo = Repository()
        self.risk = RiskEngine()
        self.aggregator = BarAggregator()
        self.latest_plans: list[TradePlan] = []
        self.latest_signals: list[Signal] = []
        self.market_state: dict[str, str] = {}
        self.history: dict[str, list[Bar]] = defaultdict(list)

    async def run(self) -> None:
        async for tick in self.client.stream_ticks(settings.watchlist):
            for timeframe in ["1m", "5m", "15m"]:
                bar = self.aggregator.update(tick, timeframe)
                if bar is not None:
                    await self.on_bar(bar)

    async def on_bar(self, bar: Bar) -> None:
        bars = self.history[bar.symbol]
        bars.append(bar)
        self.history[bar.symbol] = bars[-300:]
        if len(bars) < 40 or bar.timeframe != "1m":
            return

        df = pd.DataFrame([b.__dict__ for b in bars])
        df["high_20"] = df["high"].rolling(20).max().shift(1)
        df["low_20"] = df["low"].rolling(20).min().shift(1)
        feat = compute_features(df).dropna()
        if feat.empty:
            return
        row = feat.iloc[-1]

        regime = classify_regime(float(row["realized_vol_20"]), float(row["ret_5"]))
        self.market_state[bar.symbol] = regime

        sig = momentum_signal(bar.symbol, row)
        if sig is None and regime != "trend":
            sig = mean_reversion_signal(bar.symbol, row)
        if sig is None:
            return

        plan = self.risk.build_trade_plan(
            sig,
            last_price=float(row["close"]),
            atr=max(float(row.get("atr_14", 0.1)), 0.1),
            spread_proxy_bps=float(row["spread_proxy_bps"]),
        )
        self.latest_signals = [sig, *self.latest_signals][:100]
        self.latest_plans = [plan, *self.latest_plans][:100]

        await self.repo.add_signal(sig)
        await self.repo.add_trade_plan(plan)
        await self.repo.add_journal("trade_plan", f"{sig.symbol}:{sig.strategy}:{plan.quantity}")
        logger.info("trade_plan.created", symbol=sig.symbol, setup=sig.strategy, qty=plan.quantity)


async def start_background_service(service: TradingService) -> asyncio.Task:
    return asyncio.create_task(service.run())
