# app/schemas/auth.py
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class MagicLinkRequest(BaseModel):
    email: EmailStr