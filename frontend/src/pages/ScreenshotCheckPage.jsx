import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScreenshotCheckPage({ language, onAnalyze, isScanning, result }) {
  const isHindi = language === 'HI';
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const scamTypes = isHindi
    ? [
        { id: 1, title: 'नकली UPI भुगतान', emoji: '₹' },
        { id: 2, title: 'WhatsApp स्कैम', emoji: '💬' },
        { id: 3, title: 'नकली बैंक SMS', emoji: '📱' },
        { id: 4, title: 'पुरस्कार / लॉटरी', emoji: '🎁' },
      ]
    : [
        { id: 1, title: 'Fake UPI Payment', emoji: '₹' },
        { id: 2, title: 'WhatsApp Scam', emoji: '💬' },
        { id: 3, title: 'Fake Bank SMS', emoji: '📱' },
        { id: 4, title: 'Prize / Lottery', emoji: '🎁' },
      ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const f = files[0];
      if (f.type.startsWith('image/')) {
        setFile(f);
        setFilePreview(URL.createObjectURL(f));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.type.startsWith('image/')) {
        setFile(f);
        setFilePreview(URL.createObjectURL(f));
      }
    }
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze({ type: 'screenshot', content: null, file });
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
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
            {isHindi ? '📸 स्क्रीनशॉट स्कैम डिटेक्टर' : '📸 Screenshot Scam Detector'}
          </h1>
          <p className="text-lg text-[#475569] max-w-xl mx-auto">
            {isHindi
              ? 'किसी भी संदिग्ध स्क्रीनशॉट को तुरंत AI विश्लेषण के लिए अपलोड करें'
              : 'Upload any suspicious screenshot for instant AI analysis'}
          </p>
        </motion.div>

        {/* Scam Type Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {scamTypes.map((type, idx) => (
            <motion.div
              key={type.id}
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              className="card-base p-6 text-center"
            >
              <div className="text-4xl mb-3">{type.emoji}</div>
              <p className="text-sm font-semibold text-[#1E293B]">{type.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-12"
        >
          {filePreview ? (
            <div className="space-y-6">
              <div className="relative w-full">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-xl"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 bg-[#EF4444] text-white rounded-full hover:bg-[#DC2626] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#F0FDF4] border border-[#22C55E] rounded-lg p-4">
                <p className="text-sm text-[#16A34A]">
                  ✓ {isHindi ? 'फाइल तैयार है' : 'File ready to analyze'}
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isScanning}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isHindi ? 'विश्लेषण जारी...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    {isHindi ? 'अभी विश्लेषण करें' : 'Analyze Now'}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-[#2563EB] bg-[#EFF6FF]'
                  : 'border-[#CBD5E1] hover:border-[#2563EB]'
              }`}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />

              <label htmlFor="file-input" className="cursor-pointer block">
                <UploadCloud className="w-16 h-16 mx-auto mb-4 text-[#2563EB]" />
                <p className="text-lg font-semibold text-[#1E293B] mb-2">
                  {isHindi ? 'यहां फाइल ड्रॉप करें या क्लिक करें' : 'Drop file here or click to browse'}
                </p>
                <p className="text-sm text-[#475569]">
                  {isHindi ? 'समर्थित: JPG, PNG, WebP 10MB तक' : 'Supported: JPG, PNG, WebP up to 10MB'}
                </p>
              </label>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg p-4"
        >
          <p className="text-sm text-[#92400E]">
            💡 {isHindi
              ? 'सुझाव: वास्तविक स्क्रीनशॉट अपलोड करने से पहले अपना व्यक्तिगत जानकारी हटाएं।'
              : 'Tip: Remove any personal information from screenshots before uploading for privacy.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
