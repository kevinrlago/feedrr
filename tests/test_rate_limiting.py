# tests/test_rate_limiting.py
from app.core.rate_limit import RateLimiter

async def test_rate_limiter():
    limiter = RateLimiter(max_requests=5, window_seconds=1)
    
    # Should allow 5 requests
    for _ in range(5):
        assert await limiter.check("test_user") is True
    
    # Should block the 6th request
    assert await limiter.check("test_user") is False