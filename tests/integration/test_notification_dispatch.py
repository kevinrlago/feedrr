# tests/integration/test_notification_dispatch.py
@pytest.mark.integration
async def test_notification_pipeline(test_db):
    from app.services import NotificationService
    service = NotificationService(test_db)
    result = await service.process_notifications()
    assert result is True