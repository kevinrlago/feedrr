# tests/api/__init__.py
from fastapi.testclient import TestClient
import jwt
from datetime import datetime, timedelta
from typing import Dict

from app.core.config import CONFIG
from app.core.security import create_access_token
from app.models.user import User
from app.core.constants import UserRole

def create_test_token(username: str, expires_delta: timedelta = None) -> str:
    """Create a test JWT token"""
    return create_access_token(
        data={"sub": username},
        expires_delta=expires_delta
    )

def get_auth_headers(token: str) -> Dict[str, str]:
    """Get authorization headers with token"""
    return {"Authorization": f"Bearer {token}"}

def create_test_api_key() -> str:
    """Generate test API key"""
    return "test_" + "".join([str(i) for i in range(32)])

async def create_test_user_with_token(db, username="testuser") -> tuple[User, str]:
    """Create test user and return with token"""
    user = User(
        username=username,
        email=f"{username}@example.com",
        hashed_password="hashedpass",
        role=UserRole.BASIC_USER
    )
    db.add(user)
    db.commit()
    
    token = create_test_token(username)
    return user, token

class TestClientWithAuth(TestClient):
    """TestClient with authentication helpers"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.auth_token = None
    
    def set_auth(self, token: str):
        """Set authentication token"""
        self.auth_token = token
    
    def request(self, *args, **kwargs):
        """Add auth headers to request if token exists"""
        if self.auth_token:
            headers = kwargs.get("headers", {})
            headers.update(get_auth_headers(self.auth_token))
            kwargs["headers"] = headers
        return super().request(*args, **kwargs)

__all__ = [
    'create_test_token',
    'get_auth_headers', 
    'create_test_api_key',
    'create_test_user_with_token',
    'TestClientWithAuth'
]