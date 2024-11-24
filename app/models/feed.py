# app/models/feed.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base
from app.models.filter import feed_whitelist, feed_blacklist

class Feed(Base):
    __tablename__ = "feeds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    last_fetched = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    category_id = Column(Integer, ForeignKey("categories.id"))
    creator_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    category = relationship("Category", back_populates="feeds")
    creator = relationship("User", back_populates="feeds")
    entries = relationship("FeedEntry", back_populates="feed", cascade="all, delete-orphan")
    whitelist_words = relationship("FilterWord", secondary=feed_whitelist, back_populates="feeds_whitelist")
    blacklist_words = relationship("FilterWord", secondary=feed_blacklist, back_populates="feeds_blacklist")

    def __repr__(self):
        return f"<Feed {self.name}>"

class FeedEntry(Base):
    __tablename__ = "feed_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    link = Column(String)
    description = Column(String, nullable=True)
    published = Column(DateTime)
    guid = Column(String, unique=True)
    feed_id = Column(Integer, ForeignKey("feeds.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    feed = relationship("Feed", back_populates="entries")
    publications = relationship("PublicationHistory", back_populates="feed_entry", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<FeedEntry {self.title}>"