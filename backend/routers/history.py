from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.scan import Scan
from schemas import ScanResponse, HistoryItem

router = APIRouter()


@router.get("/history", response_model=List[HistoryItem])
def get_history(db: Session = Depends(get_db)):
    """Return the last 20 scans."""
    scans = db.query(Scan).order_by(Scan.created_at.desc()).limit(20).all()
    return [s.to_dict() for s in scans]


@router.get("/history/{scan_id}", response_model=ScanResponse)
def get_scan(scan_id: str, db: Session = Depends(get_db)):
    """Return a single scan by ID."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan.to_dict()
