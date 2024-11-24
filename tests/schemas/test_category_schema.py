# tests/schemas/test_category_schema.py
import pytest
from pydantic import ValidationError
from app.schemas.category import CategoryCreate, CategoryUpdate

def test_category_create_validation():
    category = CategoryCreate(
        name="Test Category",
        description="Test Description"
    )
    assert category.name == "Test Category"

    with pytest.raises(ValidationError):
        CategoryCreate(name="")  # Empty name not allowed