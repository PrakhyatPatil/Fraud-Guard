import React from 'react';
import { Zap, Shield, ArrowRight } from 'lucide-react';

export default function HomePage({ language, onPageChange }) {
  const isHindi = language === 'HI';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2563EB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center">
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 mb-8 w-fit">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-sm font-medium">
                  {isHindi ? 'Gemini AI द्वारा संचालित' : 'Powered by Gemini AI'}
                </span>
              </div>

              {/* Main Headline */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                  {isHindi ? (
                    <>
                      आपको डिजिटल
                      <br />
                      <span className="text-gradient">धोखाधड़ी</span> से बचाएं
                    </>
                  ) : (
                    <>
                      Protect Yourself from
                      <br />
                      <span className="text-gradient">Digital Fraud</span>
                    </>
                  )}
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-lg text-gray-200 mb-10 leading-relaxed max-w-lg">
                {isHindi
                  ? 'FraudGuard उन्नत AI का उपयोग करके नकली UPI स्क्रीनशॉट, फिशिंग लिंक और स्कैम कॉल का पता लगाता है — उपयोगकर्ताओं को पैसा खोने से पहले सरल हिंदी और अंग्रेजी में स्कैम समझाता है।'
                  : 'FraudGuard uses advanced AI to detect fake UPI screenshots, phishing links, and scam calls — explaining scams in simple Hindi & English before users lose money.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onPageChange('screenshot')}
                  className="btn-primary flex items-center justify-center gap-2 group bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  {isHindi ? 'स्क्रीनशॉट जांचें' : 'Check Screenshot Now'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => onPageChange('url')}
                  className="btn-glass"
                >
                  {isHindi ? 'लिंक सत्यापित करें' : 'Verify a Link'}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-sm text-gray-300">
                    {isHindi ? 'सरकारी-ग्रेड सुरक्षा' : 'Government-Grade Secure'}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FBBF24]" />
                  <span className="text-sm text-gray-300">
                    {isHindi ? 'तत्काल विश्लेषण' : 'Instant Analysis'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Card 1 */}
                <div className="absolute top-0 right-0 w-64 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                    <span className="text-white text-sm font-semibold">Safe Link</span>
                  </div>
                  <p className="text-gray-200 text-sm">https://example-bank.com/verify</p>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-20 left-0 w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <span className="text-white text-sm font-semibold">Phishing Detected</span>
                  </div>
                  <p className="text-gray-200 text-sm">⚠️ This link appears to be a phishing attempt</p>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 w-40 h-40 mx-auto bg-gradient-to-br from-[#2563EB] to-[#60A5FA] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation for floating cards */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
