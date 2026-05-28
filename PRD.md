# FraudGuard — Product Requirements Document

> **Hackathon build. Two-pass execution: Frontend first, then Backend.**
> Stack: React (Vite) · FastAPI · SQLite · Gemini 2.5 Flash API

---

## 1. Project Overview

FraudGuard is a web app that detects Indian digital scams — fake UPI screenshots, phishing messages, and suspicious audio calls — using Google's Gemini 2.5 Flash multimodal API. Users submit evidence, get an instant fraud verdict with confidence score, red flags, and actionable steps in Hindi or English.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, TailwindCSS, Framer Motion |
| Backend | FastAPI (Python 3.11+) |
| Database | SQLite via SQLAlchemy |
| AI | Gemini 2.5 Flash (`gemini-2.5-flash`) via REST |
| File Storage | Local `/uploads` folder (base64 for images, audio blobs) |

---

## 3. Repository Structure

```
fraudguard/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputTabs.jsx        # Three input mode tabs
│   │   │   ├── ResultCard.jsx       # Verdict display
│   │   │   ├── HistoryPanel.jsx     # Past scans list
│   │   │   └── LanguageToggle.jsx   # Hindi/English toggle
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── api/
│   │   │   └── client.js            # Axios calls to FastAPI
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # FastAPI app
│   ├── main.py                # Entry point, CORS, router mount
│   ├── routers/
│   │   ├── analyze.py         # POST /analyze — core Gemini call
│   │   └── history.py         # GET /history, GET /history/{id}
│   ├── services/
│   │   └── gemini.py          # Gemini API wrapper, system prompt
│   ├── models/
│   │   └── scan.py            # SQLAlchemy Scan model
│   ├── database.py            # SQLite engine + session
│   ├── schemas.py             # Pydantic request/response schemas
│   └── requirements.txt
│
└── README.md
```

---

## 4. Feature Scope

### 4.1 Input Modes (Three Tabs)

**Tab 1 — Screenshot**
- Drag-and-drop or click-to-upload image (JPG, PNG, WEBP, max 10MB)
- Image preview before submission
- Sends as base64 to backend

**Tab 2 — Message / Link**
- Textarea for pasting suspicious SMS, WhatsApp message, or URL
- Min 10 characters to enable submit

**Tab 3 — Call Audio**
- Record button using browser MediaRecorder API
- Max 60 seconds recording
- Shows live recording timer
- Sends audio blob as base64 to backend

### 4.2 Analysis Result Card

Returned after Gemini processes input. Must show:

```
┌─────────────────────────────────────┐
│  [VERDICT BADGE]  FRAUD / SAFE / SUSPICIOUS  │
│  Confidence: ████████░░ 82%         │
├─────────────────────────────────────┤
│  Scam Type: UPI Overpayment Scam    │
│  Summary: [2-3 sentence explanation] │
│                                     │
│  🚩 Red Flags                       │
│   • Fake transaction ID format      │
│   • Urgency language detected       │
│   • Unverified sender               │
│                                     │
│  ✅ What To Do                      │
│   • Do not reply or call back       │
│   • Report to cybercrime.gov.in     │
│   • Block this number               │
├─────────────────────────────────────┤
│  [HI] Hindi  [EN] English  [Save]   │
└─────────────────────────────────────┘
```

- Verdict badge colors: RED = Fraud, AMBER = Suspicious, GREEN = Safe
- Confidence is animated progress bar
- Language toggle re-renders from cached result (no new API call)
- Save button stores result to history via backend

### 4.3 Scan History

- Left sidebar or bottom sheet (mobile) showing past 20 scans
- Each entry: timestamp, input type icon, verdict badge, truncated summary
- Click to re-open full result card
- Persisted in SQLite

---

## 5. API Contracts

### POST `/analyze`

**Request (multipart or JSON):**
```json
{
  "input_type": "screenshot" | "text" | "audio",
  "content": "<base64 string or plain text>",
  "mime_type": "image/jpeg" | "text/plain" | "audio/webm"
}
```

**Response:**
```json
{
  "scan_id": "uuid",
  "verdict": "FRAUD" | "SUSPICIOUS" | "SAFE",
  "confidence": 87,
  "scam_type": "UPI Overpayment Scam",
  "summary_en": "...",
  "summary_hi": "...",
  "red_flags": ["...", "..."],
  "actions_en": ["...", "..."],
  "actions_hi": ["...", "..."],
  "created_at": "ISO timestamp"
}
```

### GET `/history`
Returns list of last 20 scans (all fields except base64 content).

### GET `/history/{scan_id}`
Returns single scan full detail.

---

## 6. Gemini Integration

### 6.1 Model
`gemini-2.5-flash` — supports vision, audio, and text natively.

### 6.2 API Call Pattern
Direct REST to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

API key passed via `x-goog-api-key` header (stored in `.env` as `GEMINI_API_KEY`).

### 6.3 Response Format
Force JSON output. Set `response_mime_type: "application/json"` in generation config.

### 6.4 System Prompt (use exactly)

```
You are FraudGuard, an AI specialized in detecting digital scams targeting Indian users. You analyze UPI payment screenshots, WhatsApp/SMS messages, phishing links, and suspicious call audio.

KNOWLEDGE BASE:
- Valid NPCI UPI transaction IDs follow format: [0-9]{12} (12 digits)
- Legitimate UPI apps (PhonePe, GPay, Paytm) show the receiver's VPA, not just a name
- Real payment success screens never ask you to call a number or share OTP
- Common scam types: UPI Overpayment, OTP Phishing, KYC Fraud, Fake Refund, Lottery Scam, Impersonation (bank/police/TRAI), Part-time Job Scam
- Red flag phrases: "account blocked", "KYC expire", "refund process", "click link", "share OTP", "winning amount", "work from home easy money"
- Suspicious URL patterns: bit.ly shortlinks, non-.gov domains claiming to be government, misspelled brand names

RESPONSE: Always respond ONLY with a valid JSON object in this exact shape:
{
  "verdict": "FRAUD" | "SUSPICIOUS" | "SAFE",
  "confidence": <integer 0-100>,
  "scam_type": "<name or null>",
  "summary_en": "<2-3 sentence plain English explanation>",
  "summary_hi": "<same in Hindi>",
  "red_flags": ["<flag 1>", "<flag 2>"],
  "actions_en": ["<step 1>", "<step 2>", "<step 3>"],
  "actions_hi": ["<same steps in Hindi>"]
}

Do not include any text outside the JSON. Do not wrap in markdown code blocks.
```

---

## 7. Database Schema

### Table: `scans`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Generated server-side |
| input_type | VARCHAR | screenshot / text / audio |
| verdict | VARCHAR | FRAUD / SUSPICIOUS / SAFE |
| confidence | INTEGER | 0–100 |
| scam_type | VARCHAR | nullable |
| summary_en | TEXT | |
| summary_hi | TEXT | |
| red_flags | TEXT | JSON array stored as string |
| actions_en | TEXT | JSON array stored as string |
| actions_hi | TEXT | JSON array stored as string |
| created_at | DATETIME | auto |

---

## 8. Environment Variables

**Backend `.env`:**
```
GEMINI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./fraudguard.db
UPLOAD_DIR=./uploads
```

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## 9. CORS

Backend must allow `http://localhost:5173` during dev. Use FastAPI `CORSMiddleware`.

---

## 10. Error Handling

- Gemini API failure → return HTTP 502 with `{"error": "AI service unavailable"}`
- Invalid file type → return HTTP 422
- File too large → return HTTP 413
- Frontend shows toast notifications for all errors

---

## 11. Build Order for Agent

### Pass 1 — Frontend
Build the entire React app with **mocked API responses** (no real backend calls). The mock should return a hardcoded fraud result so all UI components are testable. Use a `VITE_MOCK_MODE=true` env flag to toggle mocking.

Components to build:
1. `App.jsx` — layout shell with sidebar history + main content
2. `InputTabs.jsx` — all three input modes fully working
3. `ResultCard.jsx` — full verdict card with animated confidence bar
4. `HistoryPanel.jsx` — list with mock entries
5. `LanguageToggle.jsx` — toggles between EN/HI on cached result
6. `client.js` — Axios instance pointing to `VITE_API_BASE_URL`, mock mode interceptor

### Pass 2 — Backend
Build the full FastAPI backend:
1. `database.py` + `models/scan.py` — SQLite setup
2. `schemas.py` — Pydantic models matching API contract in section 5
3. `services/gemini.py` — Gemini REST call with system prompt from 6.4
4. `routers/analyze.py` — POST /analyze endpoint
5. `routers/history.py` — GET /history, GET /history/{id}
6. `main.py` — wire everything, CORS, startup DB init

---

## 12. Demo Script (for hackathon judges)

1. Open app — show clean UI
2. Tab 1: Upload a fake UPI screenshot → show FRAUD verdict with red flags
3. Tab 2: Paste "Your KYC has expired, click here to update: bit.ly/xxxxx" → show FRAUD
4. Tab 3: Record yourself reading a scam script → show SUSPICIOUS/FRAUD
5. Toggle to Hindi → same result in Hindi, no reload
6. Click history → show past scans persisted
