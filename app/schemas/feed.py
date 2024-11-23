# app/schemas/feed.py
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List

class FeedEntryBase(BaseModel):
    title: str
    link: HttpUrl
    description: Optional[str] = None
    published: datetime
    guid: str

class FeedEntryCreate(FeedEntryBase):
    feed_id: int

class FeedEntry(FeedEntryBase):
    id: int
    created_at: datetime
    feed_id: int

    class Config:
        from_attributes = True

class FeedBase(BaseModel):
    name: str
    url: HttpUrl
    description: Optional[str] = None
    category_id: int

class FeedCreate(FeedBase):
    pass

class FeedUpdate(FeedBase):
    pass

class Feed(FeedBase):
    id: int
    last_fetched: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    creator_id: int
    entries: List[FeedEntry] = []

    class Config:
        from_attributes = True