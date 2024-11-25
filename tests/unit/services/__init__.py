# tests/services/__init__.py
from typing import Any, Dict
import pytest
from unittest.mock import Mock, patch
from app.core.config import CONFIG
from app.models.user import User
from app.models.feed import Feed
from app.core.constants import Platform, Language

def mock_feed_response() -> Dict[Any, Any]:
    """Create mock feed response data"""
    return {
        'feed': {
            'title': 'Test Feed',
            'link': 'http://example.com'
        },
        'entries': [
            {
                'title': 'Test Entry',
                'link': 'http://example.com/1',
                'description': 'Test description'
            }
        ]
    }

def mock_translation_response() -> Dict[Any, Any]:
    """Create mock translation response"""
    return {
        'data': {
            'translations': [
                {'translatedText': 'Texto traducido'}
            ]
        }
    }

__all__ = ['mock_feed_response', 'mock_translation_response']