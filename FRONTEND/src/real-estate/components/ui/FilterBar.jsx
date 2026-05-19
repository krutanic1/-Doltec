import React from 'react';

export default function FilterBar({ search, onSearch, filters = [], actions = null }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {search ? (
          <input
            value={search.value}
            onChange={(event) => onSearch?.(event.target.value)}
            placeholder={search.placeholder || 'Search...'}
            style={{ minWidth: 240, padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', fontSize: 14, outline: 'none' }}
          />
        ) : null}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(event) => filter.onChange?.(event.target.value)}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', fontSize: 14, outline: 'none' }}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      {actions}
    </div>
  );
}
