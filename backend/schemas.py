from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AnalyzeRequest(BaseModel):
    input_type: str = Field(..., description="screenshot | text | audio")
    content: str = Field(..., description="Base64 encoded content or plain text", max_length=5242880)  # 5MB limit
    mime_type: Optional[str] = Field(default="text/plain", description="MIME type of the content")


class ScanResponse(BaseModel):
    scan_id: str
    input_type: Optional[str] = None
    verdict: str
    confidence: int
    scam_type: Optional[str] = None
    summary_en: str
    summary_hi: str
    red_flags: List[str]
    actions_en: List[str]
    actions_hi: List[str]
    created_at: Optional[str] = None


class HistoryItem(BaseModel):
    scan_id: str
    input_type: str
    verdict: str
    confidence: int
    scam_type: Optional[str] = None
    summary_en: str
    created_at: Optional[str] = None
