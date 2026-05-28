import React from 'react';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-[#F8FAFC] rounded-full border border-[#E2E8F0] hover:border-[#2563EB] transition-all">
      <button
        onClick={() => setLanguage('EN')}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
          language === 'EN'
            ? 'bg-[#2563EB] text-white shadow-sm'
            : 'text-[#475569] hover:text-[#1E293B]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('HI')}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
          language === 'HI'
            ? 'bg-[#2563EB] text-white shadow-sm'
            : 'text-[#475569] hover:text-[#1E293B]'
        }`}
      >
        हिं
      </button>
    </div>
  );
}
