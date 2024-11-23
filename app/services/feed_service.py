# app/services/feed_service.py
import feedparser
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.feed import Feed, FeedEntry
from app.models.category import Category
from app.schemas.feed import FeedCreate, FeedUpdate, FeedEntryCreate
from app.services.notification_service import NotificationService

class FeedService:
    def __init__(self, db: Session):
        self.db = db
        self.notification_service