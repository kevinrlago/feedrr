# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.db.base_class import Base  # Add this import
from app.core.config import CONFIG

engine = create_engine(CONFIG["database"]["url"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Export Base from session.py
__all__ = ["SessionLocal", "get_db", "Base"]