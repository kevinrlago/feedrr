# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from app.main import app
from app.core.config import CONFIG
from app.db.base import Base
from app.models.user import User
from app.core.security import get_password_hash

@pytest.fixture(scope="session")
def test_db():
    engine = create_engine(CONFIG["database"]["test_url"])
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    yield TestClient(app)

@pytest.fixture
def test_user(test_db):
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpass")
    )
    test_db.add(user)
    test_db.commit()
    return user

@pytest.fixture
def mock_feed_data():
    return {
        "name": "Test Feed",
        "url": "http://example.com/feed",
        "category_id": 1
    }

@pytest.fixture
def mock_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }