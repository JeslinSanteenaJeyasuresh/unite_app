from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OTPRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    role: str


class OTPVerify(BaseModel):
    mobile: str
    otp: str

class AdminOTPVerify(BaseModel):
    otp: str




class CaseCreate(BaseModel):
    name: str
    age: int
    gender: str
    city: str
    state: str
    address: str
    blood_group: str
    identification_mark: str


class CaseResponse(BaseModel):
    case_id: str
    name: str
    status: str
    reported_date: datetime
