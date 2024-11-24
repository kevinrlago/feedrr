# app/core/rate_limit.py
import time
from collections import defaultdict
from typing import Dict, List
import asyncio

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)
        
    async def check(self, client_id: str) -> bool:
        """Check if client has exceeded rate limit"""
        now = time.time()
        
        # Remove old requests
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if now - req_time < self.window_seconds
        ]
        
        # Check current request count
        if len(self.requests[client_id]) >= self.max_requests:
            return False
            
        # Add new request
        self.requests[client_id].append(now)
        return True
        
    async def clean(self):
        """Clean up old requests periodically"""
        while True:
            now = time.time()
            for client_id in list(self.requests.keys()):
                self.requests[client_id] = [
                    req_time for req_time in self.requests[client_id]
                    if now - req_time < self.window_seconds
                ]
                if not self.requests[client_id]:
                    del self.requests[client_id]
            await asyncio.sleep(self.window_seconds)