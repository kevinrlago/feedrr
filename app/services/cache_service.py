# app/services/cache_service.py
from redis import Redis
from typing import Optional, Any
import json
from app.core.config import CONFIG

class RedisCache:
    def __init__(self):
        self.enabled = CONFIG.get("redis", {}).get("enabled", False)
        if self.enabled:
            self.redis = Redis(
                host=CONFIG["redis"]["host"],
                port=CONFIG["redis"]["port"],
                db=CONFIG["redis"]["db"],
                decode_responses=True
            )
            self.ttl = CONFIG["redis"].get("ttl", 3600)  # 1 hour default

    async def get(self, key: str) -> Optional[Any]:
        if not self.enabled:
            return None
        data = self.redis.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        if not self.enabled:
            return False
        return self.redis.set(
            key,
            json.dumps(value),
            ex=ttl or self.ttl
        )

    async def delete(self, key: str) -> bool:
        if not self.enabled:
            return False
        return bool(self.redis.delete(key))