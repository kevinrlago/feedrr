# tests/models/test_publication_history.py
import pytest
from datetime import datetime
from app.models.publication_history import PublicationHistory
from app.models.feed import Feed, FeedEntry
from app.core.constants import Platform, PublicationStatus

def test_publication_history_creation(test_db):
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
    
    publication = PublicationHistory(
        feed_entry_id=entry.id,
        platform=Platform.TELEGRAM,
        destination_id="123456",
        status=PublicationStatus.PENDING
    )
    test_db.add(publication)
    test_db.commit()

    assert publication.id is not None
    assert publication.platform == Platform.TELEGRAM
    assert publication.status == PublicationStatus.PENDING