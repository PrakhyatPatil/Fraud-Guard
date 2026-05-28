import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, Mic, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CallAnalysisPage({ language, onAnalyze, isScanning, result }) {
  const isHindi = language === 'HI';
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
      if (f.type.startsWith('audio/')) {
        setFile(f);
        setFileName(f.name);
        setRecordedBlob(null);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.type.startsWith('audio/')) {
        setFile(f);
        setFileName(f.name);
        setRecordedBlob(null);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.onstart = () => setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setFile(null);
        setFileName('');
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(
        isHindi
          ? 'माइक्रोफोन तक पहुंच की अनुमति दें'
          : 'Please allow microphone access'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze({ type: 'audio', content: null, file });
    } else if (recordedBlob) {
      onAnalyze({ type: 'audio', content: null, file: recordedBlob });
    }
  };

  const clearAudio = () => {
    setFile(null);
    setFileName('');
    setRecordedBlob(null);
    if (isRecording) {
      stopRecording();
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
            {isHindi ? '📞 स्कैम कॉल विश्लेषक' : '📞 Scam Call Analyzer'}
          </h1>
          <p className="text-lg text-[#475569] max-w-xl mx-auto">
            {isHindi
              ? 'एक संदिग्ध कॉल रिकॉर्डिंग को AI विश्लेषण के लिए अपलोड करें'
              : 'Upload a suspicious call recording for AI analysis'}
          </p>
        </motion.div>

        {/* Critical Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FFFBEB] border-2 border-[#F59E0B] rounded-lg p-6 mb-8 flex gap-4"
        >
          <AlertTriangle className="w-6 h-6 text-[#D97706] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-[#92400E] mb-2">
              {isHindi ? '⚠️ तत्काल सलाह' : '⚠️ Immediate Action'}
            </h3>
            <p className="text-sm text-[#78350F] leading-relaxed">
              {isHindi
                ? 'यदि आपको कोई कॉल आपके OTP, PIN, या बैंक विवरण माँगने के लिए मिला है — तुरंत कॉल काट दें और आधिकारिक नंबर पर अपने बैंक को कॉल करें। कोई भी वैध बैंक कभी भी फोन पर इन विवरणों के लिए नहीं पूछेगा।'
                : 'If you received a call asking for OTP, PIN, or bank details — hang up immediately and call your bank on the official number. No legitimate bank will ever ask for these details over a call.'}
            </p>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-12 mb-8"
        >
          {file || recordedBlob ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-[#F8FAFC] rounded-lg border-2 border-[#E2E8F0]">
                <Mic className="w-8 h-8 text-[#2563EB]" />
                <div className="flex-1">
                  <p className="font-semibold text-[#1E293B]">
                    {fileName || isHindi ? 'रिकॉर्डिंग तैयार' : 'Recording Ready'}
                  </p>
                  <p className="text-sm text-[#475569]">
                    {isHindi ? 'विश्लेषण के लिए तैयार' : 'Ready for analysis'}
                  </p>
                </div>
                <button
                  onClick={clearAudio}
                  className="p-2 hover:bg-[#E2E8F0] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
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
                    {isHindi ? 'कॉल विश्लेषण करें' : 'Analyze Call'}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Tab */}
              <div>
                <p className="text-sm font-semibold text-[#1E293B] mb-4">
                  {isHindi ? '📂 फाइल अपलोड करें' : '📂 Upload File'}
                </p>

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
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-input"
                  />

                  <label htmlFor="audio-input" className="cursor-pointer block">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#2563EB]" />
                    <p className="text-lg font-semibold text-[#1E293B] mb-2">
                      {isHindi
                        ? 'यहां ऑडियो ड्रॉप करें'
                        : 'Drop audio file here or click'}
                    </p>
                    <p className="text-sm text-[#475569]">
                      {isHindi
                        ? 'समर्थित: MP3, WAV, OGG 10MB तक'
                        : 'Supported: MP3, WAV, OGG up to 10MB'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#94A3B8]">
                    {isHindi ? 'या' : 'OR'}
                  </span>
                </div>
              </div>

              {/* Record Tab */}
              <div>
                <p className="text-sm font-semibold text-[#1E293B] mb-4">
                  🎙️ {isHindi ? 'सीधे रिकॉर्ड करें' : 'Record Directly'}
                </p>

                <button
                  onClick={startRecording}
                  className="w-full px-6 py-4 bg-[#FEE2E2] border-2 border-[#EF4444] text-[#DC2626] font-semibold rounded-xl hover:bg-[#FEE2E2] transition-all duration-200"
                >
                  <Mic className="w-5 h-5 inline mr-2" />
                  {isHindi ? 'रिकॉर्डिंग शुरू करें' : 'Start Recording'}
                </button>

                <p className="text-xs text-[#475569] text-center mt-3">
                  {isHindi
                    ? 'आपका माइक्रोफोन सुरक्षित रूप से कॉल रिकॉर्ड करेगा'
                    : 'Your microphone will securely record the call'}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Information Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="card-base p-6">
            <h3 className="font-semibold text-[#1E293B] mb-3">
              🔴 {isHindi ? 'स्कैम कॉल संकेत' : 'Scam Call Red Flags'}
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>• {isHindi ? 'तत्काल जानकारी माँगना' : 'Demanding info urgently'}</li>
              <li>• {isHindi ? 'बैंक कर्मचारी होने का दावा' : 'Claiming to be bank staff'}</li>
              <li>• {isHindi ? 'OTP या PIN माँगना' : 'Asking for OTP/PIN'}</li>
              <li>• {isHindi ? 'धमकी या भय दिखाना' : 'Threats or intimidation'}</li>
            </ul>
          </div>

          <div className="card-base p-6">
            <h3 className="font-semibold text-[#1E293B] mb-3">
              ✅ {isHindi ? 'आप क्या करें' : 'What You Should Do'}
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>• {isHindi ? 'तुरंत कॉल काटें' : 'Hang up immediately'}</li>
              <li>• {isHindi ? 'अपने बैंक को कॉल करें' : 'Call your bank directly'}</li>
              <li>• {isHindi ? 'पुलिस को रिपोर्ट करें' : 'Report to police'}</li>
              <li>• {isHindi ? 'साइबर हेल्पलाइन 1930' : 'Call Cyber Helpline 1930'}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
