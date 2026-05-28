# FraudGuard — Design Specification

## Aesthetic Direction

**Theme:** Trustworthy, Secure, and Accessible  
**Vibe:** Clean, welcoming, and minimal. The interface should feel like a secure, modern government or banking app. It must be highly accessible for first-time users, elderly people, and non-technical audiences.  
**To Avoid:** Hacker-style themes, dark cyberpunk aesthetics, heavy AI jargon, complex dashboards, and overloaded screens.

---

## Typography

To ensure high legibility across all age groups:

```css
--font-display: 'Inter', sans-serif; /* Clean, modern headings */
--font-body: 'Roboto', sans-serif;   /* Highly readable body text */
```

Import from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap
```

---

## Color Tokens

Focusing on a light, clean, and safe color palette. Dark mode can be supported but should be soft and accessible, not "cyberpunk" dark.

```css
:root {
  /* Base */
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --bg-elevated: #ffffff;
  --bg-border: #e2e8f0;

  /* Text */
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #94a3b8;

  /* Accent (Trust & Action) */
  --accent-primary: #2563eb;      /* Trustworthy Blue — primary buttons */
  --accent-secondary: #3b82f6;    
  --accent-blue: #1d4ed8;

  /* Verdict specific (Clear, recognizable traffic-light colors) */
  --verdict-fraud: #dc2626;       /* Clear Red */
  --verdict-fraud-bg: #fef2f2;
  --verdict-suspicious: #ea580c;  /* Warning Orange */
  --verdict-suspicious-bg: #fff7ed;
  --verdict-safe: #16a34a;        /* Safe Green */
  --verdict-safe-bg: #f0fdf4;
}
```

---

## Layout Structure

**Mobile-First Design Strategy:** Designed primarily for smartphones, as this is how most users will interact with the app.

### Core Screens
1. **Home Page:** Clean and welcoming, clear call-to-action to check a message/image.
2. **Upload Flow:** Simple interface to upload screenshots, PDFs, WhatsApp chats, or paste text.
3. **Risk Analysis Screen:** Clearly visualizes the scanning process in easy-to-understand terms (no complex technical logs).
4. **Scam Result Cards:** Explains the findings in plain, non-technical language.

---

## Component Specs

### Header
- Height: 64px
- Branding: FraudGuard logo with a clear, readable font.
- Right side: Language Toggle `[EN] / [HI]` accessible at all times.
- Bottom border: 1px subtle shadow or `--bg-border`.
- Background: `--bg-primary`

### Upload Flow (Home)
- Large, friendly, primary action area.
- Tabs or clear buttons for: `Screenshot / PDF`, `Paste Message`, `Record Audio`.
- Optimized for mobile tap-to-select (large touch targets).
- Helpful placeholder text: "Paste a suspicious message or link here..."

### Risk Analysis Screen (Scanning State)
- A simple, reassuring animation (e.g., a shield pulsing or a magnifying glass).
- Simple progress text: "Checking message for risks...", "Analyzing sender..." 
- No matrix/hacker text streams or technical jargon.

### Scam Result Card
- **Fraud Meter:** A visual risk indicator (dial or clear progress bar) showing danger level clearly (Safe, Suspicious, Dangerous).
- **Verdict Banner:** Large, clear text (e.g., "This looks like a Scam" or "Safe to proceed").
- **Explanation:** Plain language summary (English or Hindi based on toggle). "We found signs that this person is trying to trick you into sending money."
- **Red Flags:** Bullet points with clear icons (e.g., ⚠️ "Asks for urgent payment").
- **Actions:** Clear next steps (e.g., "Do not reply", "Block sender").

---

## Language Toggle (Accessibility)
- A prominent toggle to switch the entire interface between **English** and **Hindi**.
- Crucial for broad accessibility among Indian users. Ensure all mock data and frontend text supports this toggle.

---

## Iconography

Use **Lucide React** (`lucide-react`) for clear, universally understood icons:
- Uploads: `UploadCloud`, `FileText`, `Camera`
- Navigation: `Home`, `Menu`
- Red flags: `AlertCircle`, `AlertTriangle`
- Actions: `ShieldCheck`, `ShieldAlert`, `Ban`, `ArrowRight`

---

## Animation Reference

Keep animations smooth, reassuring, and subtle. Avoid aggressive or fast "glitch" effects.

```css
/* Gentle pulse for scanning */
@keyframes soft-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

/* Smooth fade up for result cards */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Mock Data (for Pass 1 frontend testing)

```js
export const MOCK_RESULT = {
  scan_id: "mock-001",
  verdict: "FRAUD",
  risk_level: "High", // For the Fraud Meter
  scam_type: "Fake Payment Proof",
  summary_en: "This image looks like a fake payment receipt. The transaction ID is invalid and the design does not match the real app.",
  summary_hi: "यह छवि एक नकली भुगतान रसीद की तरह दिखती है। लेन-देन आईडी अमान्य है और डिज़ाइन असली ऐप से मेल नहीं खाता है।",
  red_flags: [
    "Transaction ID is fake",
    "Date and time look altered"
  ],
  actions_en: [
    "Do not send money or goods",
    "Block this contact"
  ],
  actions_hi: [
    "पैसे या सामान न भेजें",
    "इस संपर्क को ब्लॉक करें"
  ],
  created_at: new Date().toISOString()
}
```
