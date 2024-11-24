# tests/schemas/test_publication_schema.py
import pytest
from app.schemas.publication import PublicationCreate
from app.core.constants import Platform

def test_publication_create_validation():
    pub = PublicationCreate(
        feed_entry_id=1,
        platform=Platform.TELEGRAM,
        destination_id="123456"
    )
    assert pub.platform == Platform.TELEGRAM

    with pytest.raises(ValidationError):
        PublicationCreate(
            feed_entry_id=1,
            platform="invalid",  # Invalid platform
            destination_id="123456"
        )