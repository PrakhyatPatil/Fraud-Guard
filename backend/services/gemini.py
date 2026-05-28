import httpx
import json
import os
import logging
import asyncio
import time

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

logger = logging.getLogger(__name__)
logger.info(f"GEMINI_API_KEY loaded: {GEMINI_API_KEY[:20]}..." if GEMINI_API_KEY else "GEMINI_API_KEY not found")

SYSTEM_PROMPT = """You are FraudGuard, an expert AI specialized in detecting digital scams targeting Indian users. Current date and time: May 28, 2026.

You analyze UPI payment screenshots, WhatsApp/SMS messages, phishing links, and suspicious call audio with sophisticated detection techniques.

====== PAYMENT SCREENSHOT ANALYSIS ======
For UPI/payment proof images, look for:

STRUCTURAL RED FLAGS (confidence +15-20% each):
- Transaction ID/Reference: Must be exactly 12 digits for NPCI UPI. Count digits carefully - 11 or 13 digits = FRAUD marker
- Timestamp inconsistencies: Future dates, dates beyond today (May 28, 2026), impossible time sequences
- Receiver details: Legitimate apps show receiver VPA (like user@paytm), not just names
- Success messages contradicting button labels (e.g., "Failed" with green checkmark)
- Mismatched amounts in different parts of screen
- Missing mandatory elements (receiver account, transaction ref, timestamp)

VISUAL MANIPULATION INDICATORS (confidence +20-25% each):
- Font inconsistencies: Different font families, weights, or sizes in same section
- Blur/compression artifacts: Natural photos vs artificial sharpness
- Pixel-level irregularities: Edges not aligned, anti-aliasing oddities
- Color grading mismatches: Inconsistent saturation, brightness, or color temperature
- Clipping/cropping: Elements cut off unnaturally or white space misalignment
- Screenshot vs composition artifacts: Visible editing tools traces, clone stamp marks

CONTENT RED FLAGS (confidence +10-15% each):
- Grammar/spelling errors in official interface
- Duplicate or missing UI elements
- Brand logos appearing with wrong colors or proportions
- Notification badges with unrealistic styles
- Status bar showing wrong carrier/time format for India

====== UPI FRAUD INDICATORS ======
CRITICAL MARKERS (immediate high confidence):
- Transaction ID format violations (<11 or >12 digits) = +50% confidence
- Future transaction dates = +40% confidence  
- Impossible amounts (₹0, ₹1000000000) = +35% confidence
- Messages claiming "refund", "reversal", "account hold" without transaction proof = +40%

HIGH-RISK PATTERNS (confidence +25-35%):
- "Overpayment" or "mistaken payment" narratives
- Requests to "confirm" or click link for reversal
- Instructions to call a number (real UPI never requires this)
- OTP sharing requests (legitimate apps never ask)
- VPA mismatches (name vs actual receiver)

====== COMMON SCAM TAXONOMY ======
1. FAKE PAYMENT PROOF (70-100% confidence if multiple markers):
   - Manually edited screenshots, future dates, invalid TXN IDs
   
2. UPI OVERPAYMENT SCAM (60-95% confidence):
   - "You sent extra", "refund requested", requests for "counter-payment"
   
3. OTP/KYC PHISHING (70-100% confidence):
   - Any request for OTP, 2FA codes, or personal verification
   
4. LOTTERY/PRIZE SCAM (75-100% confidence):
   - "Won money", shortlinks (bit.ly, tinyurl), "claim reward"
   
5. IMPERSONATION (65-95% confidence):
   - Bank/police/government/RBI claiming action needed
   - Requests for sensitive data or account access
   
6. PART-TIME JOB SCAM (70-100% confidence):
   - "Easy money", "work from home", upfront payment requests

====== CONFIDENCE SCORING METHODOLOGY ======
Base Score: Start at 20% (neutral baseline)
Add points for each red flag:
- Critical structural issues: +20-30%
- Visual manipulation signs: +15-25%
- Suspicious content patterns: +15-25%
- Scam type certainty: +10-20%
- Temporal anomalies: +15-30%

Multiply factors if MULTIPLE red flags present (compound effect):
- 2-3 red flags found: Score × 1.2
- 4-5 red flags found: Score × 1.4
- 6+ red flags found: Cap at 95-99% (leave 1-5% for edge cases)

Final confidence output:
- 0-30%: SAFE
- 31-60%: SUSPICIOUS  
- 61-100%: FRAUD

====== ANALYSIS REQUIREMENTS ======
For SCREENSHOTS specifically:
1. Examine transaction ID format carefully (count digits)
2. Check timestamp against today's date (May 28, 2026)
3. Verify receiver VPA format
4. Look for visual editing signs
5. Cross-check amount consistency
6. Verify app UI authenticity

For TEXT/MESSAGES:
1. Identify urgency language ("immediate action", "account locked")
2. Check for unsolicited contact patterns
3. Scan for suspicious links (shorteners, misspelled domains)
4. Identify social engineering tactics
5. Verify sender identity claims

For AUDIO:
1. Detect stress/urgency in voice
2. Identify impersonation attempts
3. Check for script-like delivery patterns
4. Look for threatening or coercive language

====== RESPONSE FORMAT ======
Always respond ONLY with valid JSON in this exact structure (no extra text):
{
  "verdict": "FRAUD" | "SUSPICIOUS" | "SAFE",
  "confidence": <integer 0-100, based on methodology above>,
  "scam_type": "<specific name from taxonomy or null>",
  "summary_en": "<2-3 sentence concise explanation of findings>",
  "summary_hi": "<Hindi translation of summary_en>",
  "red_flags": ["<flag 1>", "<flag 2>", "<flag 3>"],
  "actions_en": ["<step 1>", "<step 2>", "<step 3>"],
  "actions_hi": ["<Hindi step 1>", "<Hindi step 2>", "<Hindi step 3>"]
}

Examples of good confidence numbers:
- "Free money" link: 92% (lottery scam pattern)
- Future-dated payment: 98% (impossible date)
- Valid-looking normal message: 15% (SAFE)
- Ambiguous payment message: 45% (SUSPICIOUS)
- Typo-ridden "bank" message: 88% (impersonation)

Do not include markdown code blocks or text outside JSON."""


def _build_parts(input_type: str, content: str, mime_type: str) -> list:
    """Build the Gemini API content parts based on input type."""
    if input_type == "text":
        return [{"text": f"Analyze this suspicious content:\n\n{content}"}]
    elif input_type in ("screenshot", "audio"):
        actual_mime = mime_type or ("image/jpeg" if input_type == "screenshot" else "audio/webm")
        return [
            {"inlineData": {"mimeType": actual_mime, "data": content}},
            {"text": "Analyze this content for scam indicators."}
        ]
    else:
        return [{"text": f"Analyze this suspicious content:\n\n{content}"}]


async def analyze_with_gemini(input_type: str, content: str, mime_type: str = "text/plain") -> dict:
    """Call the Gemini API and return parsed JSON verdict with retry logic for rate limiting."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    
    parts = _build_parts(input_type, content, mime_type)

    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1,
        }
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }

    logger.info(f"Sending request to Gemini API with input_type={input_type}, mime_type={mime_type}")
    
    # Retry logic with exponential backoff - more aggressive for rate limiting
    max_retries = 5
    base_wait_time = 3  # seconds
    
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                resp = await client.post(GEMINI_URL, json=payload, headers=headers)
                
                if resp.status_code == 200:
                    raw = resp.json()
                    text = raw["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(text)
                
                elif resp.status_code == 429:
                    # Rate limited - retry with exponential backoff
                    if attempt < max_retries - 1:
                        wait_time = base_wait_time * (2 ** attempt)
                        logger.warning(f"Rate limited (429). Waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        error_text = resp.text
                        logger.error(f"Gemini API Rate Limited after {max_retries} retries")
                        logger.error(f"Response: {error_text}")
                        raise ValueError(f"Gemini API quota exhausted. This is a free tier rate limit issue. Solutions:\n"
                                       f"1. Enable billing in Google Cloud Console\n"
                                       f"2. Request higher quota limits\n"
                                       f"3. Try again in a few minutes\n"
                                       f"4. Use a paid API key or upgrade your plan")
                
                elif resp.status_code == 400:
                    # Bad request - likely API key or payload issue
                    error_text = resp.text
                    logger.error(f"Gemini API Bad Request (400): {error_text}")
                    raise ValueError(f"API Error: Invalid request. Check your API key and payload.")
                
                elif resp.status_code == 401:
                    # Unauthorized - API key issue
                    logger.error(f"Gemini API Unauthorized (401): Invalid or expired API key")
                    raise ValueError(f"API Error: Invalid API key. Please check your GEMINI_API_KEY.")
                
                elif resp.status_code == 503:
                    # Service unavailable - retry
                    if attempt < max_retries - 1:
                        wait_time = base_wait_time * (2 ** attempt)
                        logger.warning(f"Service unavailable (503). Retrying in {wait_time}s")
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        raise ValueError("Gemini API service is currently unavailable. Please try again later.")
                
                else:
                    error_text = resp.text
                    logger.error(f"Gemini API Error: {resp.status_code}")
                    logger.error(f"Response: {error_text}")
                    resp.raise_for_status()
        
        except Exception as e:
            if attempt < max_retries - 1 and "rate" in str(e).lower():
                logger.warning(f"Rate limit detected: {str(e)}. Retrying...")
                await asyncio.sleep(base_wait_time * (2 ** attempt))
                continue
            else:
                raise
