# tests/test_models/test_feed.py
import pytest
from app.models.feed import Feed, FeedEntry

def test_feed_creation(test_db):
    feed = Feed(
        name="Test Feed",
        url="http://example.com/feed",
        description="Test Description"
    )
    test_db.add(feed)
    test_db.commit()
    
    assert feed.id is not None
    assert feed.name == "Test Feed"