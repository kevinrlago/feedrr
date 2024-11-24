# tests/api/test_notifications.py
from .utils import get_auth_token

def test_get_notifications(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.get(
        "/notifications",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_mark_notification_read(client, test_user):
    token = get_auth_token(client, test_user)
    response = client.put(
        "/notifications/1/read",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200