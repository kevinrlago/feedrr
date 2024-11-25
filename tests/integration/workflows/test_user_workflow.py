# tests/integration/test_user_workflow.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.core.config import CONFIG
from sqlalchemy.orm import Session

client = TestClient(app)

@pytest.fixture(scope="function")
def test_user(db: Session):
    """Create a test user"""
    user = User(
        username="testuser",
        email="testuser@example.com",
        password="testpassword123"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    yield user
    db.delete(user)
    db.commit()

def test_user_registration():
    """Test user registration workflow"""
    response = client.post("/api/v1/auth/register", json={
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "newpassword123"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "newuser@example.com"

def test_user_login(test_user):
    """Test user login workflow"""
    response = client.post("/api/v1/auth/login", data={
        "username": test_user.username,
        "password": "testpassword123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_user_profile(test_user):
    """Test user profile retrieval"""
    login_response = client.post("/api/v1/auth/login", data={
        "username": test_user.username,
        "password": "testpassword123"
    })
    token = login_response.json()["access_token"]
    response = client.get("/api/v1/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email

def test_user_update_profile(test_user):
    """Test user profile update"""
    login_response = client.post("/api/v1/auth/login", data={
        "username": test_user.username,
        "password": "testpassword123"
    })
    token = login_response.json()["access_token"]
    response = client.put("/api/v1/users/me", headers={
        "Authorization": f"Bearer {token}"
    }, json={
        "username": "updateduser",
        "email": "updateduser@example.com"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "updateduser@example.com"

def test_user_delete_account(test_user):
    """Test user account deletion"""
    login_response = client.post("/api/v1/auth/login", data={
        "username": test_user.username,
        "password": "testpassword123"
    })
    token = login_response.json()["access_token"]
    response = client.delete("/api/v1/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 204