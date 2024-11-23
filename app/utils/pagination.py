# app/utils/pagination.py
from typing import TypeVar, Generic, List
from pydantic import BaseModel

T = TypeVar('T')

class Page(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

def paginate(items: List[T], page: int, size: int) -> Page[T]:
    """Create pagination object for list of items."""
    start = (page - 1) * size
    end = start + size
    total = len(items)
    
    return Page(
        items=items[start:end],
        total=total,
        page=page,
        size=size,
        pages=((total - 1) // size) + 1
    )