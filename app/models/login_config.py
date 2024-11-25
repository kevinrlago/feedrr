# app/models/login_config.py
from sqlalchemy import Column, Boolean, Integer
from app.db.base_class import Base

class LoginConfig(Base):
    __tablename__ = "login_config"
    
    id = Column(Integer, primary_key=True)
    is_public = Column(Boolean, default=True)  # New field
    password_enabled = Column(Boolean, default=True)
    magic_link_enabled = Column(Boolean, default=False)
    oauth_google_enabled = Column(Boolean, default=False)
    oauth_github_enabled = Column(Boolean, default=False)