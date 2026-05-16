import React, { useState, useRef, useEffect } from 'react';

/**
 * A modern, premium-styled dropdown component to replace the native <select>.
 * Features:
 * - Smooth animations
 * - Custom scrollbar
 * - Hover/Active states
 * - Click-outside to close
 */
export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select option...', 
  style = {},
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const toggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (val) => {
    // Mock event object for compatibility with existing onChange handlers
    onChange({ target: { value: val } }); 
    setIsOpen(false);
  };

  const S = {
    container: {
      position: 'relative',
      width: '100%',
      fontFamily: 'Inter, -apple-system, sans-serif',
      ...style,
    },
    trigger: {
      width: '100%',
      background: disabled ? '#f1f5f9' : (isOpen ? '#fff' : '#f8fafc'),
      border: `1.5px solid ${isOpen ? '#2563eb' : '#e2e8f0'}`,
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all .2s ease',
      boxShadow: isOpen ? '0 0 0 4px rgba(37,99,235,.1)' : 'none',
      boxSizing: 'border-box',
      minHeight: '46px',
    },
    label: {
      fontSize: 14,
      fontWeight: 600,
      color: selectedOption ? '#0f172a' : '#94a3b8',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    icon: {
      marginLeft: 12,
      transition: 'transform .2s ease',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: isOpen ? '#2563eb' : '#94a3b8',
      flexShrink: 0,
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      boxShadow: '0 12px 40px rgba(0,0,0,.12)',
      zIndex: 1000,
      maxHeight: 280,
      overflowY: 'auto',
      padding: 6,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all .2s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    option: (active) => ({
      padding: '10px 12px',
      borderRadius: 9,
      fontSize: 14,
      fontWeight: active ? 700 : 500,
      color: active ? '#2563eb' : '#475569',
      background: active ? '#eff6ff' : 'transparent',
      cursor: 'pointer',
      transition: 'all .15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 2,
    }),
  };

  return (
    <div style={S.container} ref={containerRef}>
      <div style={S.trigger} onClick={toggle}>
        <span style={S.label}>{displayLabel}</span>
        <svg 
          style={S.icon} 
          width="16" height="16" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div style={S.dropdown}>
        {options.map((opt) => (
          <div 
            key={opt.value} 
            style={S.option(opt.value === value)}
            onClick={() => handleSelect(opt.value)}
            onMouseOver={e => {
              if (opt.value !== value) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#0f172a';
              }
            }}
            onMouseOut={e => {
              if (opt.value !== value) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#475569';
              }
            }}
          >
            {opt.label}
            {opt.value === value && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
