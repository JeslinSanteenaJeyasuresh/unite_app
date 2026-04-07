from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import MissingCase
from dependencies import admin_required

router = APIRouter()


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):
    total = db.query(MissingCase).count()

    missing = db.query(MissingCase).filter(
        MissingCase.status == "missing"
    ).count()

    cleared = db.query(MissingCase).filter(
        MissingCase.status == "cleared"
    ).count()

    return {
        "total": total,
        "missing": missing,
        "cleared": cleared
    }
@router.get("/cases")
def get_cases(db: Session = Depends(get_db)):

    cases = db.query(MissingCase).all()

    formatted_cases = []

    for case in cases:
        formatted_cases.append({
            "id": case.id,
            "case_id": case.case_id,
            "name": case.name,
            "age": case.age,
            "address": case.address,
            "blood_group": case.blood_group,
            "identification_mark": case.identification_mark,
            "image_path": case.image_path,
            "reported_date": case.reported_date,
            "status": case.status,
        })

    return formatted_cases
