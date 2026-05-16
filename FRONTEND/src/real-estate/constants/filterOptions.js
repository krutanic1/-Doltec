/* ─────────────────────────────────────────────────────
   src/real-estate/constants/filterOptions.js
   Master configuration for all property filters.
   Used by both Property Registration and Buyer Search.
───────────────────────────────────────────────────── */

export const INTENT_OPTIONS = [
  { label: 'Buy', value: 'BUY' },
  { label: 'Rent', value: 'RENT' },
];

export const SEGMENT_OPTIONS = [
  { label: 'Residential', value: 'RESIDENTIAL' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Plots/Land', value: 'PLOTS_LAND' },
  { label: 'Projects', value: 'PROJECTS' },
  { label: 'New Launch', value: 'NEW_LAUNCH' },
];

export const PROPERTY_TYPE_OPTIONS = {
  RESIDENTIAL: [
    { label: 'Apartment', value: 'APARTMENT' },
    { label: 'Villa', value: 'VILLA' },
    { label: 'Builder Floor', value: 'BUILDER_FLOOR' },
    { label: 'Independent House', value: 'INDEPENDENT_HOUSE' },
    { label: 'Studio Apartment', value: 'STUDIO_APARTMENT' },
  ],
  COMMERCIAL: [
    { label: 'Shop', value: 'SHOP' },
    { label: 'Office', value: 'OFFICE' },
    { label: 'Warehouse', value: 'WAREHOUSE' },
  ],
  PLOTS_LAND: [
    { label: 'Plot', value: 'PLOT' },
    { label: 'Agricultural Land', value: 'AGRICULTURAL_LAND' },
    { label: 'Industrial Land', value: 'INDUSTRIAL_LAND' },
  ],
};

// Flattened for general use
export const ALL_PROPERTY_TYPES = Object.values(PROPERTY_TYPE_OPTIONS).flat();

export const BHK_OPTIONS = [
  { label: '1 RK', value: '1_RK' },
  { label: '1 BHK', value: '1_BHK' },
  { label: '2 BHK', value: '2_BHK' },
  { label: '3 BHK', value: '3_BHK' },
  { label: '4 BHK', value: '4_BHK' },
  { label: '5+ BHK', value: '5_PLUS_BHK' },
];

export const BUDGET_SLABS = {
  BUY: [
    { label: 'Under ₹50L', min: 0, max: 5000000 },
    { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
    { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
    { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
    { label: '₹5Cr+', min: 50000000, max: 999999999 },
  ],
  RENT: [
    { label: 'Under ₹10k', min: 0, max: 10000 },
    { label: '₹10k - ₹25k', min: 10000, max: 25000 },
    { label: '₹25k - ₹50k', min: 25000, max: 50000 },
    { label: '₹50k - ₹1L', min: 50000, max: 100000 },
    { label: '₹1L+', min: 100000, max: 9999999 },
  ]
};

export const POSSESSION_OPTIONS = [
  { label: 'Ready to Move', value: 'READY_TO_MOVE' },
  { label: 'Under Construction', value: 'UNDER_CONSTRUCTION' },
  { label: 'New Launch', value: 'NEW_LAUNCH' },
];

export const AGE_OPTIONS = [
  { label: 'New', value: 'NEW' },
  { label: '0-1 Years', value: '0_1_YEARS' },
  { label: '1-3 Years', value: '1_3_YEARS' },
  { label: '3-5 Years', value: '3_5_YEARS' },
  { label: '5-10 Years', value: '5_10_YEARS' },
  { label: '10+ Years', value: '10_PLUS_YEARS' },
];

export const POSTED_BY_OPTIONS = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Agent', value: 'AGENT' },
  { label: 'Builder', value: 'BUILDER' },
];

export const FURNISHING_OPTIONS = [
  { label: 'Unfurnished', value: 'UNFURNISHED' },
  { label: 'Semi-Furnished', value: 'SEMI_FURNISHED' },
  { label: 'Fully Furnished', value: 'FULLY_FURNISHED' },
];

export const FACING_OPTIONS = [
  { label: 'North', value: 'NORTH' },
  { label: 'South', value: 'SOUTH' },
  { label: 'East', value: 'EAST' },
  { label: 'West', value: 'WEST' },
  { label: 'North-East', value: 'NORTH_EAST' },
  { label: 'North-West', value: 'NORTH_WEST' },
  { label: 'South-East', value: 'SOUTH_EAST' },
  { label: 'South-West', value: 'SOUTH_WEST' },
];

export const PARKING_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3+', value: '3_PLUS' },
];

export const AMENITIES_OPTIONS = [
  { label: 'Lift', value: 'LIFT' },
  { label: 'Parking', value: 'PARKING' },
  { label: 'Power Backup', value: 'POWER_BACKUP' },
  { label: 'Swimming Pool', value: 'SWIMMING_POOL' },
  { label: 'Gym', value: 'GYM' },
  { label: 'Security', value: 'SECURITY' },
  { label: 'Club House', value: 'CLUB_HOUSE' },
  { label: 'Garden', value: 'GARDEN' },
  { label: 'Children Play Area', value: 'CHILDREN_PLAY_AREA' },
  { label: 'CCTV', value: 'CCTV' },
  { label: 'Borewell', value: 'BOREWELL' },
  { label: 'Gated Community', value: 'GATED_COMMUNITY' },
  { label: 'Furnished', value: 'FURNISHED' },
  { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
];

export const AVAILABILITY_OPTIONS = [
  { label: 'Immediate', value: 'IMMEDIATE' },
  { label: 'Within 30 Days', value: 'WITHIN_30_DAYS' },
  { label: 'Within 3 Months', value: 'WITHIN_3_MONTHS' },
  { label: 'Within 6 Months', value: 'WITHIN_6_MONTHS' },
];

export const MASTER_FILTER_CONFIG = {
  intent: INTENT_OPTIONS,
  segment: SEGMENT_OPTIONS,
  propertyType: ALL_PROPERTY_TYPES,
  bhk: BHK_OPTIONS,
  possession: POSSESSION_OPTIONS,
  age: AGE_OPTIONS,
  postedBy: POSTED_BY_OPTIONS,
  furnishing: FURNISHING_OPTIONS,
  facing: FACING_OPTIONS,
  parking: PARKING_OPTIONS,
  amenities: AMENITIES_OPTIONS,
  availability: AVAILABILITY_OPTIONS,
};
