# Trading Coach IBKR (MVP)

> **Avertissement**: ce projet est un outil logiciel d'aide à la décision (paper trading). Il ne fournit ni conseil financier personnalisé ni garantie de gains.

## 1) Architecture détaillée

### Diagramme texte

```text
                 +---------------------------+
                 |        Streamlit UI       |
                 | watchlist/signals/risk    |
                 +-------------+-------------+
                               |
                               v
+-------------------+   REST   +-----------------------------+
| Operator / Trader | <------> | FastAPI backend             |
+-------------------+           | /health /signals /risk ... |
                                +-------------+---------------+
                                              |
                                              v
                                +-------------+---------------+
                                | TradingService (async loop) |
                                | - ingestion ticks           |
                                | - bars 1m/5m/15m            |
                                | - features live             |
                                | - stratégies                |
                                | - régime                    |
                                | - risk engine               |
                                +------+------+---------------+
                                       |      |
                                       |      +--> SQLite (signals/plans/journal)
                                       |
                                       +--> IBKR connector (ib_insync)
                                            - reconnect
                                            - paper trading only
```

### Modules
- `trading_coach/data/ibkr_client.py`: connexion IBKR, reconnexion, stream ticks (fallback simulé pour dev).
- `trading_coach/data/aggregation.py`: agrégation OHLCV sur 1m/5m/15m.
- `trading_coach/strategies/features.py`: returns multi-horizons, vol réalisée, ATR, VWAP, z-score VWAP, volume relatif, spread proxy.
- `trading_coach/strategies/momentum.py`: breakout avec filtres vol/volume.
- `trading_coach/strategies/mean_reversion.py`: retour vers VWAP via z-score.
- `trading_coach/strategies/regime.py`: classifieur simple trend/range/high-vol.
- `trading_coach/risk/engine.py`: sizing risk-based + limites (perte max, cooldown, kill switch).
- `trading_coach/storage/*`: persistance SQLite via SQLAlchemy.
- `trading_coach/api/app.py`: API FastAPI avec endpoints demandés.
- `trading_coach/ui/streamlit_app.py`: UI minimaliste.

## 2) Arborescence du repo

```text
.
├── README.md
├── pyproject.toml
├── trading_coach
│   ├── api/app.py
│   ├── core/{config.py,logging.py,service.py}
│   ├── data/{models.py,ibkr_client.py,aggregation.py}
│   ├── strategies/{features.py,momentum.py,mean_reversion.py,regime.py}
│   ├── risk/engine.py
│   ├── storage/{db.py,repository.py}
│   └── ui/streamlit_app.py
└── tests
    ├── test_features.py
    ├── test_risk.py
    └── test_trade_plan.py
```

## 3) Plan MVP en 7 jours

- **Jour 1**: bootstrap repo, config env, logging structuré, base FastAPI.
- **Jour 2**: connecteur IBKR paper + reconnexion + watchdog data feed.
- **Jour 3**: agrégation bars + pipeline features temps réel.
- **Jour 4**: stratégies momentum + mean reversion + filtre de régime.
- **Jour 5**: moteur risk (sizing, limites journalières, cooldown, kill-switch).
- **Jour 6**: persistance SQLite + endpoints API + journalisation décisions.
- **Jour 7**: UI Streamlit + tests + documentation runbook.

## 4) MVP fonctionnel (contenu code)

Fonctions présentes:
- connecteur IBKR (`ib_insync`) et boucle asyncio,
- agrégation bars 1m/5m/15m,
- calcul features live,
- stratégie momentum + mean reversion,
- régime simple,
- risk engine + sizing,
- persistance SQLite,
- API FastAPI: `/health`, `/watchlist`, `/signals`, `/trade-plans`, `/risk`, `/journal`,
- UI Streamlit.

## 5) Tests

Les tests unitaires couvrent:
- calcul de features,
- position sizing,
- génération de trade plan avec coûts et contraintes.

## 6) Guide d'exécution

### Prérequis
- Python 3.11+
- IB Gateway ou TWS configuré en **paper account**.
- Activer API officielle IBKR (socket localhost).

### Installation
```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
```

### Configuration
Créer `.env` (exemple):
```env
IB_HOST=127.0.0.1
IB_PORT=7497
IB_CLIENT_ID=12
PAPER_ONLY=true
ACCOUNT_EQUITY=100000
RISK_PER_TRADE_PCT=0.005
MAX_DAILY_LOSS_PCT=0.02
```

### Lancer backend
```bash
uvicorn trading_coach.api.app:app --reload
```

### Tester rapidement dans cet environnement
```bash
make setup
source .venv/bin/activate
pytest -q
uvicorn trading_coach.api.app:app --reload
# Dans un autre terminal
streamlit run trading_coach/ui/streamlit_app.py
```

- Vérifier l’API: `curl http://127.0.0.1:8000/health`
- Si IB Gateway/TWS n’est pas lancé, le connecteur utilise un fallback simulé pour permettre un test local du pipeline.

### Lancer UI
```bash
streamlit run trading_coach/ui/streamlit_app.py
```

### Ajouter des symboles
- Modifier `watchlist` dans `trading_coach/core/config.py` ou via variable d'env si extension ajoutée.

### Logs
- Logs JSON via `structlog`.
- Événements clés: connexion IB, création trade plan, erreurs de feed.

## 7) Limitations & Next steps

### Limites actuelles
- Fallback simulation ticks si IB indisponible (utile dev, pas un backtest institutionnel).
- Coûts d'exécution simplifiés (spread/slippage heuristiques).
- Pas de L2/order-book, pas de calendrier earnings intégré.
- Régime basé sur règles simples (pas HMM/Kalman).

### Erreurs potentielles
- **Data quality**: trous de marché, timestamps, latence farms IB.
- **Slippage**: sous-estimation en période volatile.
- **Overfitting**: réglage des seuils sans validation walk-forward robuste.
- **Look-ahead bias**: à surveiller lors d'extensions backtest.

### Prochaines étapes
- L2 microstructure + estimateur de coût plus réaliste.
- Backtest évènementiel + walk-forward + stress testing.
- Régime HMM/Kalman + calibration bayésienne d'incertitude.
- Mode Phase 2: recommandations live avec exécution manuelle.
- Phase 3 (optionnelle explicite): autotrading avec garde-fous renforcés.
