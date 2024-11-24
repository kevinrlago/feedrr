# tests/test_services/test_email_service.py
import pytest
from unittest.mock import patch
from app.services.email_service import EmailService

@pytest.mark.asyncio
async def test_send_email():
    service = EmailService()
    with patch('fastapi_mail.FastMail.send_message') as mock_send:
        await service.send_email(
            email="test@example.com",
            subject="Test",
            body="Test body"
        )
        mock_send.assert_called_once()

@pytest.mark.asyncio
async def test_send_magic_link():
    service = EmailService()
    with patch('fastapi_mail.FastMail.send_message') as mock_send:
        await service.send_magic_link(
            email="test@example.com",
            token="test-token"
        )
        mock_send.assert_called_once()

@pytest.mark.parametrize("email", [
    "invalid-email",
    "",
    None
])
def test_invalid_email(email):
    service = EmailService()
    with pytest.raises(ValueError):
        service.send_email(
            email=email,
            subject="Test Subject",
            body="Test Body"
        )