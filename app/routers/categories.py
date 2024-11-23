from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import CategoryCreate, CategoryRead, CategoryUpdate
from app.db.crud import CRUDCategory
from app.auth import get_current_user
from app.models import UserRole

router = APIRouter()

def get_category_crud(db: Session = Depends(get_db)):
    return CRUDCategory(db)

@router.get("/", response_model=List[CategoryRead])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category_crud = get_category_crud(db)
    return category_crud.get_categories(skip=skip, limit=limit)

@router.post("/", response_model=CategoryRead)
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    category_crud = get_category_crud(db)
    return category_crud.create_category(category)

@router.put("/{category_id}", response_model=CategoryRead)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    category_crud = get_category_crud(db)
    return category_crud.update_category(category_id, category)

@router.delete("/{category_id}", response_model=CategoryRead)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.PRO_USER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    category_crud = get_category_crud(db)
    return category_crud.delete_category(category_id)