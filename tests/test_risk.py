from trading_coach.risk.engine import RiskEngine


def test_position_size_uses_risk_budget() -> None:
    engine = RiskEngine(equity=100_000)
    qty, risk = engine.position_size(entry=100.0, stop=99.0)
    assert risk == 500.0
    assert qty == 500
