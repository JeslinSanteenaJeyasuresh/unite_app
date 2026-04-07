from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    email = Column(String, unique=True)
    mobile = Column(String, unique=True)
    role = Column(String)  # admin / citizen
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    otp = Column(String)
    expiry = Column(DateTime)
    is_used = Column(Boolean, default=False)


class MissingCase(Base):
    __tablename__ = "missing_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    city = Column(String)
    state = Column(String)
    address = Column(String)
    blood_group = Column(String)
    identification_mark = Column(String)
    image_path = Column(String)
    embedding = Column(String)  # store as comma-separated
    status = Column(String, default="missing")
    reported_date = Column(DateTime, default=datetime.utcnow)
    reported_by = Column(Integer, ForeignKey("users.id"))
