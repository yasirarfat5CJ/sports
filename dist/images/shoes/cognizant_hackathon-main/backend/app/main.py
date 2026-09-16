from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.app.core.config import get_settings
from backend.app.core.database import Base, engine
from backend.app.models import Prediction, StudentProfile, User, WhatIfPrediction
from backend.app.routers import admin, auth, predictions, students, what_if
from backend.app.services.prediction_service import prediction_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # For hackathon/dev convenience. In production, run Alembic migrations instead.
    Base.metadata.create_all(bind=engine)
    prediction_service.load_model()

    # Seed default admin if none exists
    from backend.app.core.database import SessionLocal
    from backend.app.models.user import User
    from backend.app.core.security import hash_password

    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.role == "admin").first()
        if not admin_user:
            default_admin = User(
                name="System Admin",
                email="admin@example.com",
                password_hash=hash_password("AdminPassword123"),
                role="admin",
                is_active=True
            )
            db.add(default_admin)
            db.commit()
    except Exception as e:
        print("Failed to seed default admin user:", e)
    finally:
        db.close()

    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="EduPredict AI API",
        description="Secure Student Marks Prediction API with JWT auth and MySQL support.",
        version="2.0.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(students.router)
    app.include_router(predictions.router)
    app.include_router(what_if.router)
    app.include_router(admin.router)

    @app.get("/")
    def health_check():
        return {
            "status": "online",
            "app_name": "EduPredict AI",
            "message": "Secure prediction API is running.",
        }

    @app.get("/metrics")
    def public_metrics():
        models = []
        feature_importance = []
        if settings.comparison_path.exists():
            models = pd.read_csv(settings.comparison_path).to_dict(orient="records")
        if settings.importance_path.exists():
            feature_importance = pd.read_csv(settings.importance_path).to_dict(orient="records")
        return {
            "selected_model": settings.model_name,
            "models": models,
            "feature_importance": feature_importance,
        }

    return app


app = create_app()
