"""
Contact Request Model
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from ..database import Base


class ContactRequest(Base):
    """Contact/Demo requests from landing page"""
    __tablename__ = "contact_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    name = Column(String(255), nullable=True)
    subject = Column(String(500), nullable=True)
    message = Column(Text, nullable=True)
    request_type = Column(String(50), default="demo")  # 'demo' or 'contact'
    created_at = Column(DateTime, default=datetime.utcnow)
    is_processed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
