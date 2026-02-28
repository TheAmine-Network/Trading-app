from datetime import datetime, timezone

from trading_coach.data.models import Signal
from trading_coach.risk.engine import RiskEngine


def test_trade_plan_contains_costs_and_reasons() -> None:
    engine = RiskEngine(equity=100_000)
    sig = Signal(
        symbol="SPY",
        ts=datetime.now(timezone.utc),
        strategy="momentum_breakout",
        score=0.8,
        direction="long",
        reason="test",
    )
    plan = engine.build_trade_plan(sig, last_price=100.0, atr=1.0, spread_proxy_bps=5.0)
    assert plan.quantity > 0
    assert plan.cost_estimate > 0
    assert isinstance(plan.no_trade_reasons, list)
