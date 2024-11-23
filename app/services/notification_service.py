# app/services/notification_service.py
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.services.message_dispatcher import MessageDispatcher

class NotificationService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.dispatcher = MessageDispatcher()

    async def notify_validators(self, message: str):
        validators = self.db.query(User).filter(User.role == UserRole.VALIDATOR).all()
        
        if not validators:
            admins = self.db.query(User).filter(User.role == UserRole.ADMIN).all()
            for admin in admins:
                await self.send_notification(admin, message)
        else:
            for validator in validators:
                await self.send_notification(validator, message)

    async def send_notification(self, user: User, message: str):
        if user.notification_platform and user.notification_destination:
            await self.dispatcher.dispatch_message(
                user.notification_platform,
                user.notification_destination,
                message
            )