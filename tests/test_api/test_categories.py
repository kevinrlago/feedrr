# tests/api/test_categories.py
from .utils import get_auth_token

def test_create_category(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.post(
        "/categories/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Test Category"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Category"

def test_category_list(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.get(
        "/categories/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)