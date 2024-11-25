# tests/integration/test_feed_processing.py
import pytest
from app.services import FeedService, TranslationService, FilterService

@pytest.mark.integration
async def test_feed_processing_pipeline(test_db):
    feed_service = FeedService(test_db)
    translation_service = TranslationService()
    filter_service = FilterService()
    
    # Test complete pipeline
    feed = await feed_service.process_feed(1)
    assert feed is not None