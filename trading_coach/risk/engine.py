from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone, timedelta

from trading_coach.core.config import settings
from trading_coach.data.models import Signal, TradePlan


@dataclass(slots=True)
class RiskState:
    daily_pnl: float = 0.0
    open_positions: int = 0
    trades_today: int = 0
    last_loss_ts: datetime | None = None
    kill_switch: bool = False


class RiskEngine:
    """Non-negotiable risk checks and position sizing."""

    def __init__(self, equity: float | None = None) -> None:
        self.equity = equity or settings.account_equity
        self.state = RiskState()

    def allowed(self, data_stale: bool = False, feed_unstable: bool = False) -> tuple[bool, list[str]]:
        reasons: list[str] = []

        if settings.paper_only is not True:
            reasons.append("paper_only_violation")
        if self.state.kill_switch:
            reasons.append("kill_switch_active")
        if data_stale:
            reasons.append("data_stale")
        if feed_unstable:
            reasons.append("feed_unstable")
        if self.state.open_positions >= settings.max_open_positions:
            reasons.append("max_open_positions")
        if self.state.trades_today >= settings.max_trades_per_day:
            reasons.append("max_trades_per_day")

        max_loss = -self.equity * settings.max_daily_loss_pct
        if self.state.daily_pnl <= max_loss:
            reasons.append("max_daily_loss")

        if self.state.last_loss_ts:
            wait_until = self.state.last_loss_ts + timedelta(minutes=settings.loss_cooldown_minutes)
            if datetime.now(timezone.utc) < wait_until:
                reasons.append("cooldown_after_loss")

        return (len(reasons) == 0, reasons)

    def position_size(self, entry: float, stop: float) -> tuple[int, float]:
        risk_dollars = self.equity * settings.risk_per_trade_pct
        per_share = abs(entry - stop)
        if per_share <= 0:
            return 0, risk_dollars
        qty = int(risk_dollars // per_share)
        return max(qty, 0), risk_dollars

    def build_trade_plan(
        self,
        signal: Signal,
        last_price: float,
        atr: float,
        spread_proxy_bps: float,
        commission_per_share: float = 0.005,
        slippage_bps: float = 2.0,
    ) -> TradePlan:
        allowed, reasons = self.allowed()
        stop = last_price - atr if signal.direction == "long" else last_price + atr
        target = last_price + 2 * atr if signal.direction == "long" else last_price - 2 * atr
        qty, risk_dollars = self.position_size(last_price, stop)

        cost_per_share = commission_per_share + (last_price * (spread_proxy_bps + slippage_bps) / 10_000)
        cost_estimate = qty * cost_per_share

        if not allowed:
            qty = 0

        return TradePlan(
            symbol=signal.symbol,
            ts=signal.ts,
            setup_name=signal.strategy,
            score=signal.score,
            direction=signal.direction,
            entry_condition=f"Market if {signal.reason}",
            stop_price=stop,
            target_price=target,
            quantity=qty,
            risk_dollars=risk_dollars,
            cost_estimate=cost_estimate,
            confidence=min(0.95, 0.4 + signal.score * 0.5),
            no_trade_reasons=reasons,
        )
