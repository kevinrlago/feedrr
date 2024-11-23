import pytest
from app.services.telegram_sender import TelegramSender
from unittest.mock import MagicMock

def test_send_message():
    bot = MagicMock()
    telegram_sender = TelegramSender(bot_token="dummy_token", chat_id="dummy_chat_id")
    telegram_sender.bot = bot

    telegram_sender.send_message("Test Title", "http://test.com")

    bot.send_message.assert_called_with(chat_id="dummy_chat_id", text="Test Title\nhttp://test.com")