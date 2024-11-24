# app/models/filter.py
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base

# Define association tables
feed_whitelist = Table(
    'feed_whitelist',
    Base.metadata,
    Column('feed_id', Integer, ForeignKey('feeds.id')),
    Column('word_id', Integer, ForeignKey('filter_words.id'))
)

feed_blacklist = Table(
    'feed_blacklist',
    Base.metadata,
    Column('feed_id', Integer, ForeignKey('feeds.id')),
    Column('word_id', Integer, ForeignKey('filter_words.id'))
)

class FilterWord(Base):
    __tablename__ = "filter_words"
    
    id = Column(Integer, primary_key=True)
    word = Column(String, unique=True, index=True)
    
    feeds_whitelist = relationship("Feed", secondary=feed_whitelist, back_populates="whitelist_words")
    feeds_blacklist = relationship("Feed", secondary=feed_blacklist, back_populates="blacklist_words")