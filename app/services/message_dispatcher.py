# app/services/message_dispatcher.py
from typing import Dict
from .message_service import MessageService, TelegramService, DiscordService, WhatsAppService
from app.core.config import CONFIG

class MessageDispatcher:
    def __init__(self):
        self.services: Dict[str, MessageService] = {
            'telegram': TelegramService(CONFIG['telegram']['bot_token']),
            'discord': DiscordService(CONFIG['discord']['bot_token']),
            'whatsapp': WhatsAppService(CONFIG['whatsapp']['api_key'])
        }
    
    async def dispatch_message(self, platform: str, destination_id: str, message: str):
        if platform not in self.services:
            raise ValueError(f"Unsupported platform: {platform}")
        
        service = self.services[platform]
        return await service.send_message(destination_id, message)

# Usage example:
# dispatcher = MessageDispatcher()
# await dispatcher.dispatch_message('telegram', 'chat_id', 'Hello from Telegram!')
# await dispatcher.dispatch_message('discord', 'channel_id', 'Hello from Discord!')
# await dispatcher.dispatch_message('whatsapp', 'phone_number', 'Hello from WhatsApp!')