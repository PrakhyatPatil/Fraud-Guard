import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load .env FIRST before any other imports
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models.scan import Scan, Base
from routers import analyze, history

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(name)s - %(levelname)s - %(message)s')

# Ensure DB tables exist on startup
Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
os.makedirs(os.getenv("UPLOAD_DIR", "./uploads"), exist_ok=True)

app = FastAPI(
    title="FraudGuard API",
    description="Detects Indian digital scams using Gemini AI",
    version="1.0.0",
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(history.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "FraudGuard API"}


@app.get("/test-gemini")
def test_gemini():
    """Test endpoint to check Gemini API key and connection"""
    from services.gemini import GEMINI_API_KEY, GEMINI_URL
    from pathlib import Path
    
    # Read .env file directly
    env_file_path = Path(__file__).parent / ".env"
    env_contents = {}
    if env_file_path.exists():
        with open(env_file_path, 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    env_contents[key] = value
    
    return {
        "api_key_set": bool(GEMINI_API_KEY),
        "api_key_length": len(GEMINI_API_KEY) if GEMINI_API_KEY else 0,
        "api_key_preview": GEMINI_API_KEY[:20] + "..." if GEMINI_API_KEY else "NOT SET",
        "gemini_url": GEMINI_URL,
        "env_file_path": str(env_file_path),
        "env_file_exists": env_file_path.exists(),
        "env_from_file": env_contents
    }
