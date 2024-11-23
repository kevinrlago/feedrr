# app/services/__init__.py
from .rss_parser import RSSParser
from .feed_manager import FeedManager
from .telegram_sender import TelegramSender
from typing import Optional
from sqlalchemy.orm import Session

from app.services.feed_service import FeedService
from app.services.notification_service import NotificationService
from app.services.message_dispatcher import MessageDispatcher
from app.services.email_service import EmailService

class ServiceProvider:
    def __init__(self, db: Session):
        self.db = db
        self._feed_service: Optional[FeedService] = None
        self._notification_service: Optional[NotificationService] = None
        self._message_dispatcher: Optional[MessageDispatcher] = None
        self._email_service: Optional[EmailService] = None

    @property
    def feed_service(self) -> FeedService:
        if not self._feed_service:
            self._feed_service = FeedService(self.db)
        return self._feed_service

    @property
    def notification_service(self) -> NotificationService:
        if not self._notification_service:
            self._notification_service = NotificationService(self.db)
        return self._notification_service

    @property
    def message_dispatcher(self) -> MessageDispatcher:
        if not self._message_dispatcher:
            self._message_dispatcher = MessageDispatcher()
        return self._message_dispatcher

    @property
    def email_service(self) -> EmailService:
        if not self._email_service:
            self._email_service = EmailService()
        return self._email_service

# Export commonly used items
__all__ = [
    "ServiceProvider",
    "FeedService",
    "NotificationService",
    "MessageDispatcher",
    "EmailService",
    'RSSParser', 
    'TelegramSender', 
    'FeedManager'
]