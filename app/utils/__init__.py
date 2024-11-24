# app/utils/__init__.py
from typing import Any, Dict, List
from datetime import datetime
import re
import urllib.parse
from app.utils.validators import validate_password
from app.utils.pagination import paginate

def validate_url(url: str) -> bool:
    """Validate if string is a valid URL."""
    try:
        result = urllib.parse.urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def sanitize_string(text: str) -> str:
    """Remove special characters and normalize text."""
    return re.sub(r'[^\w\s-]', '', text).strip()

def format_datetime(dt: datetime) -> str:
    """Format datetime to standard string format."""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """Split list into chunks of specified size."""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
    """Merge two dictionaries with nested structure."""
    merged = dict1.copy()
    for key, value in dict2.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = merge_dicts(merged[key], value)
        else:
            merged[key] = value
    return merged

__all__ = [
    "validate_url",
    "sanitize_string",
    "format_datetime",
    "chunk_list",
    "merge_dicts",
    "validate_password",
    "paginate"
]