import json
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.scan import Scan
from schemas import AnalyzeRequest, ScanResponse
from services.gemini import analyze_with_gemini

router = APIRouter()


@router.post("/analyze", response_model=ScanResponse)
async def analyze(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Accepts text, screenshot (base64), or audio (base64) and returns a fraud verdict
    from the Gemini AI model. Saves the result to the database.
    """
    try:
        result = await analyze_with_gemini(
            input_type=request.input_type,
            content=request.content,
            mime_type=request.mime_type or "text/plain",
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    # Persist to DB with transaction management
    try:
        scan = Scan(
            input_type=request.input_type,
            verdict=result.get("verdict", "SUSPICIOUS"),
            confidence=result.get("confidence", 50),
            scam_type=result.get("scam_type"),
            summary_en=result.get("summary_en", ""),
            summary_hi=result.get("summary_hi", ""),
            red_flags=json.dumps(result.get("red_flags", [])),
            actions_en=json.dumps(result.get("actions_en", [])),
            actions_hi=json.dumps(result.get("actions_hi", [])),
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
    except Exception as db_err:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_err)}")

    return scan.to_dict()
