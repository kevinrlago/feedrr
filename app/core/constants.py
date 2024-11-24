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

class Language(Enum):
    ENGLISH = "en"      # English
    SPANISH = "es"      # Spanish
    CHINESE = "zh"      # Chinese (Mandarin)
    HINDI = "hi"        # Hindi
    ARABIC = "ar"       # Arabic
    BENGALI = "bn"      # Bengali
    PORTUGUESE = "pt"   # Portuguese
    RUSSIAN = "ru"      # Russian
    JAPANESE = "ja"     # Japanese
    GERMAN = "de"       # German

    @classmethod
    def get_language_name(cls, code):
        names = {
            "en": "English",
            "es": "Español",
            "zh": "中文",
            "hi": "हिन्दी",
            "ar": "العربية",
            "bn": "বাংলা",
            "pt": "Português",
            "ru": "Русский",
            "ja": "日本語",
            "de": "Deutsch"
        }
        return names.get(code, code)