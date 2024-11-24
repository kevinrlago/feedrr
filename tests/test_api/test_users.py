# tests/api/test_users.py
from .utils import get_auth_token

def test_create_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123"
        }
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newuser"

def test_me_endpoint(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == test_user.username