# app/services/translation_service.py
from typing import Dict
import httpx
from app.core.constants import Language
from app.core.config import CONFIG

class TranslationService:
    def __init__(self):
        self.api_key = CONFIG["translation"]["api_key"]
        self.base_url = "https://translation.googleapis.com/language/translate/v2"

    async def translate_text(self, text: str, target_language: Language, source_language: str = None) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                params={
                    "key": self.api_key
                },
                json={
                    "q": text,
                    "target": target_language.value,
                    "source": source_language,
                }
            )
            data = response.json()
            return data["data"]["translations"][0]["translatedText"]

    async def translate_feed_entry(self, entry: dict, target_language: Language) -> dict:
        translated_entry = entry.copy()
        translated_entry["title"] = await self.translate_text(entry["title"], target_language)
        if entry.get("description"):
            translated_entry["description"] = await self.translate_text(entry["description"], target_language)
        return translated_entry