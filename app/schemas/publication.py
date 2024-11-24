# app/schemas/publication.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.core.constants import Platform, PublicationStatus

class PublicationBase(BaseModel):
    feed_entry_id: int
    platform: Platform
    destination_id: str

class PublicationCreate(PublicationBase):
    pass

class Publication(PublicationBase):
    id: int
    status: PublicationStatus
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    error_message: Optional[str]
    retries: int = 0

    class Config:
        from_attributes = True

class PublicationUpdate(BaseModel):
    status: PublicationStatus
    error_message: Optional[str] = None