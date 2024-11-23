# app/models/feed_request.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base
from app.core.constants import RequestStatus

class FeedRequest(Base):
    __tablename__ = "feed_requests"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    requester_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    handled_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    description = Column(String, nullable=True)

    # Add relationships
    category = relationship("Category", back_populates="feed_requests")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="feed_requests")
    handler = relationship("User", foreign_keys=[handled_by], back_populates="handled_requests")