# tests/schemas/__init__.py
import pytest
from typing import Any, Dict, Type
from pydantic import BaseModel, ValidationError

from app.schemas.user import UserCreate, UserRead
from app.schemas.feed import FeedCreate, FeedRead
from app.schemas.category import CategoryCreate, CategoryRead
from app.schemas.filter import FilterWordCreate
from app.schemas.publication import PublicationCreate

def validate_schema(schema_class: Type[BaseModel], data: Dict[Any, Any]) -> bool:
    """Helper to validate schema data"""
    try:
        schema_class(**data)
        return True
    except ValidationError:
        return False

@pytest.fixture
def valid_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "ValidPass123"
    }

@pytest.fixture
def valid_feed_data():
    return {
        "name": "Test Feed",
        "url": "https://example.com/feed",
        "category_id": 1
    }

@pytest.fixture
def valid_category_data():
    return {
        "name": "Test Category",
        "description": "Test Description"
    }

__all__ = [
    'validate_schema',
    'valid_user_data',
    'valid_feed_data',
    'valid_category_data'
]