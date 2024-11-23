# app/routers/feeds.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import User, FeedRequest, UserRole
from app.services.notification_service import NotificationService

router = APIRouter()

@router.post("/request")
async def request_feed(
    request: FeedRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role in [UserRole.ADMIN, UserRole.VALIDATOR]:
        # Direct feed creation for admins and validators
        return await create_feed(request, db)
    
    # Create feed request for other users
    feed_request = FeedRequest(
        name=request.name,
        url=request.url,
        category_id=request.category_id,
        requester_id=current_user.id
    )
    db.add(feed_request)
    db.commit()

    # Notify validators
    notification_service = NotificationService(db)
    await notification_service.notify_validators(
        f"New feed request: {request.name} by {current_user.username}"
    )

    return {"message": "Feed request submitted successfully"}

@router.get("/requests")
async def get_feed_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VALIDATOR]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    requests = db.query(FeedRequest).filter(FeedRequest.status == RequestStatus.PENDING).all()
    return requests

@router.post("/requests/{request_id}/approve")
async def approve_feed_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VALIDATOR]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    feed_request = db.query(FeedRequest).filter(FeedRequest.id == request_id).first()
    if not feed_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    feed_request.status = RequestStatus.APPROVED
    feed_request.handled_by = current_user.id
    
    # Create the actual feed
    await create_feed(FeedRequestCreate(**feed_request.__dict__), db)
    
    db.commit()
    return {"message": "Feed request approved and feed created"}