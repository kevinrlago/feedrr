# tests/integration/test_cache_layer.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.cache import cache

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def clear_cache():
    """Clear cache before each test"""
    cache.clear()
    yield
    cache.clear()

def test_cache_set_and_get():
    """Test setting and getting cache values"""
    cache.set("test_key", "test_value", timeout=60)
    value = cache.get("test_key")
    assert value == "test_value"

def test_cache_expiration():
    """Test cache expiration"""
    cache.set("test_key", "test_value", timeout=1)
    value = cache.get("test_key")
    assert value == "test_value"
    import time
    time.sleep(2)
    value = cache.get("test_key")
    assert value is None

def test_cache_invalidation():
    """Test cache invalidation"""
    cache.set("test_key", "test_value", timeout=60)
    cache.delete("test_key")
    value = cache.get("test_key")
    assert value is None

def test_cache_integration_with_api():
    """Test cache integration with API endpoints"""
    response = client.get("/api/v1/resource")
    assert response.status_code == 200
    assert "Cache-Control" in response.headers
    assert response.headers["Cache-Control"] == "max-age=60"

    # Simulate cache hit
    response = client.get("/api/v1/resource")
    assert response.status_code == 200
    assert "Cache-Control" in response.headers
    assert response.headers["Cache-Control"] == "max-age=60"