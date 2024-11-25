# tests/utils/test_validators.py
import pytest
from app.utils.validators import validate_password

def test_password_validation():
    assert validate_password("short")[0] is False
    assert validate_password("nouppercaseornumber")[0] is False
    assert validate_password("ValidPass123")[0] is True