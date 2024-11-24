# tests/api/test_feeds.py
from .utils import get_auth_token

def test_create_feed(client, test_user, test_db):
    token = get_auth_token(client, test_user)
    response = client.post(
        "/feeds/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Feed",
            "url": "http://example.com/feed",
            "category_id": 1
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Feed"

def test_feed_list(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.get(
        "/feeds/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)