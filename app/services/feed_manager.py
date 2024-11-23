import feedparser
from app.db.crud import FeedCRUD, PublicationHistoryCRUD  # Updated import path
from app.services.telegram_sender import TelegramSender

class FeedManager:
    def __init__(self, telegram_sender: TelegramSender, feed_crud: FeedCRUD, history_crud: PublicationHistoryCRUD):
        self.telegram_sender = telegram_sender
        self.feed_crud = feed_crud
        self.history_crud = history_crud

    async def process_feeds(self):
        feeds = self.feed_crud.get_feed_entries()
        for feed in feeds:
            parsed_feed = feedparser.parse(feed.link)
            for entry in parsed_feed.entries:
                if not self.history_crud.get_publication_history(feed.id, entry.link):
                    self.telegram_sender.send_message(entry.title, entry.link)
                    self.history_crud.add_publication_history(feed.id, entry.title, entry.link, entry.published)