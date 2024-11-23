from telegram import Bot

class TelegramSender:
    def __init__(self, bot_token: str, chat_id: str):
        self.bot = Bot(token=bot_token)
        self.chat_id = chat_id

    def send_message(self, title: str, link: str):
        message = f"{title}\n{link}"
        self.bot.send_message(chat_id=self.chat_id, text=message)

    def send_error_notification(self, error_message: str):
        self.bot.send_message(chat_id=self.chat_id, text=f"Error: {error_message}")