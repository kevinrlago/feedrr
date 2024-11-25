# tests/services/test_translation_service.py
import pytest
from unittest.mock import patch
from app.services.translation_service import TranslationService
from app.core.constants import Language

@pytest.mark.asyncio
async def test_translate_text():
    service = TranslationService()
    
    with patch('httpx.AsyncClient.post') as mock_post:
        mock_post.return_value.json.return_value = mock_translation_response()
        
        result = await service.translate_text(
            "Test text",
            target_language=Language.SPANISH
        )
        assert result == "Texto traducido"

@pytest.mark.asyncio
async def test_translate_feed_entry():
    service = TranslationService()
    
    entry = {
        "title": "Test Title",
        "description": "Test Description"
    }
    
    with patch('httpx.AsyncClient.post') as mock_post:
        mock_post.return_value.json.return_value = mock_translation_response()
        
        translated = await service.translate_feed_entry(
            entry,
            target_language=Language.SPANISH
        )
        assert translated["title"] == "Texto traducido"
        assert translated["description"] == "Texto traducido"