from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

from app.core.config import CONFIG  # Add this import

# Get email config with defaults
mail_config = CONFIG.get('mail', {})
email_conf = ConnectionConfig(
    MAIL_USERNAME=mail_config.get('username', ''),
    MAIL_PASSWORD=mail_config.get('password', ''),
    MAIL_FROM=mail_config.get('from', ''),
    MAIL_PORT=mail_config.get('port', 587),
    MAIL_SERVER=mail_config.get('server', 'smtp.gmail.com'),
    MAIL_STARTTLS=mail_config.get('starttls', True),
    MAIL_SSL_TLS=mail_config.get('ssl_tls', False),
    USE_CREDENTIALS=True
)

class EmailService:
    def __init__(self):
        self.mail = FastMail(email_conf)

    async def send_email(
        self,
        email: EmailStr,
        subject: str,
        body: str
    ):
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=body,
            subtype="html"
        )
        
        await self.mail.send_message(message)

async def send_reset_password_email(email: EmailStr, token: str, background_tasks: BackgroundTasks):
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"Please use the following token to reset your password: {token}",
        subtype="plain"
    )
    fm = FastMail(email_conf)
    background_tasks.add_task(fm.send_message, message)

# app/services/email_service.py
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from pydantic import EmailStr
from typing import List