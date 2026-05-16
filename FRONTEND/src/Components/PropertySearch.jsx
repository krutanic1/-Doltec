import React, { useState, useEffect } from 'react';
import { 
  INTENT_OPTIONS, 
  SEGMENT_OPTIONS, 
  PROPERTY_TYPE_OPTIONS, 
  BHK_OPTIONS, 
  BUDGET_SLABS 
} from '../real-estate/constants/filterOptions';

const searchModes = {
  buy: {
    label: "Buy",
    placeholder: "Search by city, locality, project, or landmark",
    intent: 'BUY',
    segment: 'RESIDENTIAL',
    filters: ["propertyType", "budget", "bhk", "possession", "readyToMove", "age", "postedBy"]
  },
  rent: {
    label: "Rent",
    placeholder: "Search rental properties by city, locality, or project",
    intent: 'RENT',
    segment: 'RESIDENTIAL',
    filters: ["propertyType", "budget", "bhk", "furnishing", "tenantType", "availability"]
  },
  commercial: {
    label: "Commercial",
    placeholder: "Search offices, shops, showrooms, or warehouses",
    intent: 'BUY',
    segment: 'COMMERCIAL',
    filters: ["propertyType", "budget", "area", "furnishing"]
  },
  plots: {
    label: "Plots/Land",
    placeholder: "Search plots and land by city, locality, or layout",
    intent: 'BUY',
    segment: 'PLOTS_LAND',
    filters: ["propertyType", "budget", "area", "facing"]
  }
};

export default function PropertySearch({ onSearch }) {
  const [activeTab, setActiveTab] = useState('buy');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({});
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const mode = searchModes[activeTab];
    onSearch?.({ 
      intent: mode.intent, 
      segment: mode.segment, 
      q: query, 
      ...filters 
    });
  };

  return (
    <div className="property-search-container container">
      {/* Tab Switcher */}
      <div className="search-tabs">
        {Object.keys(searchModes).map(key => (
          <button 
            key={key}
            className={`search-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {searchModes[key].label}
          </button>
        ))}
      </div>

      {/* Main Search Bar */}
      <div className="search-main-box">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrap">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="search-icon">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input 
              type="text" 
              placeholder={searchModes[activeTab].placeholder} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <select 
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="filter-select"
          >
            <option value="">Property Type</option>
            {(PROPERTY_TYPE_OPTIONS[searchModes[activeTab].segment] || []).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select 
            onChange={(e) => handleFilterChange('budget', e.target.value)}
            className="filter-select"
          >
            <option value="">Budget</option>
            {(BUDGET_SLABS[searchModes[activeTab].intent] || []).map(opt => (
              <option key={opt.label} value={opt.label}>{opt.label}</option>
            ))}
          </select>

          {searchModes[activeTab].segment === 'RESIDENTIAL' && (
            <select 
              onChange={(e) => handleFilterChange('bhk', e.target.value)}
              className="filter-select"
            >
              <option value="">BHK</option>
              {BHK_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .property-search-container { background: white; padding: 32px; borderRadius: 48px; boxShadow: 0 40px 100px rgba(0,0,0,0.15); width: 100%; maxWidth: 900px; margin: 0 auto; transition: all 0.3s; }
        .search-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
        .search-tab { padding: 12px 24px; font-weight: 800; font-size: 14px; border: none; background: none; cursor: pointer; color: #94a3b8; transition: all 0.2s; position: relative; }
        .search-tab.active { color: #2563eb; }
        .search-tab.active::after { content: ''; position: absolute; bottom: -9px; left: 0; right: 0; height: 3px; background: #2563eb; borderRadius: 3px; }
        .search-main-box { margin-bottom: 24px; }
        .search-form { display: flex; gap: 16px; alignItems: center; }
        .search-input-wrap { flex: 1; display: flex; alignItems: center; gap: 12px; background: #f8fafc; padding: 16px 24px; borderRadius: 20px; border: 1px solid #e2e8f0; transition: all 0.2s; }
        .search-input-wrap:focus-within { background: white; borderColor: #2563eb; boxShadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .search-icon { color: #94a3b8; }
        .search-input { flex: 1; border: none; background: none; outline: none; font-size: 16px; font-weight: 600; color: #0f172a; }
        .search-submit-btn { background: #2563eb; color: white; padding: 16px 40px; borderRadius: 20px; font-weight: 800; font-size: 16px; cursor: pointer; border: none; transition: all 0.2s; boxShadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .search-submit-btn:hover { transform: translateY(-2px); boxShadow: 0 15px 30px rgba(37, 99, 235, 0.3); }
        .filter-select { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 16px; borderRadius: 12px; font-size: 13px; font-weight: 700; color: #64748b; outline: none; cursor: pointer; transition: all 0.2s; }
        .filter-select:hover { background: #f1f5f9; borderColor: #cbd5e1; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
