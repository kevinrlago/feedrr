# tests/integration/test_message_queue.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.queue import message_queue

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def clear_queue():
    """Clear message queue before each test"""
    message_queue.clear()
    yield
    message_queue.clear()

def test_enqueue_message():
    """Test enqueuing a message"""
    message = {"type": "test", "payload": "test_payload"}
    message_queue.enqueue(message)
    assert len(message_queue) == 1

def test_dequeue_message():
    """Test dequeuing a message"""
    message = {"type": "test", "payload": "test_payload"}
    message_queue.enqueue(message)
    dequeued_message = message_queue.dequeue()
    assert dequeued_message == message
    assert len(message_queue) == 0

def test_message_processing():
    """Test message processing"""
    processed_messages = []

    def process_message(message):
        processed_messages.append(message)

    message_queue.register_processor("test", process_message)
    message = {"type": "test", "payload": "test_payload"}
    message_queue.enqueue(message)
    message_queue.process()
    assert len(processed_messages) == 1
    assert processed_messages[0] == message

def test_message_queue_integration_with_api():
    """Test message queue integration with API endpoints"""
    response = client.post("/api/v1/messages", json={"type": "test", "payload": "test_payload"})
    assert response.status_code == 200
    assert len(message_queue) == 1

    dequeued_message = message_queue.dequeue()
    assert dequeued_message["type"] == "test"
    assert dequeued_message["payload"] == "test_payload"