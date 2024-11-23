import pytest
from app.services.rss_parser import RSSParser
import asyncio

@pytest.mark.asyncio
async def test_parse_feed():
    """Test básico de parseo de RSS"""
    test_url = "https://www.xataka.com/feed"
    
    try:
        entries = await RSSParser.parse_feed(test_url)
        
        # Verificaciones básicas
        assert isinstance(entries, list)
        assert len(entries) > 0
        
        # Verificar estructura de las entradas
        for entry in entries:
            assert 'title' in entry
            assert 'link' in entry
            assert 'published' in entry
    
    except Exception as e:
        pytest.fail(f"Error parseando feed: {e}")

def test_rss_parser_initialization():
    """Test de inicialización del parser"""
    assert RSSParser is not None