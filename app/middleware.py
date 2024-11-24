# app/middleware.py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable
import time
from app.core.rate_limit import RateLimiter

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

async def error_handler_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"detail": e.detail}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

async def auth_middleware(request: Request, call_next):
    if request.url.path in ["/auth/token", "/docs", "/redoc"]:
        return await call_next(request)

    auth = request.headers.get("Authorization")
    api_key = request.headers.get("X-API-Key")

    if not auth and not api_key:
        return JSONResponse(
            status_code=401,
            content={"detail": "Not authenticated"}
        )

    return await call_next(request)

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    
    if not await rate_limiter.check(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"}
        )
    
    return await call_next(request)