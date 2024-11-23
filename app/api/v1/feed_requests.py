# app/api/v1/feed_requests.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models import User, FeedRequest
from app.schemas.feed_request import FeedRequestRead
from app.api.deps import get_current_user
from app.core.constants import UserRole, RequestStatus

router = APIRouter()

@router.get("/", response_model=List[FeedRequestRead])
async def get_feed_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VALIDATOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return db.query(FeedRequest).all()

@router.post("/{request_id}/approve")
async def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VALIDATOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
        
    feed_request = db.query(FeedRequest).filter(FeedRequest.id == request_id).first()
    if not feed_request:
        raise HTTPException(status_code=404, detail="Feed request not found")
        
    feed_request.status = RequestStatus.APPROVED
    feed_request.handled_by = current_user.id
    db.commit()
    
    return {"message": "Feed request approved"}

@router.post("/{request_id}/reject")
async def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VALIDATOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
        
    feed_request = db.query(FeedRequest).filter(FeedRequest.id == request_id).first()
    if not feed_request:
        raise HTTPException(status_code=404, detail="Feed request not found")
        
    feed_request.status = RequestStatus.REJECTED
    feed_request.handled_by = current_user.id
    db.commit()
    
    return {"message": "Feed request rejected"}