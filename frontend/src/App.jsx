import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import HomePage from './pages/HomePage';
import ScreenshotCheckPage from './pages/ScreenshotCheckPage';
import URLVerifyPage from './pages/URLVerifyPage';
import CallAnalysisPage from './pages/CallAnalysisPage';
import client from './api/client';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [language, setLanguage] = useState('EN');
  const [currentPage, setCurrentPage] = useState('home');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isHindi = language === 'HI';

  const handleAnalyze = async (data) => {
    setIsScanning(true);
    setResult(null);
    setError(null);

    try {
      let content = data.content;
      let mimeType = 'text/plain';

      // Convert file/blob to base64 if not already
      if (data.type !== 'text' && data.file) {
        const base64 = await fileToBase64(data.file);
        content = base64.split(',')[1]; // strip data:... prefix
        mimeType = data.file.type || 'image/jpeg';
      }

      const response = await client.post('/analyze', {
        input_type: data.type,
        content: content,
        mime_type: mimeType,
      });

      setResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || (isHindi ? 'विश्लेषण विफल। कृपया फिर से प्रयास करें।' : 'Analysis failed. Please try again.');
      setError(msg);
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleOpenEmergency = () => {
    alert(
      isHindi
        ? 'साइबर अपराध के लिए आपातकालीन हेल्पलाइन: 1930\n\nतुरंत आवश्यक कार्रवाई:\n1. अपने बैंक को कॉल करें\n2. अपना पासवर्ड बदलें\n3. पुलिस को रिपोर्ट करें'
        : 'Cyber Crime Emergency Helpline: 1930\n\nImmediate Actions:\n1. Call your bank\n2. Change your password\n3. Report to police'
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage language={language} onPageChange={setCurrentPage} />;
      case 'screenshot':
        return (
          <>
            <ScreenshotCheckPage
              language={language}
              onAnalyze={handleAnalyze}
              isScanning={isScanning}
              result={result}
            />
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-t border-[#E2E8F0] mt-8"
              >
                <div className="max-w-2xl mx-auto py-12 px-4">
                  <ResultCard
                    result={result}
                    language={language}
                    onReset={() => setResult(null)}
                  />
                </div>
              </motion.div>
            )}
          </>
        );
      case 'url':
        return (
          <>
            <URLVerifyPage
              language={language}
              onAnalyze={handleAnalyze}
              isScanning={isScanning}
              result={result}
            />
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-t border-[#E2E8F0] mt-8"
              >
                <div className="max-w-2xl mx-auto py-12 px-4">
                  <ResultCard
                    result={result}
                    language={language}
                    onReset={() => setResult(null)}
                  />
                </div>
              </motion.div>
            )}
          </>
        );
      case 'call':
        return (
          <>
            <CallAnalysisPage
              language={language}
              onAnalyze={handleAnalyze}
              isScanning={isScanning}
              result={result}
            />
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-t border-[#E2E8F0] mt-8"
              >
                <div className="max-w-2xl mx-auto py-12 px-4">
                  <ResultCard
                    result={result}
                    language={language}
                    onReset={() => setResult(null)}
                  />
                </div>
              </motion.div>
            )}
          </>
        );
      default:
        return <HomePage language={language} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenEmergency={handleOpenEmergency}
      />

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md"
          >
            <div className="bg-[#FEE2E2] border-2 border-[#EF4444] text-[#DC2626] px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">{isHindi ? 'त्रुटि' : 'Error'}</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
