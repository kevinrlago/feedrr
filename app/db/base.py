# app/db/base.py
from app.db.base_class import Base  # Import Base first

# Import models after Base is defined
from app.models.user import User
from app.models.feed import Feed
from app.models.category import Category
from app.models.feed_request import FeedRequest

# For Alembic use
__all__ = ["Base", "User", "Feed", "Category", "FeedRequest"]