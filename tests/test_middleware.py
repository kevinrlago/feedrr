# tests/test_middleware.py
from app.middleware import error_handler, auth_middleware

async def test_error_handler():
    async def app(scope, receive, send):
        raise ValueError("Test error")
    
    wrapped = error_handler(app)
    response = await wrapped({"type": "http"}, None, None)
    assert response.status_code == 500

async def test_auth_middleware():
    async def app(scope, receive, send):
        return None
    
    wrapped = auth_middleware(app)
    response = await wrapped({"type": "http", "headers": []}, None, None)
    assert response.status_code == 401