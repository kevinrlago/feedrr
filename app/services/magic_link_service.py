# app/services/magic_link_service.py
from datetime import datetime, timedelta
import secrets
from typing import Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.email_service import EmailService
from app.core.config import CONFIG
from app.core.security import create_access_token

class MagicLinkService:
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()
        self.token_expiry = timedelta(minutes=15)
        self._tokens = {}  # In-memory token storage

    def generate_magic_link(self, email: str) -> str:
        """Generate a magic link token for email"""
        token = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + self.token_expiry
        
        self._tokens[token] = {
            "email": email,
            "expires_at": expiry
        }
        
        base_url = CONFIG["frontend_url"]
        magic_link = f"{base_url}/auth/verify?token={token}"
        
        # Send magic link email
        self.email_service.send_email(
            to_email=email,
            subject="Your Login Link",
            content=f"Click here to login: {magic_link}"
        )
        
        return token

    def verify_token(self, token: str) -> Optional[User]:
        """Verify a magic link token and return associated user"""
        token_data = self._tokens.get(token)
        
        if not token_data:
            return None
            
        if datetime.utcnow() > token_data["expires_at"]:
            del self._tokens[token]
            return None
            
        user = (self.db.query(User)
                .filter(User.email == token_data["email"])
                .first())
                
        if user:
            # Clean up used token
            del self._tokens[token]
            return user
            
        return None

    def create_login_session(self, user: User) -> dict:
        """Create login session for verified user"""
        access_token = create_access_token(
            data={"sub": user.email}
        )
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }