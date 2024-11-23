# tests/__init__.py
import os
import sys
import pytest

# Add app directory to Python path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Test constants
TEST_DATABASE_URL = "postgresql://test_user:test_password@localhost/test_rss_haiku"
TEST_ADMIN_USERNAME = "testadmin"
TEST_ADMIN_EMAIL = "testadmin@example.com"
TEST_ADMIN_PASSWORD = "testpassword123"

# Test configuration
pytest_plugins = [
    "tests.conftest",
]

def pytest_configure(config):
    """Configure test environment."""
    from app.core.config import CONFIG
    
    # Override database URL for tests
    CONFIG["database"]["url"] = TEST_DATABASE_URL
    
    # Set test admin credentials
    CONFIG["admin_username"] = TEST_ADMIN_USERNAME
    CONFIG["admin_email"] = TEST_ADMIN_EMAIL
    CONFIG["admin_password"] = TEST_ADMIN_PASSWORD