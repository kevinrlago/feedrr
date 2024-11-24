# app/services/filter_service.py
from typing import Dict, Any
from app.models.feed import Feed  # Add this import

class FilterService:
    def check_entry_against_filters(self, entry: Dict[str, Any], feed: Feed) -> bool:
        """Return True if entry passes filters, False otherwise."""
        content = f"{entry.get('title', '')} {entry.get('description', '')}".lower()
        
        # If whitelist exists, content must contain at least one whitelist word
        if feed.whitelist_words:
            if not any(word.word.lower() in content for word in feed.whitelist_words):
                return False
        
        # If blacklist exists, content must not contain any blacklist word
        if feed.blacklist_words:
            if any(word.word.lower() in content for word in feed.blacklist_words):
                return False
        
        return True