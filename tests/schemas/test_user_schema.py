# tests/schemas/test_user_schema.py
import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate, UserUpdate

def test_user_create_validation():
    # Valid data
    user = UserCreate(
        username="testuser",
        email="test@example.com",
        password="ValidPass123"
    )
    assert user.username == "testuser"

    # Invalid email
    with pytest.raises(ValidationError):
        UserCreate(
            username="testuser",
            email="invalid-email",
            password="ValidPass123"
        )

def test_user_update_validation():
    # Optional fields
    update = UserUpdate(username="newname")
    assert update.username == "newname"
    assert update.email is None