import React from 'react';
import { Clock, ShieldCheck, ShieldAlert, ShieldX, Image as ImageIcon, MessageSquare, Mic } from 'lucide-react';

const getVerdictIcon = (verdict) => {
  switch (verdict) {
    case 'FRAUD': return <ShieldX style={{ color: 'var(--verdict-fraud)', width: '18px', height: '18px' }} />;
    case 'SUSPICIOUS': return <ShieldAlert style={{ color: 'var(--verdict-suspicious)', width: '18px', height: '18px' }} />;
    case 'SAFE': return <ShieldCheck style={{ color: 'var(--verdict-safe)', width: '18px', height: '18px' }} />;
    default: return null;
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'screenshot': return <ImageIcon style={{ color: 'var(--text-muted)', width: '16px', height: '16px' }} />;
    case 'text': return <MessageSquare style={{ color: 'var(--text-muted)', width: '16px', height: '16px' }} />;
    case 'audio': return <Mic style={{ color: 'var(--text-muted)', width: '16px', height: '16px' }} />;
    default: return <MessageSquare style={{ color: 'var(--text-muted)', width: '16px', height: '16px' }} />;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function HistoryPanel({ history = [], onSelectScan }) {
  return (
    <div style={{
      width: '280px',
      height: '100%',
      borderRight: '1px solid var(--bg-border)',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--bg-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock style={{ color: 'var(--text-secondary)', width: '18px', height: '18px' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>Recent Scans</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No scans yet
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {history.map((item) => (
              <li
                key={item.scan_id}
                onClick={() => onSelectScan && onSelectScan(item)}
                style={{
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid var(--bg-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ marginTop: '2px' }}>{getTypeIcon(item.input_type)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                      {item.summary_en?.slice(0, 40) || item.scam_type || 'Scan'}
                    </p>
                    {getVerdictIcon(item.verdict)}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{formatDate(item.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
