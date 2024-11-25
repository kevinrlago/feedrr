# tests/test_services/test_filter_service.py
import pytest
from app.services.filter_service import FilterService
from app.models.feed import Feed
from app.models.filter import FilterWord  # Fixed import path

def test_check_entry_against_filters(test_db):
    service = FilterService()
    feed = Feed(name="Test Feed", url="http://example.com/feed")
    test_db.add(feed)
    
    # Add filter words
    whitelist = FilterWord(word="python")
    blacklist = FilterWord(word="spam")
    test_db.add_all([whitelist, blacklist])
    feed.whitelist_words.append(whitelist)
    feed.blacklist_words.append(blacklist)
    test_db.commit()
    
    # Test with matching whitelist word
    entry = {
        "title": "Python News",
        "description": "Latest Python updates"
    }
    assert service.check_entry_against_filters(entry, feed) is True
    
    # Test with matching blacklist word
    entry = {
        "title": "Python News",
        "description": "Spam and updates"
    }
    assert service.check_entry_against_filters(entry, feed) is False