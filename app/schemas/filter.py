# app/schemas/filter.py
from pydantic import BaseModel, constr
from typing import List, Optional

class FilterWordBase(BaseModel):
    word: constr(min_length=1, strip_whitespace=True)

class FilterWordCreate(FilterWordBase):
    pass

class FilterWord(FilterWordBase):
    id: int
    feeds_whitelist_count: Optional[int] = 0
    feeds_blacklist_count: Optional[int] = 0

    class Config:
        from_attributes = True

class FilterUpdate(BaseModel):
    words: List[str]
    type: str  # 'whitelist' or 'blacklist'