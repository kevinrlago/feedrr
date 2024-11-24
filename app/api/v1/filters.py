# app/api/v1/filters.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models import Feed, FilterWord
from app.schemas.filter import FilterWordCreate

router = APIRouter()

@router.post("/feeds/{feed_id}/whitelist")
async def add_to_whitelist(
    feed_id: int,
    words: List[str],
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(Feed.id == feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    
    for word in words:
        filter_word = db.query(FilterWord).filter(FilterWord.word == word).first()
        if not filter_word:
            filter_word = FilterWord(word=word)
            db.add(filter_word)
        feed.whitelist_words.append(filter_word)
    
    db.commit()
    return {"message": "Words added to whitelist"}

@router.post("/feeds/{feed_id}/blacklist")
async def add_to_blacklist(
    feed_id: int,
    words: List[str],
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(Feed.id == feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    
    for word in words:
        filter_word = db.query(FilterWord).filter(FilterWord.word == word).first()
        if not filter_word:
            filter_word = FilterWord(word=word)
            db.add(filter_word)
        feed.blacklist_words.append(filter_word)
    
    db.commit()
    return {"message": "Words added to blacklist"}