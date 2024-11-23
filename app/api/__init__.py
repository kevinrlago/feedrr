# app/api/__init__.py
from fastapi import APIRouter
from app.api.v1 import auth, feeds, categories, users

api_router = APIRouter()

# Include all v1 routes
api_router.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
api_router.include_router(feeds.router, prefix="/v1/feeds", tags=["feeds"])
api_router.include_router(categories.router, prefix="/v1/categories", tags=["categories"])
api_router.include_router(users.router, prefix="/v1/users", tags=["users"])