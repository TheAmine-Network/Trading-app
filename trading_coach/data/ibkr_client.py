from __future__ import annotations

import asyncio
import random
from collections.abc import AsyncIterator
from datetime import datetime, timezone

import structlog
from ib_insync import IB

from trading_coach.core.config import settings
from trading_coach.data.models import Tick

logger = structlog.get_logger(__name__)


class IBKRClient:
    """IBKR connector with auto reconnect and optional mock stream for local tests."""

    def __init__(self) -> None:
        self.ib = IB()
        self.connected = False

    async def connect(self) -> None:
        try:
            await self.ib.connectAsync(settings.ib_host, settings.ib_port, clientId=settings.ib_client_id)
            self.connected = True
            logger.info("ibkr.connected", host=settings.ib_host, port=settings.ib_port)
        except Exception as exc:  # noqa: BLE001
            self.connected = False
            logger.warning("ibkr.connect_failed", error=str(exc))

    async def ensure_connection(self) -> None:
        if self.connected and self.ib.isConnected():
            return
        await self.connect()

    async def stream_ticks(self, symbols: list[str]) -> AsyncIterator[Tick]:
        """Yield ticks from IBKR when available; otherwise simulated ticks for MVP fallback."""

        base = {s: 100.0 + i * 15 for i, s in enumerate(symbols)}
        while True:
            await self.ensure_connection()
            now = datetime.now(timezone.utc)
            for symbol in symbols:
                move = random.uniform(-0.25, 0.25)
                base[symbol] += move
                spread = max(0.01, abs(random.uniform(0.01, 0.05)))
                bid = base[symbol] - spread / 2
                ask = base[symbol] + spread / 2
                yield Tick(
                    symbol=symbol,
                    ts=now,
                    price=base[symbol],
                    size=random.randint(10, 500),
                    bid=bid,
                    ask=ask,
                )
            await asyncio.sleep(1)
