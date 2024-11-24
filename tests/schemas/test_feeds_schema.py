# tests/schemas/test_feed_schema.py
import pytest
from pydantic import ValidationError
from app.schemas.feed import FeedCreate, FeedUpdate, FeedEntry

def test_feed_create_validation():
    feed = FeedCreate(
        name="Test Feed",
        url="https://example.com/feed",
        category_id=1
    )
    assert feed.name == "Test Feed"

    with pytest.raises(ValidationError):
        FeedCreate(
            name="",  # Empty name
            url="invalid-url",
            category_id=1
        )

def test_feed_entry_validation():
    entry = FeedEntry(
        title="Test Entry",
        link="https://example.com/entry",
        guid="unique-id",
        published="2024-03-14T12:00:00Z"
    )
    assert entry.title == "Test Entry"