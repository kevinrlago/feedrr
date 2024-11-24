# tests/integration/test_translation_pipeline.py
@pytest.mark.integration
async def test_translation_pipeline(test_db):
    from app.services import TranslationService
    service = TranslationService()
    result = await service.translate_feed(1)
    assert result is not None