import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)

def test_login(client, test_user):
    response = client.post(
        "/auth/token",
        data={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_current_user(client, test_db):
    token = create_access_token({"sub": "testuser"})
    response = client.get("/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200

def test_magic_link(client, test_user):
    response = client.post(
        "/auth/magic-link",
        json={"email": "test@example.com"}
    )
    assert response.status_code == 200
    assert "message" in response.json()

def test_api_key_creation(client, test_user):
    # First login
    login_response = client.post(
        "/auth/token",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    # Create API key
    response = client.post(
        "/auth/api-keys",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "api_key" in response.json()