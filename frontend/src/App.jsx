import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import HomePage from './pages/HomePage';
import ScreenshotCheckPage from './pages/ScreenshotCheckPage';
import URLVerifyPage from './pages/URLVerifyPage';
import CallAnalysisPage from './pages/CallAnalysisPage';
import client from './api/client';
import { motion, AnimatePresence } from 'framer-motion';

// Error Boundary for catching React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">An unexpected error occurred. Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [language, setLanguage] = useState('EN');
  const [currentPage, setCurrentPage] = useState('home');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch scan history on mount
  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await client.get('/history');
        setHistory(response.data || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  const isHindi = language === 'HI';

  const handleAnalyze = async (data) => {
    if (isScanning) return; // Prevent duplicate submissions
    setIsScanning(true);
    setResult(null);
    setError(null);

    try {
      let content = data.content;
      let mimeType = 'text/plain';

      // Convert file/blob to base64 if not already
      if (data.type !== 'text' && data.file) {
        try {
          const base64 = await fileToBase64(data.file);
          content = base64.split(',')[1]; // strip data:... prefix
          mimeType = data.file.type || 'image/jpeg';
        } catch (fileErr) {
          const msg = isHindi ? 'फ़ाइल को पढ़ने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to read file. Please try again.';
          setError(msg);
          setIsScanning(false);
          return;
        }
      }

      const response = await client.post('/analyze', {
        input_type: data.type,
        content: content,
        mime_type: mimeType,
      });

      setResult(response.data);
      // Add to history
      setHistory((prev) => [response.data, ...prev]);
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
      reader.onerror = (error) => reject(new Error('Failed to read file'));
      reader.onabort = () => reject(new Error('File read was aborted'));
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
