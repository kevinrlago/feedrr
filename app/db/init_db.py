# app/db/init_db.py
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from urllib.parse import urlparse
import os
from sqlalchemy.orm import Session
from app.core.config import CONFIG
from app.models.user import User
from app.core.constants import UserRole, Language
from app.core.security import get_password_hash

def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    db_url = CONFIG["database"]["url"]
    parsed = urlparse(db_url)
    database_name = parsed.path[1:]  # Remove leading '/'
    
    # Connect to postgres database to create new db
    postgres_url = f"postgresql://{parsed.username}:{parsed.password}@{parsed.hostname}:5432/postgres"
    
    conn = None
    cursor = None
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(postgres_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{database_name}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f'CREATE DATABASE "{database_name}"')
            print(f"Created database {database_name}")
        else:
            print(f"Database {database_name} already exists")
            
    except Exception as e:
        print(f"Error creating database: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def init_db(db: Session) -> None:
    """Initialize database with required initial data."""
    try:
        # Create database if it doesn't exist
        create_database_if_not_exists()
        
        # Get current environment
        current_env = os.getenv('APP_ENV', 'production').lower()
        
        # Only purge database in test/development environments
        if current_env in ['test', 'development']:
            print(f"Purging database in {current_env} environment...")
            from app.db.base import Base
            from app.db.session import engine
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            print("Database purged successfully")

            # Create default admin user only in dev/test environments
            if current_env in ['test', 'development']:
                admin = db.query(User).first()
                if not admin:
                    admin = User(
                        username="admin",
                        email="admin@system.local",
                        hashed_password=get_password_hash('admin'),  # Password is 'admin'
                        role=UserRole.ADMIN,
                        is_active=True,
                        preferred_language=Language.ENGLISH
                    )
                    db.add(admin)
                    db.commit()
                    print("Default admin user created successfully in development/test mode")
        else:
            # In production, only create tables if they don't exist
            from app.db.base import Base
            from app.db.session import engine
            Base.metadata.create_all(bind=engine)
            print("Database tables created/verified successfully in production mode")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
        raise