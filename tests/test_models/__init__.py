# tests/models/__init__.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from app.db.base import Base
from app.models.user import User
from app.models.feed import Feed, FeedEntry
from app.models.category import Category
from app.models.publication_history import PublicationHistory
from app.core.constants import UserRole, Platform, PublicationStatus
from app.core.security import get_password_hash

def create_test_user(db, username="testuser"):
    """Utility function to create test user"""
    user = User(
        username=username,
        email=f"{username}@example.com",
        hashed_password=get_password_hash("testpass"),
        role=UserRole.BASIC_USER
    )
    db.add(user)
    db.commit()
    return user

def create_test_category(db, name="Test Category"):
    """Utility function to create test category"""
    category = Category(name=name)
    db.add(category)
    db.commit()
    return category

def create_test_feed(db, category=None, user=None):
    """Utility function to create test feed"""
    feed = Feed(
        name="Test Feed",
        url="http://example.com/feed",
        category_id=category.id if category else None,
        creator_id=user.id if user else None
    )
    db.add(feed)
    db.commit()
    return feed

def create_test_entry(db, feed):
    """Utility function to create test feed entry"""
    entry = FeedEntry(
        title="Test Entry",
        link="http://example.com/entry",
        guid="unique-id",
        published=datetime.utcnow(),
        feed_id=feed.id
    )
    db.add(entry)
    db.commit()
    return entry

def create_test_publication(db, entry, platform=Platform.TELEGRAM):
    """Utility function to create test publication history"""
    pub = PublicationHistory(
        feed_entry_id=entry.id,
        platform=platform,
        destination_id="123456",
        status=PublicationStatus.PENDING
    )
    db.add(pub)
    db.commit()
    return pub