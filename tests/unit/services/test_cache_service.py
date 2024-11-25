# tests/services/test_cache_service.py
import pytest
from app.services.cache_service import RedisCache

@pytest.mark.asyncio
async def test_cache_set_get():
    cache = RedisCache()
    await cache.set("test_key", "test_value")
    value = await cache.get("test_key")
    assert value == "test_value"

@pytest.mark.asyncio
async def test_cache_delete():
    cache = RedisCache()
    await cache.set("test_key", "test_value")
    await cache.delete("test_key")
    value = await cache.get("test_key")
    assert value is None