# app/schemas/feed.py
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List

class FeedBase(BaseModel):
    name: str
    url: HttpUrl
    description: Optional[str] = None
    category_id: int

class FeedCreate(FeedBase):
    pass

class FeedUpdate(FeedBase):
    pass

class FeedRead(FeedBase):
    id: int
    created_at: datetime
    updated_at: datetime
    creator_id: int
    last_fetched: Optional[datetime] = None

    class Config:
        from_attributes = True

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
    feed_id: int
    created_at: datetime

    class Config:
        from_attributes = True