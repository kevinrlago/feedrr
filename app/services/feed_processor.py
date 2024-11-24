# app/services/feed_processor.py
from langdetect import detect
from typing import Dict, Any
from datetime import datetime
import feedparser
from bs4 import BeautifulSoup

class FeedProcessor:
    def process_entry(self, entry: feedparser.FeedParserDict) -> Dict[Any, Any]:
        """Process a feed entry and extract relevant information."""
        
        # Extract text content
        description = entry.get('description', '')
        content = entry.get('content', [{}])[0].get('value', '')
        
        # Clean HTML
        clean_description = BeautifulSoup(description, 'html.parser').get_text()
        clean_content = BeautifulSoup(content, 'html.parser').get_text()
        
        # Detect language
        try:
            language = detect(clean_content if clean_content else clean_description)
        except:
            language = 'unknown'

        # Extract media if present
        media_content = entry.get('media_content', [])
        images = [media['url'] for media in media_content if 'image' in media.get('type', '')]
        
        # Build structured entry data
        processed_entry = {
            'title': entry.get('title', ''),
            'link': entry.get('link', ''),
            'guid': entry.get('id', entry.get('link', '')),
            'published': datetime.fromtimestamp(
                entry.get('published_parsed', datetime.now().timestamp())
            ),
            'author': entry.get('author', ''),
            'description': clean_description,
            'content': clean_content,
            'language': language,
            'images': images,
            'categories': entry.get('tags', []),
            'metadata': {
                'source_feed_title': entry.feed.get('title', ''),
                'source_feed_language': entry.feed.get('language', 'unknown'),
                'word_count': len((clean_content or clean_description).split()),
                'has_media': bool(images),
            }
        }
        
        return processed_entry