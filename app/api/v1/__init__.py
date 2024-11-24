# app/api/v1/__init__.py
from app.api.v1.auth import router as auth_router
from app.api.v1.feeds import router as feeds_router
from app.api.v1.categories import router as categories_router
from app.api.v1.users import router as users_router

__all__ = ["auth_router", "feeds_router", "categories_router", "users_router"]

# Export routers for use in api/__init__.py
router = {
    "auth": auth_router,
    "feeds": feeds_router,
    "categories": categories_router,
    "users": users_router
}