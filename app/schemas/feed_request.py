# app/schemas/feed_request.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.core.constants import RequestStatus

class FeedRequestBase(BaseModel):
    name: str
    url: str
    category_id: int
    description: Optional[str] = None

class FeedRequestCreate(FeedRequestBase):
    pass

class FeedRequest(FeedRequestBase):
    id: int
    requester_id: int
    status: RequestStatus
    created_at: datetime
    handled_by: Optional[int] = None

    class Config:
        from_attributes = True