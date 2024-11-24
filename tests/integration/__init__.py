# tests/integration/__init__.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Any, Dict

from app.db.base import Base
from app.core.config import CONFIG
from app.models.user import User
from app.models.feed import Feed, FeedEntry
from app.core.constants import UserRole, Platform

@pytest.fixture(scope="session")
def integration_db():
    """Session-wide test database"""
    engine = create_engine(CONFIG["database"]["test_url"])
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    yield db
    
    Base.metadata.drop_all(bind=engine)
    db.close()

def create_test_environment(db) -> Dict[str, Any]:
    """Create test data for integration tests"""
    # Create test user
    user = User(
        username="testuser",
        email="test@example.com",
        role=UserRole.ADMIN
    )
    db.add(user)
    
    # Create test feed
    feed = Feed(
        name="Test Feed",
        url="http://example.com/feed",
        creator_id=1
    )
    db.add(feed)
    
    # Create test entry
    entry = FeedEntry(
        title="Test Entry",
        link="http://example.com/1",
        guid="unique-id",
        feed_id=1
    )
    db.add(entry)
    
    db.commit()
    
    return {
        "user": user,
        "feed": feed,
        "entry": entry
    }

@pytest.fixture(scope="function")
def test_env(integration_db):
    """Function-level test environment"""
    env = create_test_environment(integration_db)
    yield env
    integration_db.rollback()

# Mark all tests in this directory as integration tests
pytest.register_mark(
    "integration",
    "mark test as an integration test"
)