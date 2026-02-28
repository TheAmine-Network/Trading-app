from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class Tick:
    symbol: str
    ts: datetime
    price: float
    size: float
    bid: float
    ask: float


@dataclass(slots=True)
class Bar:
    symbol: str
    ts: datetime
    timeframe: str
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass(slots=True)
class Signal:
    symbol: str
    ts: datetime
    strategy: str
    score: float
    direction: str
    reason: str


@dataclass(slots=True)
class TradePlan:
    symbol: str
    ts: datetime
    setup_name: str
    score: float
    direction: str
    entry_condition: str
    stop_price: float
    target_price: float
    quantity: int
    risk_dollars: float
    cost_estimate: float
    confidence: float
    no_trade_reasons: list[str]
