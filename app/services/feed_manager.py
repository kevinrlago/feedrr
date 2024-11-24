import feedparser
from app.db.crud import FeedCRUD, PublicationHistoryCRUD  # Updated import path
from app.services.telegram_sender import TelegramSender
from app.services.cache_service import RedisCache

class FeedManager:
    def __init__(self, telegram_sender: TelegramSender, feed_crud: FeedCRUD, history_crud: PublicationHistoryCRUD):
        self.telegram_sender = telegram_sender
        self.feed_crud = feed_crud
        self.history_crud = history_crud
        self.cache = RedisCache()

    async def process_feeds(self):
        feeds = self.feed_crud.get_feed_entries()
        for feed in feeds:
            parsed_feed = feedparser.parse(feed.link)
            for entry in parsed_feed.entries:
                if not self.history_crud.get_publication_history(feed.id, entry.link):
                    self.telegram_sender.send_message(entry.title, entry.link)
                    self.history_crud.add_publication_history(feed.id, entry.title, entry.link, entry.published)

    async def process_feed(self, feed_id: int) -> dict:
        cache_key = f"feed:{feed_id}:latest"
        
        # Try cache first
        if cached_data := await self.cache.get(cache_key):
            return cached_data
            
        # Process feed normally
        data = await self._process_feed_entries(feed_id)
        
        # Cache results
        await self.cache.set(cache_key, data)
        
        return data