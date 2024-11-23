# Standard library imports
import asyncio
from typing import List, Optional
from datetime import timedelta

# FastAPI imports
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

# Database imports
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, get_db
from app.db.init_db import init_db  # Update this import

# Models imports
from app.models.user import User
from app.models.feed import Feed
from app.models.category import Category
from app.models.feed_request import FeedRequest

# Schemas imports
from app.schemas.feed import FeedEntry, FeedEntryCreate
from app.schemas.category import CategoryCreate, CategoryRead  # Add this import
from app.schemas.user import UserCreate, UserLogin

# Services imports
from app.services.feed_manager import FeedManager
from app.services.notification_service import NotificationService
from app.services.message_dispatcher import MessageDispatcher
from app.services.telegram_sender import TelegramSender

# Auth imports
from app.api.v1.auth import create_access_token, get_current_user, authenticate_user

# CRUD imports
from app.db.crud import FeedCRUD, CategoryCRUD, PublicationHistoryCRUD  # Updated import path

# Config imports
from app.core.config import CONFIG

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Define the expiration time for access tokens

from app.api import api_router
import uvicorn

app = FastAPI(title="Feedrr API")
app.include_router(api_router)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path not in ["/login", "/token"]:
        try:
            current_user: User = await get_current_user(request)
        except Exception:
            return RedirectResponse(url="/login")
    response = await call_next(request)
    return response

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"status": "ok", "message": "RSS Haiku API"}

@app.get("/login")
async def login():
    return {"message": "Please log in"}

# Feeds
@app.get("/feeds", response_model=List[FeedEntry])
async def get_feeds(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    feed_crud = FeedCRUD(db)
    return feed_crud.get_feed_entries()

@app.post("/feeds", response_model=FeedEntry)
async def create_feed(feed: FeedEntryCreate, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    feed_crud = FeedCRUD(db)
    return feed_crud.add_feed_entry(feed)

@app.delete("/feeds/{feed_id}")
async def delete_feed(feed_id: int, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    feed_crud = FeedCRUD(db)
    feed = feed_crud.get_feed_entry(feed_id)
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    feed_crud.delete_feed_entry(feed_id)
    return {"message": "Feed deleted"}

@app.put("/feeds/{feed_id}", response_model=FeedEntry)
async def update_feed(feed_id: int, feed: FeedEntryCreate, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    feed_crud = FeedCRUD(db)
    existing_feed = feed_crud.get_feed_entry(feed_id)
    if existing_feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed_crud.update_feed_entry(feed_id, feed)

# Categories
@app.get("/categories", response_model=List[CategoryRead])  # Update return type annotation to use Pydantic schema
async def get_categories(
    db: Session = Depends(get_db), 
    current_user: Optional[User] = Depends(get_current_user)
):
    categories = db.query(Category).all()
    return categories

@app.post("/categories", response_model=CategoryRead)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    category_crud = CategoryCRUD(db)
    category = category_crud.get_category(category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    category_crud.delete_category(category_id)
    return {"message": "Category deleted"}

@app.put("/categories/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in category.dict().items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category

# Telegram Config
@app.get("/config/telegram")
async def get_telegram_config(current_user: Optional[User] = Depends(get_current_user)):
    return {
        "botToken": CONFIG['telegram']['bot_token'],
        "chatId": CONFIG['telegram']['chat_id'],
        "chats": CONFIG['telegram']['chats']
    }

@app.post("/config/telegram")
async def update_telegram_config(botToken: str, chatId: str, current_user: Optional[User] = Depends(get_current_user)):
    CONFIG['telegram']['bot_token'] = botToken
    CONFIG['telegram']['chat_id'] = chatId
    # Aquí deberías guardar la configuración actualizada en un archivo o base de datos
    return {"message": "Configuración de Telegram actualizada"}

# Authentication
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: Optional[User] = Depends(get_current_user)):
    return current_user

@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    asyncio.create_task(background_task())

async def background_task():
    """Tarea en segundo plano para procesar feeds"""
    while True:
        db = SessionLocal()
        try:
            telegram_sender = TelegramSender(
                bot_token=CONFIG['telegram']['bot_token'],
                chat_id=CONFIG['telegram']['chat_id']
            )
            feed_crud = FeedCRUD(db)
            history_crud = PublicationHistoryCRUD(db)
            feed_manager = FeedManager(telegram_sender, feed_crud, history_crud)
            
            await feed_manager.process_feeds()
        finally:
            db.close()
        
        await asyncio.sleep(CONFIG.get('rss_sync_interval', 300))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)