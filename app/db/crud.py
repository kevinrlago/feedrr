from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.feed import Feed, FeedEntry
from app.models.category import Category
from app.models.publication_history import PublicationHistory
from app.schemas.feed import FeedCreate, FeedEntryCreate
from app.schemas.category import CategoryCreate

class FeedCRUD:
    def __init__(self, db: Session):
        self.db = db

    def create(self, feed: FeedCreate) -> Feed:
        db_feed = Feed(**feed.dict())
        self.db.add(db_feed)
        self.db.commit()
        self.db.refresh(db_feed)
        return db_feed

    def get(self, feed_id: int) -> Optional[Feed]:
        return self.db.query(Feed).filter(Feed.id == feed_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Feed]:
        return self.db.query(Feed).offset(skip).limit(limit).all()

    def get_feed_entries(self):
        return self.db.query(Feed).all()

    def add_feed_entry(self, feed: FeedEntryCreate):
        db_feed = Feed(**feed.dict())
        self.db.add(db_feed)
        self.db.commit()
        self.db.refresh(db_feed)
        return db_feed

    def get_feed_entry(self, feed_id: int):
        return self.db.query(Feed).filter(Feed.id == feed_id).first()

    def delete_feed_entry(self, feed_id: int):
        feed = self.get_feed_entry(feed_id)
        if feed:
            self.db.delete(feed)
            self.db.commit()

    def update_feed_entry(self, feed_id: int, feed: FeedEntryCreate):
        db_feed = self.get_feed_entry(feed_id)
        if db_feed:
            for key, value in feed.dict().items():
                setattr(db_feed, key, value)
            self.db.commit()
            self.db.refresh(db_feed)
        return db_feed

class CategoryCRUD:
    def __init__(self, db: Session):
        self.db = db

    def get_categories(self):
        return self.db.query(Category).all()

    def add_category(self, category: CategoryCreate):
        db_category = Category(**category.dict())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def get_category(self, category_id: int):
        return self.db.query(Category).filter(Category.id == category_id).first()

    def delete_category(self, category_id: int):
        category = self.get_category(category_id)
        if category:
            self.db.delete(category)
            self.db.commit()

    def update_category(self, category_id: int, category: CategoryCreate):
        db_category = self.get_category(category_id)
        if db_category:
            for key, value in category.dict().items():
                setattr(db_category, key, value)
            self.db.commit()
            self.db.refresh(db_category)
        return db_category

class PublicationHistoryCRUD:
    def __init__(self, db: Session):
        self.db = db

    def get_publication_histories(self):
        return self.db.query(PublicationHistory).all()

    def add_publication_history(self, history):
        db_history = PublicationHistory(**history.dict())
        self.db.add(db_history)
        self.db.commit()
        self.db.refresh(db_history)
        return db_history

    def create(self, feed_entry_id: int, platform: str, destination_id: str) -> PublicationHistory:
        pub_history = PublicationHistory(
            feed_entry_id=feed_entry_id,
            platform=platform,
            destination_id=destination_id
        )
        self.db.add(pub_history)
        self.db.commit()
        self.db.refresh(pub_history)
        return pub_history

    def update_status(self, history_id: int, status: str, error_message: Optional[str] = None) -> PublicationHistory:
        history = self.db.query(PublicationHistory).filter(PublicationHistory.id == history_id).first()
        if history:
            history.status = status
            history.error_message = error_message
            history.updated_at = datetime.utcnow()
            if status == "published":
                history.published_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(history)
        return history
