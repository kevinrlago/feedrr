# app/models/api_key.py
from datetime import datetime, timedelta
import secrets
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    user = relationship("User", back_populates="api_keys")

    @classmethod
    def generate_key(cls) -> str:
        """Generate a secure random API key"""
        return secrets.token_urlsafe(32)

    @classmethod
    def create(cls, user_id: int, name: str, expires_in_days: int = 365):
        """Create a new API key"""
        return cls(
            key=cls.generate_key(),
            name=name,
            user_id=user_id,
            expires_at=datetime.utcnow() + timedelta(days=expires_in_days)
        )

    def is_valid(self) -> bool:
        """Check if the API key is valid"""
        if not self.is_active:
            return False
        if self.expires_at and datetime.utcnow() > self.expires_at:
            return False
        return True

    def revoke(self):
        """Revoke this API key"""
        self.is_active = False