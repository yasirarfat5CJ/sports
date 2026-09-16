import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app.main import app
from backend.app.core.database import Base, SessionLocal, engine
from backend.app.models.user import User
from backend.app.models.prediction import Prediction
from backend.app.models.student_profile import StudentProfile
from backend.app.core.security import hash_password, create_access_token

client = TestClient(app)

@pytest.fixture()
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_api_registration_and_duplicate_email(db_session):
    # Test successful registration
    response = client.post(
        "/auth/register",
        json={"name": "Test Student", "email": "student@example.com", "password": "Password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Registration successful"
    assert data["user"]["email"] == "student@example.com"
    assert data["user"]["role"] == "student"

    # Test duplicate email registration
    response2 = client.post(
        "/auth/register",
        json={"name": "Another Name", "email": "student@example.com", "password": "Password456"}
    )
    assert response2.status_code == 409
    assert "already registered" in response2.json()["detail"]

def test_api_login_valid_and_invalid(db_session):
    # Register a student
    client.post(
        "/auth/register",
        json={"name": "Test Student", "email": "student@example.com", "password": "Password123"}
    )

    # Test valid login
    response = client.post(
        "/auth/login",
        json={"email": "student@example.com", "password": "Password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@example.com"

    # Test invalid password login
    response_bad_pw = client.post(
        "/auth/login",
        json={"email": "student@example.com", "password": "WrongPassword"}
    )
    assert response_bad_pw.status_code == 401
    assert "Invalid credentials" in response_bad_pw.json()["detail"]

    # Test invalid email login
    response_bad_email = client.post(
        "/auth/login",
        json={"email": "nonexistent@example.com", "password": "Password123"}
    )
    assert response_bad_email.status_code == 401
    assert "Invalid credentials" in response_bad_email.json()["detail"]

def test_unauthenticated_request(db_session):
    # GET /auth/me without authorization header should return 401
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert "Missing authentication token" in response.json()["detail"]

def test_invalid_and_expired_jwt(db_session):
    # GET /auth/me with invalid token
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalidtoken"})
    assert response.status_code == 401
    assert "Invalid authentication token" in response.json()["detail"]

def test_inactive_user(db_session):
    # Register and manually set user as inactive
    user = User(
        name="Inactive Student",
        email="inactive@example.com",
        password_hash=hash_password("Password123"),
        role="student",
        is_active=False
    )
    db_session.add(user)
    db_session.commit()

    # Try login
    response = client.post(
        "/auth/login",
        json={"email": "inactive@example.com", "password": "Password123"}
    )
    assert response.status_code == 401

def test_role_authorization_and_forbidden(db_session):
    # Create a student and an admin
    student = User(
        name="Yasir Student",
        email="yasir@student.com",
        password_hash=hash_password("Password123"),
        role="student",
        is_active=True
    )
    admin = User(
        name="System Admin",
        email="sysadmin@example.com",
        password_hash=hash_password("Password123"),
        role="admin",
        is_active=True
    )
    db_session.add_all([student, admin])
    db_session.commit()

    student_token = create_access_token(student.id, "student")
    admin_token = create_access_token(admin.id, "admin")

    # Student accessing admin users endpoint should get 403
    response = client.get("/admin/users", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Admin access required" in response.json()["detail"]

    # Admin accessing admin users endpoint should get 200
    response_admin = client.get("/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert response_admin.status_code == 200
    assert len(response_admin.json()) == 2

def test_student_profile_endpoints(db_session):
    # Create a student
    student = User(
        name="Yasir Student",
        email="yasir@student.com",
        password_hash=hash_password("Password123"),
        role="student",
        is_active=True
    )
    db_session.add(student)
    db_session.commit()

    # Create profile
    profile = StudentProfile(
        user_id=student.id,
        attendance_pct=85.0,
        study_hours_week=10.0,
        assignment_score=75.0,
        internal_marks=70.0,
        prev_sem_cgpa=8.0,
        activity_score=60.0
    )
    db_session.add(profile)
    db_session.commit()

    token = create_access_token(student.id, "student")

    # GET /students/me
    response = client.get("/students/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["attendance_pct"] == 85.0

    # PUT /students/me with valid values
    response_update = client.put(
        "/students/me",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "attendance_pct": 95.0,
            "study_hours_week": 12.0
        }
    )
    assert response_update.status_code == 200
    assert response_update.json()["attendance_pct"] == 95.0
    assert response_update.json()["study_hours_week"] == 12.0

    # PUT /students/me with invalid feature values (out of bound)
    response_invalid = client.put(
        "/students/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"attendance_pct": 150.0} # Invalid attendance
    )
    assert response_invalid.status_code == 422

def test_data_isolation_between_students(db_session):
    # Create two students
    student_a = User(name="Student A", email="a@example.com", password_hash=hash_password("Password123"), role="student", is_active=True)
    student_b = User(name="Student B", email="b@example.com", password_hash=hash_password("Password123"), role="student", is_active=True)
    db_session.add_all([student_a, student_b])
    db_session.commit()

    token_a = create_access_token(student_a.id, "student")
    token_b = create_access_token(student_b.id, "student")

    # Post a prediction for Student A
    pred_data = {
        "attendance_pct": 90,
        "study_hours_week": 15,
        "assignment_score": 85,
        "internal_marks": 80,
        "prev_sem_cgpa": 8.2,
        "activity_score": 84
    }
    client.post("/predict", headers={"Authorization": f"Bearer {token_a}"}, json=pred_data)

    # Student B checks history, should be empty
    response_b = client.get("/predictions/history", headers={"Authorization": f"Bearer {token_b}"})
    assert response_b.status_code == 200
    assert len(response_b.json()) == 0

    # Student A checks history, should have 1 prediction
    response_a = client.get("/predictions/history", headers={"Authorization": f"Bearer {token_a}"})
    assert response_a.status_code == 200
    assert len(response_a.json()) == 1
    assert response_a.json()[0]["predicted_final_marks"] > 0

def test_what_if_and_history(db_session):
    # Create a student
    student = User(name="Student A", email="a@example.com", password_hash=hash_password("Password123"), role="student", is_active=True)
    db_session.add(student)
    db_session.commit()

    token = create_access_token(student.id, "student")

    # Valid simulation
    sim_data = {
        "current": {
            "attendance_pct": 70,
            "study_hours_week": 2,
            "assignment_score": 65,
            "internal_marks": 60,
            "prev_sem_cgpa": 6.2,
            "activity_score": 50
        },
        "what_if": {
            "attendance_pct": 85,
            "study_hours_week": 8,
            "assignment_score": 65,
            "internal_marks": 60,
            "prev_sem_cgpa": 6.2,
            "activity_score": 50
        }
    }
    response = client.post("/what-if", headers={"Authorization": f"Bearer {token}"}, json=sim_data)
    assert response.status_code == 200
    data = response.json()
    assert "current_prediction" in data
    assert "what_if_prediction" in data
    assert "predicted_change" in data
    assert data["predicted_change"] == round(data["what_if_prediction"] - data["current_prediction"], 2)
    assert "The trained model predicts an approximate change" in data["disclaimer"]

    # Verify history
    history_response = client.get("/what-if/history", headers={"Authorization": f"Bearer {token}"})
    assert history_response.status_code == 200
    assert len(history_response.json()) == 1
    assert history_response.json()[0]["predicted_change"] == data["predicted_change"]

    # Invalid feature values
    invalid_sim_data = {
        "current": {
            "attendance_pct": -10, # Invalid
            "study_hours_week": 2,
            "assignment_score": 65,
            "internal_marks": 60,
            "prev_sem_cgpa": 6.2,
            "activity_score": 50
        },
        "what_if": {
            "attendance_pct": 85,
            "study_hours_week": 8,
            "assignment_score": 65,
            "internal_marks": 60,
            "prev_sem_cgpa": 6.2,
            "activity_score": 50
        }
    }
    response_invalid = client.post("/what-if", headers={"Authorization": f"Bearer {token}"}, json=invalid_sim_data)
    assert response_invalid.status_code == 422
