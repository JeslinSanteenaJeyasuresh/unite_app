from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from fastapi.security import HTTPBearer
from auth import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def get_current_user(token: str = Depends(security)):

    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")


def admin_required(user=Depends(get_current_user)):

    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return user
