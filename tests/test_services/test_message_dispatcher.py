# tests/services/test_message_dispatcher.py
import pytest
from unittest.mock import patch, MagicMock
from app.services.message_dispatcher import MessageDispatcher
from app.core.constants import Platform

@pytest.fixture
def dispatcher():
    return MessageDispatcher()

async def test_dispatch_telegram_message(dispatcher):
    with patch('telegram.Bot.send_message') as mock_send:
        result = await dispatcher.dispatch_message(
            platform=Platform.TELEGRAM,
            destination_id="123456",
            message="Test message"
        )
        assert result is True
        mock_send.assert_called_once()

async def test_dispatch_discord_message(dispatcher):
    with patch('discord.Client.send_message') as mock_send:
        result = await dispatcher.dispatch_message(
            platform=Platform.DISCORD,
            destination_id="channel_id",
            message="Test message"
        )
        assert result is True
        mock_send.assert_called_once()

async def test_dispatch_whatsapp_message(dispatcher):
    with patch('whatsapp_api_client_python.API.message_send') as mock_send:
        result = await dispatcher.dispatch_message(
            platform=Platform.WHATSAPP,
            destination_id="+1234567890",
            message="Test message"
        )
        assert result is True
        mock_send.assert_called_once()

async def test_invalid_platform(dispatcher):
    with pytest.raises(ValueError):
        await dispatcher.dispatch_message(
            platform="invalid",
            destination_id="123",
            message="Test"
        )