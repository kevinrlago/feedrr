# tests/models/test_filter_words.py
import pytest
from app.models import FilterWord, Feed

def test_filter_word_creation(test_db):
    word = FilterWord(word="python")
    test_db.add(word)
    test_db.commit()
    assert word.id is not None

def test_filter_word_relationships(test_db):
    word = FilterWord(word="python")
    feed = Feed(name="Test Feed", url="http://example.com/feed")
    test_db.add_all([word, feed])
    test_db.commit()
    
    feed.whitelist_words.append(word)
    test_db.commit()
    assert word in feed.whitelist_words