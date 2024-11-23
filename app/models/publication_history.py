# app/models/publication_history.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base
from app.core.constants import Platform, PublicationStatus

class PublicationHistory(Base):
    __tablename__ = "publication_history"

    id = Column(Integer, primary_key=True, index=True)
    feed_entry_id = Column(Integer, ForeignKey("feed_entries.id"))
    platform = Column(Enum(Platform))
    destination_id = Column(String)  # chat_id/channel_id/phone_number
    status = Column(Enum(PublicationStatus), default=PublicationStatus.PENDING)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    error_message = Column(String, nullable=True)
    retries = Column(Integer, default=0)

    # Relationships
    feed_entry = relationship("FeedEntry", back_populates="publications")

    def __repr__(self):
        return f"<PublicationHistory {self.id} - {self.platform.value} - {self.status.value}>"