import uuid
import json
from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), nullable=False)
    input_type = Column(String, nullable=False)          # screenshot | text | audio
    verdict = Column(String, nullable=False)             # FRAUD | SUSPICIOUS | SAFE
    confidence = Column(Integer, nullable=False)
    scam_type = Column(String, nullable=True)
    summary_en = Column(Text, nullable=False)
    summary_hi = Column(Text, nullable=False)
    red_flags = Column(Text, nullable=False, default="[]")   # stored as JSON string
    actions_en = Column(Text, nullable=False, default="[]")  # stored as JSON string
    actions_hi = Column(Text, nullable=False, default="[]")  # stored as JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "scan_id": self.id,
            "input_type": self.input_type,
            "verdict": self.verdict,
            "confidence": self.confidence,
            "scam_type": self.scam_type,
            "summary_en": self.summary_en,
            "summary_hi": self.summary_hi,
            "red_flags": json.loads(self.red_flags),
            "actions_en": json.loads(self.actions_en),
            "actions_hi": json.loads(self.actions_hi),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
