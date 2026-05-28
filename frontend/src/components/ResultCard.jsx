import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultCard({ result, language, onReset }) {
  if (!result) return null;

  const isHindi = language === 'HI';
  
  const getTheme = (verdict) => {
    switch(verdict) {
      case 'FRAUD': return { bg: 'bg-[#FEE2E2]', text: 'text-[#EF4444]', border: 'border-[#EF4444]', bgVar: '--verdict-fraud-bg', textVar: '--verdict-fraud', icon: ShieldX, label: isHindi ? 'धोखाधड़ी' : 'Scam Detected' };
      case 'SUSPICIOUS': return { bg: 'bg-[#FFFBEB]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]', bgVar: '--verdict-suspicious-bg', textVar: '--verdict-suspicious', icon: ShieldAlert, label: isHindi ? 'संदिग्ध' : 'Suspicious' };
      case 'SAFE': return { bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', border: 'border-[#22C55E]', bgVar: '--verdict-safe-bg', textVar: '--verdict-safe', icon: ShieldCheck, label: isHindi ? 'सुरक्षित' : 'Looks Safe' };
      default: return { bg: 'bg-[#F8FAFC]', text: 'text-[#1E293B]', border: 'border-[#E2E8F0]', bgVar: '--bg-primary', textVar: '--text-primary', icon: ShieldCheck, label: 'Unknown' };
    }
  };

  const theme = getTheme(result.verdict);
  const Icon = theme.icon;

  const colorMap = {
    'FRAUD': '#EF4444',
    'SUSPICIOUS': '#F59E0B',
    'SAFE': '#22C55E',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden"
    >
      {/* Verdict Banner */}
      <div className={`${theme.bg} p-8 border-b-4 flex items-start justify-between relative overflow-hidden`} style={{ borderColor: colorMap[result.verdict] }}>
        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50" style={{ backgroundColor: colorMap[result.verdict] }} />
        
        <div className="pl-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <Icon className={`w-8 h-8 ${theme.text}`} />
            <h2 className={`text-3xl font-bold ${theme.text}`}>{theme.label}</h2>
          </motion.div>
          <p className="text-sm font-semibold text-[#475569] uppercase tracking-widest">{result.scam_type}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-right"
        >
          <div className={`text-4xl font-bold ${theme.text}`}>{result.confidence}%</div>
          <div className="text-xs text-[#475569] font-semibold tracking-widest">CONFIDENCE</div>
        </motion.div>
      </div>

      {/* Confidence Meter */}
      <motion.div className="h-2 w-full bg-[#E2E8F0]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${result.confidence}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full"
          style={{ backgroundColor: colorMap[result.verdict] }}
        />
      </motion.div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-[#1E293B] text-lg leading-relaxed font-medium">
            {isHindi ? result.summary_hi : result.summary_en}
          </p>
        </motion.div>

        {/* Red Flags */}
        {result.red_flags && result.red_flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-6 border-t border-[#E2E8F0]"
          >
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: colorMap[result.verdict] }} />
              {isHindi ? 'लाल झंडे (Red Flags)' : 'Red Flags'}
            </h3>
            <ul className="space-y-3">
              {result.red_flags.map((flag, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3 text-[#475569]"
                >
                  <span className="text-[#EF4444] font-bold text-lg mt-0.5">•</span>
                  <span className="text-sm">{flag}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Actions */}
        {((isHindi ? result.actions_hi : result.actions_en) || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-6 border-t border-[#E2E8F0] bg-[#F0FDF4] -mx-8 px-8 pb-2"
          >
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-widest mb-4 flex items-center gap-2 pt-6">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              {isHindi ? 'क्या करें (What To Do)' : 'What To Do'}
            </h3>
            <ul className="space-y-3 pb-6">
              {(isHindi ? result.actions_hi : result.actions_en).map((action, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 text-[#1E293B] font-medium bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-sm"
                >
                  <ArrowRight className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="text-sm">{action}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#1E293B] px-6 py-2 rounded-lg hover:bg-white transition-all duration-200"
        >
          <RefreshCcw className="w-4 h-4" />
          {isHindi ? 'नया स्कैन करें' : 'Scan Another'}
        </button>
        <button className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-md">
          {isHindi ? 'सहेजें' : 'Save Result'}
        </button>
      </motion.div>
    </motion.div>
  );
}
