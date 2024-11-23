# tests/test_services/test_notification_service.py
import pytest
from app.services.notification_service import NotificationService
from app.models.user import User
from app.core.constants import UserRole

def test_notify_validators(test_db):
    service = NotificationService(test_db)
    validator = User(
        username="validator",
        email="validator@example.com",
        role=UserRole.VALIDATOR
    )
    test_db.add(validator)
    test_db.commit()

    result = service.notify_validators("Test message")
    assert result is True

def test_notify_admin_when_no_validators(test_db):
    service = NotificationService(test_db)
    admin = User(
        username="admin",
        email="admin@example.com",
        role=UserRole.ADMIN
    )
    test_db.add(admin)
    test_db.commit()

    result = service.notify_validators("Test message")
    assert result is True

def test_send_notification(test_db):
    service = NotificationService(test_db)
    user = User(
        username="test",
        email="test@example.com",
        notification_platform="telegram",
        notification_destination="123456"
    )
    test_db.add(user)
    test_db.commit()

    result = service.send_notification(user, "Test message")
    assert result is True