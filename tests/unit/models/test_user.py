# tests/models/test_user.py
import pytest
from app.models.user import User
from app.core.constants import UserRole

def test_user_creation(test_db):
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashedpass",
        role=UserRole.BASIC_USER
    )
    test_db.add(user)
    test_db.commit()
    
    assert user.id is not None
    assert user.username == "testuser"
    assert user.role == UserRole.BASIC_USER

def test_user_relationships(test_db):
    user = User(username="testuser", email="test@example.com", hashed_password="hashedpass")
    test_db.add(user)
    test_db.commit()
    
    assert hasattr(user, 'feeds')
    assert hasattr(user, 'feed_requests')
    assert hasattr(user, 'handled_requests')