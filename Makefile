.PHONY: setup test lint run-api run-ui

setup:
	python -m venv .venv
	. .venv/bin/activate && pip install --upgrade pip && pip install -e .[dev]

test:
	pytest -q

lint:
	ruff check .

run-api:
	uvicorn trading_coach.api.app:app --reload

run-ui:
	streamlit run trading_coach/ui/streamlit_app.py
