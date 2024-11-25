# tests/api/test_filters.py
import pytest
from app.models import Feed, FilterWord
from .utils import get_auth_token

def test_add_whitelist_words(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.post(
        "/feeds/1/whitelist",
        headers={"Authorization": f"Bearer {token}"},
        json={"words": ["python", "fastapi"]}
    )
    assert response.status_code == 200

def test_add_blacklist_words(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.post(
        "/feeds/1/blacklist",
        headers={"Authorization": f"Bearer {token}"},
        json={"words": ["spam", "ads"]}
    )
    assert response.status_code == 200