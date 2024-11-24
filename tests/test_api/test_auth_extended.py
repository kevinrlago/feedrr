# tests/api/test_auth_extended.py
def test_invalid_token(client):
    response = client.get(
        "/users/me",
        headers={"Authorization": "Bearer invalid-token"}
    )
    assert response.status_code == 401

def test_expired_token(client):
    token = create_test_token("testuser", expires_delta=timedelta(seconds=-1))
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 401

def test_api_key_auth(client):
    response = client.get(
        "/feeds/",
        headers={"X-API-Key": "test-api-key"}
    )
    assert response.status_code == 200