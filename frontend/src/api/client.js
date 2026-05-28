import axios from 'axios';

export const MOCK_RESULT = {
  scan_id: "mock-001",
  verdict: "FRAUD",
  risk_level: "High",
  scam_type: "Fake Payment Proof",
  confidence: 94,
  summary_en: "We found signs that this person is trying to trick you into sending money. The transaction ID is invalid and the design does not match the real app.",
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
};

const isMock = import.meta.env.VITE_MOCK_MODE === 'true';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 90000, // Gemini can take a while
});

// ---- Mock mode interceptors (only active in Pass 1 / local testing) ----
if (isMock) {
  client.interceptors.request.use(async (config) => {
    if (config.url === '/analyze') {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const err = new Error('mock');
      err.isMock = true;
      err.mockData = MOCK_RESULT;
      throw err;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.isMock) {
        return Promise.resolve({ data: error.mockData });
      }
      return Promise.reject(error);
    }
  );
}

export default client;
