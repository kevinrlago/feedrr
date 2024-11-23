# app/core/constants.py
from enum import Enum

class UserRole(Enum):
    ADMIN = "admin"
    VALIDATOR = "validator"
    PRO_USER = "pro_user"
    BASIC_USER = "basic_user"

class RequestStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

# Add Platform enum
class Platform(Enum):
    TELEGRAM = "telegram"
    DISCORD = "discord"
    WHATSAPP = "whatsapp"

class PublicationStatus(Enum):
    PENDING = "pending"
    PUBLISHED = "published"
    FAILED = "failed"
    SKIPPED = "skipped"