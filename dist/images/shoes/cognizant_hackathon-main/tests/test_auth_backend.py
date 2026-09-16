import pytest
from fastapi import HTTPException

from backend.app.core.database import Base, SessionLocal, engine
from backend.app.core.security import create_access_token, decode_access_token, verify_password
from backend.app.dependencies.auth import require_admin
from backend.app.models.prediction import Prediction
from backend.app.models.student_profile import StudentProfile
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, RegisterRequest
from backend.app.services.auth_service import authenticate_user, register_student
from backend.app.services.prediction_service import prediction_service


@pytest.fixture()
def db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_registration_hashes_password_and_creates_student_profile(db):
    user = register_student(
        db,
        RegisterRequest(
            name="Yasir",
            email="yasir@example.com",
            password="StrongPassword123",
        ),
    )

    assert user.role == "student"
    assert user.password_hash != "StrongPassword123"
    assert verify_password("StrongPassword123", user.password_hash)
    assert db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()


def test_login_jwt_and_invalid_password(db):
    register_student(
        db,
        RegisterRequest(name="Yasir", email="yasir@example.com", password="StrongPassword123"),
    )

    user, token = authenticate_user(
        db,
        LoginRequest(email="yasir@example.com", password="StrongPassword123"),
    )
    assert user is not None
    payload = decode_access_token(token)
    assert payload["sub"] == str(user.id)
    assert payload["role"] == "student"

    bad_user, bad_token = authenticate_user(
        db,
        LoginRequest(email="yasir@example.com", password="WrongPassword123"),
    )
    assert bad_user is None
    assert bad_token is None


def test_student_cannot_pass_admin_authorization(db):
    user = register_student(
        db,
        RegisterRequest(name="Yasir", email="yasir@example.com", password="StrongPassword123"),
    )
    with pytest.raises(HTTPException) as exc:
        require_admin(user)
    assert exc.value.status_code == 403


def test_prediction_is_scoped_to_user(db):
    user_a = register_student(
        db,
        RegisterRequest(name="A", email="a@example.com", password="StrongPassword123"),
    )
    user_b = register_student(
        db,
        RegisterRequest(name="B", email="b@example.com", password="StrongPassword123"),
    )
    db.add(
        Prediction(
            user_id=user_a.id,
            attendance_pct=90,
            study_hours_week=15,
            assignment_score=85,
            internal_marks=80,
            prev_sem_cgpa=8.2,
            activity_score=84,
            predicted_final_marks=83.19,
            model_name="Gradient Boosting",
        )
    )
    db.commit()

    user_b_predictions = db.query(Prediction).filter(Prediction.user_id == user_b.id).all()
    assert user_b_predictions == []


def test_prediction_service_and_what_if_math():
    current = {
        "attendance_pct": 70,
        "study_hours_week": 2,
        "assignment_score": 65,
        "internal_marks": 60,
        "prev_sem_cgpa": 6.2,
        "activity_score": 50,
    }
    what_if = {**current, "attendance_pct": 85, "study_hours_week": 8}

    current_result = prediction_service.predict(current)
    what_if_result = prediction_service.predict(what_if)
    predicted_change = round(
        what_if_result["predicted_final_marks"] - current_result["predicted_final_marks"],
        2,
    )

    assert 0 <= current_result["predicted_final_marks"] <= 100
    assert 0 <= what_if_result["predicted_final_marks"] <= 100
    assert predicted_change == round(predicted_change, 2)
