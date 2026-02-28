from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from trading_coach.core.config import settings
from trading_coach.core.logging import configure_logging
from trading_coach.core.service import TradingService, start_background_service
from trading_coach.storage.db import init_db
from trading_coach.storage.repository import Repository

configure_logging()
service = TradingService()
repo = Repository()
service_task = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global service_task
    await init_db()
    service_task = await start_background_service(service)
    yield
    if service_task:
        service_task.cancel()


app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)


@app.get("/health")
async def health() -> dict:
    return {
        "status": "ok",
        "paper_only": settings.paper_only,
        "watchlist_size": len(settings.watchlist),
    }


@app.get("/watchlist")
async def watchlist() -> dict:
    return {"symbols": settings.watchlist, "regimes": service.market_state}


@app.get("/signals")
async def signals() -> list[dict]:
    rows = await repo.latest_signals(50)
    return [
        {
            "symbol": r.symbol,
            "ts": r.ts,
            "strategy": r.strategy,
            "score": r.score,
            "direction": r.direction,
            "reason": r.reason,
        }
        for r in rows
    ]


@app.get("/trade-plans")
async def trade_plans() -> list[dict]:
    rows = await repo.latest_plans(50)
    return [
        {
            "symbol": r.symbol,
            "ts": r.ts,
            "setup_name": r.setup_name,
            "score": r.score,
            "direction": r.direction,
            "quantity": r.quantity,
            "stop_price": r.stop_price,
            "target_price": r.target_price,
            "risk_dollars": r.risk_dollars,
            "cost_estimate": r.cost_estimate,
            "no_trade_reasons": r.no_trade_reasons,
        }
        for r in rows
    ]


@app.get("/risk")
async def risk() -> dict:
    allowed, reasons = service.risk.allowed()
    return {
        "allowed": allowed,
        "reasons": reasons,
        "state": service.risk.state.__dict__,
        "limits": {
            "risk_per_trade_pct": settings.risk_per_trade_pct,
            "max_daily_loss_pct": settings.max_daily_loss_pct,
            "max_open_positions": settings.max_open_positions,
            "max_trades_per_day": settings.max_trades_per_day,
        },
    }


@app.get("/journal")
async def journal() -> list[dict]:
    rows = await repo.latest_journal(100)
    return [{"ts": r.ts, "event": r.event, "payload": r.payload} for r in rows]
