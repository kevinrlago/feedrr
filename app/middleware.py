# app/middleware.py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from typing import Callable
import time
from app.core.rate_limit import RateLimiter

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

# List of public endpoints that don't require authentication
PUBLIC_ENDPOINTS = [
    "/api/v1/users/exists",
    "/api/v1/users/first",
    "/token",
    "/login",
    "/docs",
    "/redoc",
    "/openapi.json"
]

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
    # Skip auth check for public endpoints and OPTIONS requests
    if (
        request.method == "OPTIONS" or
        any(request.url.path.startswith(endpoint) for endpoint in PUBLIC_ENDPOINTS)
    ):
        return await call_next(request)

    # Check for auth token
    auth = request.headers.get("Authorization")
    if not auth:
        # Return 401 instead of redirecting
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
    
    response = await call_next(request)
    return response