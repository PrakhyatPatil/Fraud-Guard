import React, { useState } from 'react';
import { UploadCloud, MessageSquare, Mic, X } from 'lucide-react';

export default function InputTabs({ onAnalyze, isScanning, language }) {
  const [activeTab, setActiveTab] = useState('screenshot');
  const [textInput, setTextInput] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const isHindi = language === 'HI';

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const handleAnalyze = () => {
    if (activeTab === 'text') {
      onAnalyze({ type: 'text', content: textInput, file: null });
    } else if (activeTab === 'screenshot') {
      onAnalyze({ type: 'screenshot', content: null, file });
    } else if (activeTab === 'audio') {
      onAnalyze({ type: 'audio', content: 'audio recorded', file: null });
    }
  };

  const isDisabled = isScanning
    || (activeTab === 'screenshot' && !file)
    || (activeTab === 'text' && textInput.trim().length < 5);

  const tabs = [
    { id: 'screenshot', icon: UploadCloud, label: isHindi ? 'इमेज / PDF' : 'Image / PDF' },
    { id: 'text', icon: MessageSquare, label: isHindi ? 'टेक्स्ट पेस्ट करें' : 'Paste Text' },
    { id: 'audio', icon: Mic, label: isHindi ? 'ऑडियो रिकॉर्ड करें' : 'Record Audio' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '640px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--bg-border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--bg-border)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '1rem 0.5rem',
                border: 'none',
                background: isActive ? 'var(--bg-surface)' : 'var(--bg-primary)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderBottom: isActive ? `2px solid var(--accent-primary)` : '2px solid transparent',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
            >
              <Icon style={{ width: '20px', height: '20px' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'screenshot' && (
          filePreview ? (
            <div style={{ flex: 1, position: 'relative', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--bg-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
              <img src={filePreview} alt="Preview" style={{ maxHeight: '180px', objectFit: 'contain' }} />
              <button
                onClick={() => { setFile(null); setFilePreview(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          ) : (
            <label
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              style={{ flex: 1, border: '2px dashed var(--bg-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', padding: '2rem', textAlign: 'center', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bg-border)'}
            >
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(37,99,235,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <UploadCloud style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{isHindi ? 'क्लिक करें या फ़ाइल खींचें' : 'Click to upload or drag & drop'}</p>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>{isHindi ? 'JPG, PNG, WEBP या PDF (अधिकतम 10MB)' : 'JPG, PNG, WEBP or PDF (max 10MB)'}</p>
              </div>
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileChange} />
            </label>
          )
        )}

        {activeTab === 'text' && (
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder={isHindi ? 'यहाँ संदिग्ध SMS, WhatsApp मैसेज, या लिंक पेस्ट करें...' : 'Paste a suspicious SMS, WhatsApp message, or link here...'}
            style={{ flex: 1, width: '100%', minHeight: '180px', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-border)', borderRadius: '12px', resize: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6, boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
          />
        )}

        {activeTab === 'audio' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsRecording(!isRecording)}
              style={{
                width: '88px', height: '88px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                backgroundColor: isRecording ? 'rgba(220,38,38,0.1)' : 'var(--bg-primary)',
                color: isRecording ? 'var(--verdict-fraud)' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: isRecording ? 'soft-pulse 1.5s infinite' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Mic style={{ width: '32px', height: '32px' }} />
            </button>
            <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '15px', margin: 0 }}>
              {isRecording
                ? (isHindi ? 'रिकॉर्डिंग हो रही है... रोकने के लिए टैप करें' : 'Recording... Tap to stop')
                : (isHindi ? 'संदिग्ध कॉल रिकॉर्ड करें' : 'Tap to record suspicious call')}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleAnalyze}
          disabled={isDisabled}
          style={{
            marginTop: '1.25rem', width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
            backgroundColor: isDisabled ? 'var(--bg-border)' : 'var(--accent-primary)',
            color: isDisabled ? 'var(--text-muted)' : '#ffffff',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', cursor: isDisabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = 'var(--accent-secondary)'; }}
          onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = 'var(--accent-primary)'; }}
        >
          {isScanning ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              {isHindi ? 'जांच हो रही है...' : 'Scanning for Risks...'}
            </>
          ) : (
            isHindi ? 'जोखिम की जांच करें' : 'Analyze for Risks'
          )}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
