import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import OTP, User

SENDER_EMAIL = "jeslinsanteena12@gmail.com"
APP_PASSWORD = "ingueuqpnloqdkjr"

def create_otp(db: Session, user_id: int):

    otp_code = str(random.randint(100000, 999999))
    expiry_time = datetime.utcnow() + timedelta(minutes=5)

    otp_entry = OTP(
        user_id=user_id,
        otp=otp_code,
        expiry=expiry_time,
        is_used=False
    )

    db.add(otp_entry)
    db.commit()

    try:
        user = db.query(User).filter(User.id == user_id).first()
        user_email = user.email

        subject = "Your OTP Code - Unite Platform"
        body = f"Your OTP is {otp_code}. Valid for 5 minutes."

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = user_email

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, user_email, msg.as_string())
        server.quit()

        print("✅ OTP sent to email:", user_email)

    except Exception as e:
        print("❌ Email sending failed:", e)

    return otp_code
