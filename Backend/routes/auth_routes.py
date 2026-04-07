from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, OTP
from schemas import OTPRequest, OTPVerify, AdminOTPVerify
from otp_service import create_otp
from auth import create_access_token
from datetime import datetime

router = APIRouter()


# ==================================
# 🔵 CITIZEN LOGIN
# ==================================
@router.post("/send-otp")
def send_otp(data: OTPRequest, db: Session = Depends(get_db)):

    if data.role != "citizen":
        raise HTTPException(status_code=400, detail="Invalid role")

    if not data.mobile:
        raise HTTPException(status_code=400, detail="Mobile required")

    user = db.query(User).filter(User.mobile == data.mobile).first()

    if not user:
        user = User(
            name=data.name,
            age=data.age,
            email=data.email,
            mobile=data.mobile,
            role="citizen"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    create_otp(db, user.id)

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.mobile == data.mobile).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    otp_entry = db.query(OTP).filter(
        OTP.user_id == user.id,
        OTP.otp == data.otp,
        OTP.is_used == False
    ).first()

    if not otp_entry or otp_entry.expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    otp_entry.is_used = True
    user.is_verified = True
    db.commit()

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {"access_token": token}


# ==================================
# 🔴 ADMIN LOGIN (OPTION 2 CLEAN)
# ==================================
@router.post("/admin/send-otp")
def send_admin_otp(db: Session = Depends(get_db)):

    admin = db.query(User).filter(User.role == "admin").first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not configured")

    create_otp(db, admin.id)

    return {"message": "OTP sent to registered admin email"}


@router.post("/admin/verify-otp")
def verify_admin_otp(data: AdminOTPVerify, db: Session = Depends(get_db)):

    admin = db.query(User).filter(User.role == "admin").first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    otp_entry = db.query(OTP).filter(
        OTP.user_id == admin.id,
        OTP.otp == data.otp,
        OTP.is_used == False
    ).first()

    if not otp_entry or otp_entry.expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    otp_entry.is_used = True
    admin.is_verified = True
    db.commit()

    token = create_access_token({
        "sub": str(admin.id),
        "role": "admin"
    })

    return {"access_token": token}
