# tests/test_services/test_message_dispatcher.py
import pytest
from app.services.message_dispatcher import MessageDispatcher
from app.core.constants import Platform

def test_dispatch_message():
    dispatcher = MessageDispatcher()
    result = dispatcher.dispatch_message(
        platform=Platform.TELEGRAM,
        destination_id="123456",
        message="Test message"
    )
    assert result is True

def test_invalid_platform():
    dispatcher = MessageDispatcher()
    with pytest.raises(ValueError):
        dispatcher.dispatch_message(
            platform="invalid",
            destination_id="123456",
            message="Test message"
        )

@pytest.mark.parametrize("platform,destination_id", [
    (Platform.TELEGRAM, "123456"),
    (Platform.DISCORD, "server/channel"),
    (Platform.WHATSAPP, "+1234567890")
])
def test_platform_specific_dispatch(platform, destination_id):
    dispatcher = MessageDispatcher()
    result = dispatcher.dispatch_message(
        platform=platform,
        destination_id=destination_id,
        message="Test message"
    )
    assert result is True