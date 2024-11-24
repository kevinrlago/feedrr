# app/schemas/__init__.py
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.feed import FeedCreate, FeedRead, FeedUpdate
from app.schemas.category import CategoryCreate, CategoryRead
from app.schemas.filter import FilterWordCreate, FilterWord
from app.schemas.publication import PublicationCreate, Publication

__all__ = [
    "UserCreate", "UserRead", "UserUpdate",
    "FeedCreate", "FeedRead", "FeedUpdate",
    "CategoryCreate", "CategoryRead",
    "FilterWordCreate", "FilterWord",
    "PublicationCreate", "Publication"
]