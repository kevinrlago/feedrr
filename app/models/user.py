# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.core.constants import UserRole, Language

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Changed to nullable=True
    role = Column(Enum(UserRole), default=UserRole.BASIC_USER)
    is_active = Column(Boolean, default=True)
    
    # Add feeds relationship
    feeds = relationship("Feed", back_populates="creator")
    feed_requests = relationship("FeedRequest", foreign_keys='FeedRequest.requester_id', back_populates="requester")
    handled_requests = relationship("FeedRequest", foreign_keys='FeedRequest.handled_by', back_populates="handler")
    
    preferred_language = Column(Enum(Language), default=Language.ENGLISH)
    api_key = Column(String, unique=True, nullable=True)