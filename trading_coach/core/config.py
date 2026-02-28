from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Trading Coach IBKR"
    environment: str = "dev"

    ib_host: str = "127.0.0.1"
    ib_port: int = 7497
    ib_client_id: int = 12
    paper_only: bool = True

    database_url: str = "sqlite+aiosqlite:///./trading_coach.db"

    account_equity: float = 100_000.0
    risk_per_trade_pct: float = 0.005
    max_daily_loss_pct: float = 0.02
    max_open_positions: int = 3
    max_trades_per_day: int = 6
    loss_cooldown_minutes: int = 15

    watchlist: list[str] = Field(default_factory=lambda: ["SPY", "QQQ", "AAPL", "MSFT", "NVDA"])


settings = Settings()
