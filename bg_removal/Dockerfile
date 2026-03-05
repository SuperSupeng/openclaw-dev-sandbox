FROM python:3.11-slim AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry==1.8.5 && \
    poetry config virtualenvs.create false

WORKDIR /app

COPY pyproject.toml ./
RUN poetry install --no-root --no-interaction

COPY . .
RUN poetry install --no-interaction

# ---- test stage ----
FROM base AS test
RUN poetry install --with dev --no-interaction
CMD ["pytest", "-v"]

# ---- web stage ----
FROM base AS web
RUN chmod +x /app/start.sh
EXPOSE 5000 8000
CMD ["/app/start.sh"]