# app/api/v1/login_config.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user, get_db
from app.models.login_config import LoginConfig

router = APIRouter()

@router.get("/login-config/public")
async def get_public_config(db = Depends(get_db)):
    config = db.query(LoginConfig).first()
    if config and config.is_public:
        return config
    return {"message": "Configuration not available"}

@router.get("/login-config")
async def get_config(current_user = Depends(get_current_user), db = Depends(get_db)):
    config = db.query(LoginConfig).first()
    if config and (config.is_public or current_user.is_admin):
        return config
    return {"message": "Unauthorized"}