import React, { useState, useEffect } from 'react';

const searchModes = {
  buy: {
    label: "Buy",
    placeholder: "Search by city, locality, project, or landmark",
    filters: ["location", "propertyType", "budget", "bhk", "possession", "readyToMove", "age", "postedBy", "amenities"]
  },
  rent: {
    label: "Rent",
    placeholder: "Search rental properties by city, locality, or project",
    filters: ["location", "propertyType", "rent", "bhk", "furnishing", "tenantType", "availability", "parking", "postedBy"]
  },
  newLaunch: {
    label: "New Launch",
    placeholder: "Search new launch projects by city, locality, or builder",
    filters: ["city", "projectType", "budget", "configuration", "possession", "rera"]
  },
  commercial: {
    label: "Commercial",
    placeholder: "Search offices, shops, showrooms, or warehouses",
    filters: ["location", "commercialType", "budget", "area", "furnishing", "parking"]
  },
  plots: {
    label: "Plots/Land",
    placeholder: "Search plots and land by city, locality, or layout",
    filters: ["location", "plotType", "budget", "area", "facing", "approvedBy", "gatedCommunity"]
  },
  projects: {
    label: "Projects",
    placeholder: "Search residential projects by city, locality, or builder",
    filters: ["city", "builder", "budget", "configuration", "status", "possession"]
  }
};

const categoryOptions = [
  "All Residential", "Apartment", "Villa", "Builder Floor", "Independent House", 
  "Studio Apartment", "Shop", "Office", "Warehouse", "Plot", 
  "Agricultural Land", "Industrial Land"
];

export default function PropertySearch({ onSearch }) {
  const [activeTab, setActiveTab] = useState('buy');
  const [category, setCategory] = useState('All Residential');
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({}); // Reset filters on tab change
    setShowAdvanced(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.({ tab: activeTab, category, query, filters });
  };

  return (
    <div className="property-search-container">
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
          <div className="category-select">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="search-input-wrap">
            <input 
              type="text" 
              placeholder={searchModes[activeTab].placeholder} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-suggestions">
               {/* Autocomplete suggestions could go here */}
            </div>
          </div>

          <button type="submit" className="search-submit-btn">
            Search 🔍
          </button>
        </form>
      </div>

      {/* Quick Filter Chips */}
      <div className="quick-filters">
        {searchModes[activeTab].filters.slice(0, 4).map(filter => (
          <button key={filter} className="filter-chip" onClick={() => setShowAdvanced(true)}>
            {filter.replace(/([A-Z])/g, ' $1').toLowerCase()} ▾
          </button>
        ))}
        <button className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide Filters' : 'More Filters +'}
          {Object.keys(filters).length > 0 && <span className="filter-badge">{Object.keys(filters).length}</span>}
        </button>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvanced && (
        <div className="advanced-filter-panel">
          <div className="filter-grid">
            {searchModes[activeTab].filters.map(filter => (
              <div key={filter} className="filter-item">
                <label>{filter.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                <input 
                  type="text" 
                  placeholder="Any" 
                  onChange={(e) => handleFilterChange(filter, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="filter-footer">
            <button className="clear-all" onClick={() => setFilters({})}>Clear All</button>
            <button className="apply-filters" onClick={handleSearch}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Recent & Popular */}
      <div className="search-footer-info">
        <span className="info-label">Popular:</span>
        <div className="popular-tags">
          <span>Mumbai</span>
          <span>Bangalore</span>
          <span>3 BHK Apartments</span>
          <span>Ready to Move</span>
        </div>
      </div>
    </div>
  );
}
