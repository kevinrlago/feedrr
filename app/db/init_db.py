# app/db/init_db.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.config import CONFIG
from app.core.security import get_password_hash
from app.models.user import User
from app.core.constants import UserRole
from app.db.base import Base
from app.db.session import engine

def init_db(db: Session) -> None:
    """Initialize the database."""
    try:
        # Drop all tables first to ensure clean slate
        Base.metadata.drop_all(bind=engine)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("Database tables created successfully")
        
        # Create admin user
        if "admin_username" in CONFIG:
            admin = User(
                username=CONFIG.get("admin_username", "admin"),
                email=CONFIG.get("admin_email", "admin@example.com"),
                hashed_password=get_password_hash(CONFIG.get("admin_password", "admin")),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            try:
                db.commit()
                print("Admin user created successfully")
            except IntegrityError:
                db.rollback()
                print("Admin user already exists")

    except Exception as e:
        print(f"Error initializing database: {e}")
        raise