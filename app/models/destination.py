# app/models/destination.py
from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class PlatformType(enum.Enum):
    TELEGRAM = "telegram"
    DISCORD = "discord"
    WHATSAPP = "whatsapp"

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True)
    platform = Column(Enum(PlatformType))
    destination_id = Column(String)
    name = Column(String)
    description = Column(String, nullable=True)