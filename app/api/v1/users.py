# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.core.security import get_password_hash
from app.api.deps import get_current_user
from app.core.constants import UserRole, Language  # Add Language import

router = APIRouter()

@router.post("/", response_model=UserRead)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admins can create users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        **user.dict(exclude={'password'}),
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/exists")
async def check_users_exist(db: Session = Depends(get_db)):
    """Check if any users exist in the system"""
    count = db.query(User).count()
    return {"exists": count > 0}

@router.post("/first", response_model=UserRead)
async def create_first_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Create first admin user if no users exist"""
    try:
        # Check if users exist
        user_count = db.query(User).count()
        if user_count > 0:
            raise HTTPException(
                status_code=403,
                detail="System already has users"
            )
        
        # Check if username already exists
        existing_user = db.query(User).filter(
            (User.username == user.username) | 
            (User.email == user.email)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists"
            )
        
        # Create first user as admin
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            role=UserRole.ADMIN
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
        
    except Exception as e:
        db.rollback()
        if "duplicate key" in str(e):
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists"
            )
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )

@router.get("/", response_model=List[UserRead])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admins can list users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update current user's info
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password" and value:
            value = get_password_hash(value)
            key = "hashed_password"
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/me/language")
async def update_language_preference(
    language: Language,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.preferred_language = language
    db.commit()
    return {"message": "Language preference updated"}

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admins can delete users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}