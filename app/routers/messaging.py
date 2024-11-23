# app/routers/messaging.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.message_dispatcher import MessageDispatcher
from app.models.destination import Destination, PlatformType
from pydantic import BaseModel

router = APIRouter()
dispatcher = MessageDispatcher()

class MessageRequest(BaseModel):
    destination_id: str
    message: str
    platform: PlatformType

@router.post("/send")
async def send_message(request: MessageRequest, db: Session = Depends(get_db)):
    try:
        destination = db.query(Destination).filter(
            Destination.destination_id == request.destination_id,
            Destination.platform == request.platform
        ).first()
        
        if not destination:
            raise HTTPException(status_code=404, message="Destination not found")
        
        success = await dispatcher.dispatch_message(
            request.platform.value,
            request.destination_id,
            request.message
        )
        
        if success:
            return {"status": "success", "message": "Message sent successfully"}
        else:
            raise HTTPException(status_code=500, message="Failed to send message")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))