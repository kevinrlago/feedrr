# tests/schemas/test_filter_schema.py
import pytest
from app.schemas.filter import FilterWordCreate

def test_filter_word_validation():
    word = FilterWordCreate(word="python")
    assert word.word == "python"

    with pytest.raises(ValidationError):
        FilterWordCreate(word="")  # Empty word not allowed