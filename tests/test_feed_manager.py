import pytest
from app.services.feed_manager import FeedManager
from app.services.telegram_sender import TelegramSender
from app.database.crud import FeedCRUD
from app.database.models import FeedEntry
from unittest.mock import MagicMock

@pytest.mark.asyncio
async def test_process_feeds():
    telegram_sender = MagicMock(TelegramSender)
    feed_crud = MagicMock(FeedCRUD)
    feed_manager = FeedManager(telegram_sender, feed_crud)

    feed_crud.get_feed_entries.return_value = [
        FeedEntry(title="Test Feed", link="http://test.com/rss", published=None)
    ]

    await feed_manager.process_feeds()

    telegram_sender.send_message.assert_called_with("Test Feed", "http://test.com/rss")