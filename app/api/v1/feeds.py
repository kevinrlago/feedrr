# app/api/v1/feeds.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.feed import Feed
from app.schemas.feed import FeedCreate, Feed as FeedSchema
from app.api.deps import get_current_user
from app.services.feed_service import FeedService

router = APIRouter()

@router.post("/", response_model=FeedSchema)
async def create_feed(
    feed: FeedCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    feed_service = FeedService(db)
    return await feed_service.create_feed(feed, current_user.id)

@router.get("/", response_model=List[FeedSchema])
async def get_feeds(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    feed_service = FeedService(db)
    return feed_service.get_feeds(skip=skip, limit=limit)

@router.get("/{feed_id}", response_model=FeedSchema)
async def get_feed(
    feed_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    feed_service = FeedService(db)
    feed = feed_service.get_feed(feed_id)
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed

@router.delete("/{feed_id}")
async def delete_feed(
    feed_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    feed_service = FeedService(db)
    if not feed_service.delete_feed(feed_id):
        raise HTTPException(status_code=404, detail="Feed not found")
    return {"message": "Feed deleted successfully"}