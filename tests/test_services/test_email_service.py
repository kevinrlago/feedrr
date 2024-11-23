# tests/test_services/test_email_service.py
import pytest
from app.services.email_service import EmailService

def test_send_email():
    service = EmailService()
    result = service.send_email(
        email="test@example.com",
        subject="Test Subject",
        body="Test Body"
    )
    assert result is True

def test_send_reset_password_email():
    service = EmailService()
    result = service.send_reset_password_email(
        email="test@example.com",
        token="reset-token"
    )
    assert result is True

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