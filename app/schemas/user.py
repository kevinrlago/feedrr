# app/schemas/user.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from app.core.constants import UserRole

class UserBase(BaseModel):
    username: str  # Required username
    email: EmailStr  # Required email
    role: Optional[UserRole] = UserRole.BASIC_USER  # Optional role with default
    notification_platform: Optional[str] = None
    notification_destination: Optional[str] = None

class UserCreate(UserBase):
    password: constr(min_length=8)  # Required password with min length

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(UserBase):
    password: Optional[constr(min_length=8)] = None

# Add UserRead schema
class UserRead(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class UserInDB(UserBase):
    id: int
    hashed_password: str

    class Config:
        from_attributes = True

class User(UserBase):
    id: int

    class Config:
        from_attributes = True