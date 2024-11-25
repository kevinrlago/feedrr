# tests/integration/test_filter_pipeline.py
import pytest
@pytest.mark.integration
async def test_filter_pipeline(test_db):
    from app.services import FilterService
    service = FilterService()
    entries = await service.filter_feed_entries(1)
    assert isinstance(entries, list)