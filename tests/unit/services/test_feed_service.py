# tests/test_services/test_feed_service.py
import pytest
from unittest.mock import patch
from app.services.feed_service import FeedService
from tests.test_models import create_test_feed, create_test_category  # Fixed import path

def test_create_feed(test_db):
    service = FeedService(test_db)
    category = create_test_category(test_db)
    
    feed_data = {
        "name": "Test Feed",
        "url": "http://example.com/feed",
        "category_id": category.id
    }
    
    feed = service.create_feed(feed_data, creator_id=1)
    assert feed.name == "Test Feed"
    assert feed.category_id == category.id

def test_get_feed(test_db):
    service = FeedService(test_db)
    feed = Feed(name="Test Feed", url="http://example.com/feed", category_id=1)
    test_db.add(feed)
    test_db.commit()

    retrieved_feed = service.get_feed(feed.id)
    assert retrieved_feed.name == "Test Feed"

@patch('feedparser.parse')
def test_update_feed_entries(mock_parse, test_db):
    mock_parse.return_value = mock_feed_response()
    
    service = FeedService(test_db)
    feed = create_test_feed(test_db)
    
    entries = service.update_feed_entries(feed)
    assert len(entries) == 1
    assert entries[0].title == "Test Entry"

def test_invalid_feed_url(test_db):
    service = FeedService(test_db)
    with pytest.raises(ValueError):
        service.create_feed({
            "name": "Invalid Feed",
            "url": "not-a-url",
            "category_id": 1
        }, creator_id=1)