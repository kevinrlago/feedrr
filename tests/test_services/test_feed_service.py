# tests/test_services/test_feed_service.py
import pytest
from datetime import datetime
from app.services.feed_service import FeedService
from app.models.feed import Feed
from app.core.constants import RequestStatus

def test_create_feed(test_db):
    service = FeedService(test_db)
    feed = service.create_feed({
        "name": "Test Feed",
        "url": "http://example.com/feed",
        "category_id": 1
    }, creator_id=1)
    
    assert feed.name == "Test Feed"
    assert feed.creator_id == 1

def test_get_feed(test_db):
    service = FeedService(test_db)
    feed = Feed(name="Test Feed", url="http://example.com/feed", category_id=1)
    test_db.add(feed)
    test_db.commit()

    retrieved_feed = service.get_feed(feed.id)
    assert retrieved_feed.name == "Test Feed"

def test_update_feed_entries(test_db):
    service = FeedService(test_db)
    feed = Feed(name="Test Feed", url="http://example.com/feed", category_id=1)
    test_db.add(feed)
    test_db.commit()

    entries = service.update_feed_entries(feed)
    assert isinstance(entries, list)

def test_invalid_feed_url(test_db):
    service = FeedService(test_db)
    with pytest.raises(ValueError):
        service.create_feed({
            "name": "Invalid Feed",
            "url": "not-a-url",
            "category_id": 1
        }, creator_id=1)