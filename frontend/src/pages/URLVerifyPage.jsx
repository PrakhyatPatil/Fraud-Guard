import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function URLVerifyPage({ language, onAnalyze, isScanning, result }) {
  const isHindi = language === 'HI';
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const exampleURLs = [
    'https://sbi-kyc-update.xyz/login',
    'https://phonepe.com/verify',
    'https://hdfc-bank-india.tk/account',
    'https://paytm.com',
  ];

  const handleCheck = () => {
    if (!urlInput.trim()) {
      setError(isHindi ? 'कृपया URL दर्ज करें' : 'Please enter a URL');
      return;
    }

    try {
      new URL(urlInput);
      setError('');
      onAnalyze({ type: 'text', content: urlInput, file: null });
    } catch {
      setError(isHindi ? 'कृपया एक वैध URL दर्ज करें' : 'Please enter a valid URL');
    }
  };

  const handleExampleClick = (url) => {
    setUrlInput(url);
    setError('');
  };

  const handleInputChange = (e) => {
    setUrlInput(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isScanning) {
      handleCheck();
    }
  };

  if (result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
            {isHindi ? '🔗 URL सुरक्षा जांचकर्ता' : '🔗 URL Safety Checker'}
          </h1>
          <p className="text-lg text-[#475569] max-w-xl mx-auto">
            {isHindi
              ? 'क्लिक करने से पहले सत्यापित करें कि एक लिंक सुरक्षित है'
              : 'Verify if a link is safe before clicking'}
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-base p-8 mb-8"
        >
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1E293B] mb-3">
              {isHindi ? 'URL दर्ज करें' : 'Enter URL to Check'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  isHindi
                    ? 'https://संदिग्ध-बैंक-लिंक.xyz/login...'
                    : 'https://suspicious-bank-link.xyz/login...'
                }
                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 text-[#1E293B] placeholder-[#94A3B8]"
              />
              {urlInput && !error && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-sm text-[#DC2626]">{error}</span>
              </motion.div>
            )}
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={isScanning || !urlInput.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isHindi ? 'जांच जारी...' : 'Checking...'}
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                {isHindi ? 'URL जांचें' : 'Check URL'}
              </>
            )}
          </button>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#FFFBEB] border border-[#FCD34D] rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-[#92400E] font-medium mb-2">
            ⚠️ {isHindi ? 'सुरक्षा सावधानी:' : 'Security Tip:'}
          </p>
          <p className="text-sm text-[#78350F]">
            {isHindi
              ? 'हमेशा किसी अपरिचित लिंक पर क्लिक करने से पहले अपने ब्राउज़र के पता पट्टी की जांच करें। वास्तविक बैंक वेबसाइटों में हमेशा उचित SSL सर्टिफिकेट होंगे।'
              : 'Always check the address bar in your browser before clicking unfamiliar links. Legitimate bank websites will always have proper SSL certificates (🔒).'}
          </p>
        </motion.div>

        {/* Try Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-semibold text-[#1E293B] mb-4 text-center">
            {isHindi ? '💡 ये उदाहरण आजमाएं:' : '💡 TRY THESE EXAMPLES:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleURLs.map((url, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -2 }}
                onClick={() => handleExampleClick(url)}
                className="px-4 py-3 bg-white border-2 border-[#E2E8F0] rounded-full text-sm text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 text-left truncate"
              >
                {url}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="card-base p-6">
            <h3 className="font-semibold text-[#1E293B] mb-2">
              {isHindi ? '✓ वैध URL के संकेत' : '✓ Signs of Valid URL'}
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>• {isHindi ? 'https:// से शुरू होता है' : 'Starts with https://'}</li>
              <li>• {isHindi ? '🔒 ताला चिन्ह दिखता है' : 'Shows a 🔒 lock icon'}</li>
              <li>• {isHindi ? 'आधिकारिक डोमेन नाम है' : 'Official domain name'}</li>
            </ul>
          </div>

          <div className="card-base p-6">
            <h3 className="font-semibold text-[#1E293B] mb-2">
              {isHindi ? '⚠️ फिशिंग संकेत' : '⚠️ Phishing Red Flags'}
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>• {isHindi ? 'तत्काल कार्रवाई की मांग' : 'Demanding urgent action'}</li>
              <li>• {isHindi ? 'अस्पष्ट या सामान्य URL' : 'Suspicious or generic URL'}</li>
              <li>• {isHindi ? 'व्यक्तिगत जानकारी माँगना' : 'Asking for personal info'}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
