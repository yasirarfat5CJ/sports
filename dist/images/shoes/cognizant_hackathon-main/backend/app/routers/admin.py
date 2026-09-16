from typing import Annotated

import pandas as pd
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.core.config import get_settings
from backend.app.core.database import get_db
from backend.app.dependencies.auth import require_admin
from backend.app.models.prediction import Prediction
from backend.app.models.user import User
from backend.app.schemas.user import UserResponse


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
def list_users(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/statistics")
def statistics(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    return {
        "users": db.query(func.count(User.id)).scalar(),
        "students": db.query(func.count(User.id)).filter(User.role == "student").scalar(),
        "admins": db.query(func.count(User.id)).filter(User.role == "admin").scalar(),
        "predictions": db.query(func.count(Prediction.id)).scalar(),
    }


@router.get("/model-metrics")
def model_metrics(_: Annotated[User, Depends(require_admin)]):
    settings = get_settings()
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
