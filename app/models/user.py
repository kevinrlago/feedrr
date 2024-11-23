# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.core.constants import UserRole

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BASIC_USER)
    is_active = Column(Boolean, default=True)
    
    # Add feeds relationship
    feeds = relationship("Feed", back_populates="creator")
    feed_requests = relationship("FeedRequest", foreign_keys='FeedRequest.requester_id', back_populates="requester")
    handled_requests = relationship("FeedRequest", foreign_keys='FeedRequest.handled_by', back_populates="handler")