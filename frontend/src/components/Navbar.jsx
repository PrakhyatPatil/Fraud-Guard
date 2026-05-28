import React, { useState } from 'react';
import { Menu, X, Globe, Shield } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

export default function Navbar({ language, setLanguage, currentPage, setCurrentPage, onOpenEmergency }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHindi = language === 'HI';

  const navLinks = [
    { id: 'home', label: isHindi ? 'होम' : 'Home', page: 'home' },
    { id: 'screenshot', label: isHindi ? 'स्क्रीनशॉट' : 'Screenshot Check', page: 'screenshot' },
    { id: 'url', label: isHindi ? 'URL सत्यापन' : 'URL Verify', page: 'url' },
    { id: 'call', label: isHindi ? 'कॉल विश्लेषण' : 'Call Analysis', page: 'call' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    closeMobileMenu();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1E293B] m-0">FraudGuard</h1>
                <p className="text-xs font-bold text-[#2563EB] tracking-widest m-0">
                  {isHindi ? 'एआई धोखाधड़ी संसूचक' : 'AI SCAM DETECTOR'}
                </p>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentPage === link.page
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-[#475569] hover:text-[#1E293B]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <LanguageToggle language={language} setLanguage={setLanguage} />
              
              <button
                onClick={onOpenEmergency}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white font-semibold rounded-full hover:bg-[#DC2626] transition-all duration-200 hover:shadow-md"
              >
                <span className="text-sm">1930</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#1E293B]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#1E293B]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E2E8F0] animate-slide-down">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === link.page
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <button
                onClick={() => {
                  onOpenEmergency();
                  closeMobileMenu();
                }}
                className="w-full mt-4 px-4 py-3 bg-[#EF4444] text-white font-semibold rounded-lg hover:bg-[#DC2626] transition-all duration-200"
              >
                {isHindi ? 'आपातकालीन (1930)' : 'Emergency Helpline (1930)'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
