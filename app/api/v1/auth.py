from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, APIKeyHeader
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.core.config import CONFIG
from app.services.email_service import send_reset_password_email, EmailService
from app.core.security import create_access_token, verify_password
from app.schemas.auth import Token, MagicLinkRequest

router = APIRouter()
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
api_key_header = APIKeyHeader(name="X-API-Key")

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    api_key: Optional[str] = Depends(api_key_header),
    db: Session = Depends(get_db)
) -> User:
    """Get current user from token or API key"""
    if api_key:
        user = db.query(User).filter(User.api_key == api_key).first()
        if user:
            return user
    
    # Fallback to JWT token authentication
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/password-reset")
def reset_password(email: str, db: Session = Depends(get_db)):
    user = get_user(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = create_access_token({"sub": user.email}, expires_delta=timedelta(hours=1))
    send_reset_password_email(user.email, token)
    return {"msg": "Password reset email sent"}

@router.post("/password-reset/confirm")
def reset_password_confirm(token: str, new_password: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = get_user(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return {"msg": "Password reset successful"}

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Traditional username/password login"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/magic-link")
async def request_magic_link(
    email_request: MagicLinkRequest,
    db: Session = Depends(get_db)
):
    """Request magic link login"""
    user = db.query(User).filter(User.email == email_request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    token = create_access_token(
        data={"sub": user.username, "type": "magic_link"},
        expires_delta=timedelta(minutes=15)
    )
    
    email_service = EmailService()
    await email_service.send_magic_link(user.email, token)
    
    return {"message": "Magic link sent to your email"}

@router.post("/api-keys")
async def create_api_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate API key for user"""
    api_key = secrets.token_urlsafe(32)
    current_user.api_key = api_key
    db.commit()
    
    return {"api_key": api_key}