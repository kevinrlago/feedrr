# tests/models/test_category.py
import pytest
from app.models.category import Category
from app.models.feed import Feed

def test_category_creation(test_db):
    category = Category(name="Test Category")
    test_db.add(category)
    test_db.commit()

    assert category.id is not None
    assert category.name == "Test Category"

def test_category_feeds(test_db):
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

    assert len(category.feeds) == 1
    assert category.feeds[0].name == "Test Feed"