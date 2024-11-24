# tests/api/test_error_handling.py
def test_404_not_found(client):
    response = client.get("/nonexistent")
    assert response.status_code == 404

def test_422_validation_error(client):
    response = client.post("/users/", json={
        "username": "test",
        # Missing required fields
    })
    assert response.status_code == 422

def test_429_rate_limit(client):
    # Make multiple requests quickly
    responses = [
        client.get("/feeds/")
        for _ in range(100)
    ]
    assert any(r.status_code == 429 for r in responses)