# tests/api/utils.py
def get_auth_token(client, user):
    response = client.post(
        "/auth/token",
        data={"username": user.username, "password": "testpass"}
    )
    return response.json()["access_token"]