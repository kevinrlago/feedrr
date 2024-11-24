# tests/test_models/test_feed.py
import pytest
from datetime import datetime
from app.models.feed import Feed, FeedEntry
from app.models.category import Category

def test_feed_creation(test_db):
    category = Category(name="Test Category")
    test_db.add(category)
    test_db.commit()

    feed = Feed(
        name="Test Feed",
        url="http://example.com/feed",
        category_id=category.id
    )
    test_db.add(feed)
    test_db.commit()

    assert feed.id is not None
    assert feed.category_id == category.id

def test_feed_entries(test_db):
    feed = Feed(name="Test Feed", url="http://example.com/feed")
    test_db.add(feed)
    
    entry = FeedEntry(
        title="Test Entry",
        link="http://example.com/entry",
        guid="unique-id",
        published=datetime.utcnow(),
        feed_id=feed.id
    )
    test_db.add(entry)
    test_db.commit()

    assert len(feed.entries) == 1
    assert feed.entries[0].title == "Test Entry"

def test_feed_filters(test_db):
    feed = Feed(name="Test Feed", url="http://example.com/feed")
    test_db.add(feed)
    test_db.commit()

    assert hasattr(feed, 'whitelist_words')
    assert hasattr(feed, 'blacklist_words')