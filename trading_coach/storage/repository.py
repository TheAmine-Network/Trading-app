from __future__ import annotations

from sqlalchemy import select

from trading_coach.data.models import Signal, TradePlan
from trading_coach.storage.db import JournalRow, SessionLocal, SignalRow, TradePlanRow


class Repository:
    async def add_signal(self, signal: Signal) -> None:
        async with SessionLocal() as session:
            session.add(
                SignalRow(
                    symbol=signal.symbol,
                    ts=signal.ts,
                    strategy=signal.strategy,
                    score=signal.score,
                    direction=signal.direction,
                    reason=signal.reason,
                )
            )
            await session.commit()

    async def add_trade_plan(self, plan: TradePlan) -> None:
        async with SessionLocal() as session:
            session.add(
                TradePlanRow(
                    symbol=plan.symbol,
                    ts=plan.ts,
                    setup_name=plan.setup_name,
                    score=plan.score,
                    direction=plan.direction,
                    quantity=plan.quantity,
                    stop_price=plan.stop_price,
                    target_price=plan.target_price,
                    risk_dollars=plan.risk_dollars,
                    cost_estimate=plan.cost_estimate,
                    no_trade_reasons=plan.no_trade_reasons,
                )
            )
            await session.commit()

    async def add_journal(self, event: str, payload: str) -> None:
        async with SessionLocal() as session:
            session.add(JournalRow(event=event, payload=payload))
            await session.commit()

    async def latest_signals(self, limit: int = 50) -> list[SignalRow]:
        async with SessionLocal() as session:
            rows = await session.execute(select(SignalRow).order_by(SignalRow.id.desc()).limit(limit))
            return list(rows.scalars())

    async def latest_plans(self, limit: int = 50) -> list[TradePlanRow]:
        async with SessionLocal() as session:
            rows = await session.execute(select(TradePlanRow).order_by(TradePlanRow.id.desc()).limit(limit))
            return list(rows.scalars())

    async def latest_journal(self, limit: int = 100) -> list[JournalRow]:
        async with SessionLocal() as session:
            rows = await session.execute(select(JournalRow).order_by(JournalRow.id.desc()).limit(limit))
            return list(rows.scalars())
