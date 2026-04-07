from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import shutil
import os
import uuid
from datetime import datetime
from ml.matching_score import compare_missing_with_found

router = APIRouter()

UPLOAD_FOLDER = "uploads"


@router.post("/create-case")
async def create_case(
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    address: str = Form(...),
    blood_group: str = Form(...),
    identification_mark: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        # ✅ Generate unique case ID
        case_id = f"CASE-{uuid.uuid4().hex[:8].upper()}"

        # ✅ Save image to uploads folder
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ Create DB record
        new_case = models.MissingCase(
            case_id=case_id,
            name=name,
            age=age,
            gender=gender,
            city=city,
            state=state,
            address=address,
            blood_group=blood_group,
            identification_mark=identification_mark,
            image_path=f"uploads/{unique_filename}",
            embedding=None,
            status="missing",
            reported_date=datetime.utcnow(),
            reported_by=None,
        )

        db.add(new_case)
        db.commit()
        db.refresh(new_case)

        return {
            "message": "Case created successfully",
            "case_id": case_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
