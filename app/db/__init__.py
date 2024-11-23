# app/db/init_db.py
from sqlalchemy.orm import Session
from app.core.config import CONFIG
from app.models.user import User
from app.core.constants import UserRole
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    """Initialize database with required initial data."""
    # Create admin user if it doesn't exist
    admin = db.query(User).filter(User.username == CONFIG["admin_username"]).first()
    if not admin:
        admin = User(
            username=CONFIG["admin_username"],
            email=CONFIG["admin_email"],
            hashed_password=get_password_hash(CONFIG["admin_password"]),
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit()

# app/db/__init__.py
from app.db.base_class import Base
from app.db.session import SessionLocal, get_db

__all__ = ["Base", "SessionLocal", "get_db", "init_db"]