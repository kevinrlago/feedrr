from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import User, UserRole
from app.schemas import UserCreate, UserRead, UserUpdate
from app.auth import get_current_user, get_password_hash, create_access_token
from app.email import send_reset_password_email

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users", response_model=UserRead)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password) if user.password else None
    db_user = User(email=user.email, nickname=user.nickname, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users", response_model=List[UserRead])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserRead)
async def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN] and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

@router.put("/users/{user_id}", response_model=UserRead)
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN] and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    if user.email:
        db_user.email = user.email
    if user.nickname:
        db_user.nickname = user.nickname
    if user.password:
        db_user.hashed_password = get_password_hash(user.password)
    if user.role and current_user.role == UserRole.ADMIN:
        db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", response_model=UserRead)
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db.delete(db_user)
    db.commit()
    return db_user

@router.post("/users/reset-password", response_model=dict)
async def reset_password(email: EmailStr, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    token = create_access_token(data={"sub": user.email})
    await send_reset_password_email(email, token, background_tasks)
    return {"message": "Password reset email sent"}