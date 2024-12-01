# app/api/__init__.py
from fastapi import APIRouter
from app.api.v1 import auth, users, feeds, categories

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(feeds.router, prefix="/feeds", tags=["feeds"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])