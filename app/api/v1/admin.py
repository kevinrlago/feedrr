# app/api/v1/admin.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_admin_user
from app.models.login_config import LoginConfig

router = APIRouter()

@router.get("/login-config")
async def get_login_config(current_user = Depends(get_current_admin_user)):
    return await LoginConfig.first()

@router.put("/login-config")
async def update_login_config(config: LoginConfig, current_user = Depends(get_current_admin_user)):
    await config.save()
    return config