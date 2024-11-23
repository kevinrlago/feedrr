import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, FeedCRUD, FeedEntry, Category

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_create_feed(db):
    feed_crud = FeedCRUD(db)
    new_feed = FeedEntry(title="Test Feed", link="http://test.com/rss", published=None)
    feed = feed_crud.add_feed_entry(new_feed)
    assert feed.title == "Test Feed"
    assert feed.link == "http://test.com/rss"

def test_read_feeds(db):
    feed_crud = FeedCRUD(db)
    feeds = feed_crud.get_feed_entries()
    assert len(feeds) > 0

def test_update_feed(db):
    feed_crud = FeedCRUD(db)
    feed = feed_crud.get_feed_entries()[0]
    feed.title = "Updated Feed"
    updated_feed = feed_crud.update_feed_entry(feed.id, feed)
    assert updated_feed.title == "Updated Feed"

def test_delete_feed(db):
    feed_crud = FeedCRUD(db)
    feed = feed_crud.get_feed_entries()[0]
    feed_crud.delete_feed_entry(feed.id)
    feeds = feed_crud.get_feed_entries()
    assert len(feeds) == 0