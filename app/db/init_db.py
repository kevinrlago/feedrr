# app/db/init_db.py
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from app.core.config import CONFIG

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
    """Initialize the database."""
    try:
        # Create database if it doesn't exist
        create_database_if_not_exists()
        
        # Create all tables
        from app.db.base import Base
        from app.db.session import engine
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise