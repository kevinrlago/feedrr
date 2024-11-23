# app/services/message_service.py
from abc import ABC, abstractmethod
import telegram
import discord
from discord.ext import commands
import asyncio
from whatsapp_api_client_python import API

class MessageService(ABC):
    @abstractmethod
    async def send_message(self, destination_id: str, message: str):
        pass

class TelegramService(MessageService):
    def __init__(self, token: str):
        self.bot = telegram.Bot(token=token)
    
    async def send_message(self, chat_id: str, message: str):
        try:
            await self.bot.send_message(chat_id=chat_id, text=message)
            return True
        except Exception as e:
            print(f"Error sending Telegram message: {e}")
            return False

class DiscordService(MessageService):
    def __init__(self, token: str):
        self.bot = commands.Bot(command_prefix="!")
        self.token = token
    
    async def send_message(self, channel_id: str, message: str):
        try:
            channel = self.bot.get_channel(int(channel_id))
            await channel.send(message)
            return True
        except Exception as e:
            print(f"Error sending Discord message: {e}")
            return False
    
    async def start(self):
        await self.bot.start(self.token)

class WhatsAppService(MessageService):
    def __init__(self, api_key: str):
        self.api = API(api_key)
    
    async def send_message(self, phone_number: str, message: str):
        try:
            self.api.message_send(phone_number, message)
            return True
        except Exception as e:
            print(f"Error sending WhatsApp message: {e}")
            return False