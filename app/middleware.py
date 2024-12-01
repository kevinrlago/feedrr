# app/middleware.py
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Callable
from app.core.rate_limit import RateLimiter
from app.api.deps import get_current_user

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

# List of public endpoints that don't require authentication
PUBLIC_ENDPOINTS = [
    "/api/v1/auth/token",
    "/api/v1/users/exists",
    "/api/v1/users/first",
    "/api/v1/config/login",
    "/api/v1/config/initial-setup"
]

async def error_handler_middleware(request: Request, call_next: Callable):
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

async def auth_middleware(request: Request, call_next: Callable):
    if request.url.path in PUBLIC_ENDPOINTS:
        return await call_next(request)
        
    try:
        current_user = await get_current_user(request)
        request.state.user = current_user
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Not authenticated"}
        )
    
    response = await call_next(request)
    return response

async def rate_limit_middleware(request: Request, call_next: Callable):
    client_ip = request.client.host
    
    if not await rate_limiter.check(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"}
        )
    
    response = await call_next(request)
    return response