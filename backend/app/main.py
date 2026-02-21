from fastapi import FastAPI
from app.core.config import settings
from app.api.v1 import auth, tasks
from app.core.logging_config import setup_logging
import logging


setup_logging()
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title="PrimeTrade Backend API",
        version="1.0.0",
        description="Scalable REST API with JWT authentication and role-based access control",
    )

    app.include_router(auth.router, prefix=settings.API_V1_STR)
    app.include_router(tasks.router, prefix=settings.API_V1_STR)

    return app


app = create_app()
@app.get("/health")
def health_check():
    return {"status": "healthy"}

logger.info("Application startup complete")