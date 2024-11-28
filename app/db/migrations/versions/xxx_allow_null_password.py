# app/db/migrations/versions/xxx_allow_null_password.py
"""Allow null password

Revision ID: xxx
Revises: previous_revision
Create Date: YYYY-MM-DD HH:MM:SS

"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.alter_column('users', 'hashed_password',
               existing_type=sa.String(),
               nullable=True)

def downgrade():
    op.alter_column('users', 'hashed_password',
               existing_type=sa.String(),
               nullable=False)