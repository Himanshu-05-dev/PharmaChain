import { SavedMedicine, SafetyAlert, HealthInsight, MedicineSafetyMetrics } from '../types';

export const SAFETY_METRICS: MedicineSafetyMetrics = {
  verifiedCount: 0,
  attentionNeededCount: 0,
  expiringSoonCount: 0,
  suspiciousAlertsCount: 0,
  overallSafetyScore: 100,
  lastUpdated: 'Live',
};

// Clean default state - populated dynamically when user scans medicines
export const SAVED_MEDICINES: SavedMedicine[] = [];

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-1',
    title: 'CDSCO Quality Advisory: Check Verifiable 2D DataMatrix',
    severity: 'high',
    status: 'Warning',
    source: 'Central Drugs Standard Control Organisation',
    date: 'Active Bulletin',
    summary: 'Consumers are advised to verify digital cryptographic signatures on all scheduled pharmaceutical packaging prior to purchase.',
    affectedBatches: ['Scheduled Formulations'],
    recommendedAction: 'Scan packaging via PharmaChain to verify manufacturer signature on blockchain.',
    isNationalAdvisory: true,
  },
  {
    id: 'alert-2',
    title: 'Cold-Chain Storage Notice: Monsoon Temperature Guidelines',
    severity: 'low',
    status: 'Verified',
    source: 'Indian Pharmacopoeia Commission',
    date: 'Monsoon Bulletin',
    summary: 'High humidity can degrade hygroscopic tablets and antibiotic suspensions. Always ensure proper airtight storage.',
    affectedBatches: ['Moisture-sensitive capsules & suspensions'],
    recommendedAction: 'Store in cool dry conditions below 25°C away from direct sunlight.',
    isNationalAdvisory: false,
  },
];

export const HEALTH_INSIGHTS: HealthInsight[] = [
  {
    id: 'insight-1',
    title: 'How to Spot Spurious Medicine Packaging',
    category: 'Counterfeit Awareness',
    readTime: '2 min read',
    summary: 'Inspect foil thickness, font crispness, and verify tamper-proof blockchain signatures.',
    content: [
      '1. Verify Hologram & Seal: Authentic packaging features tamper-evident micro-embossed seals that cannot be reused.',
      '2. Scan Verifiable 2D Matrix: Every genuine blister pack is logged with a unique cryptographic hash on Hyperledger Fabric.',
      '3. Match Batch & Expiry: Ensure the printed batch number and expiry date match the on-chain digital certificate exactly.',
    ],
    keyTakeaway: 'Always scan medicine packaging with PharmaChain before consuming.',
    iconName: 'ShieldAlert',
  },
  {
    id: 'insight-2',
    title: 'Essential Temperature & Storage Rules',
    category: 'Storage & Safety',
    readTime: '1 min read',
    summary: 'Learn optimal temperature ranges to maintain drug potency and active ingredients.',
    content: [
      'Reconstituted antibiotic liquids lose stability quickly if stored above recommended temperature.',
      'Avoid humid storage like bathroom cabinets; moisture accelerates chemical degradation.',
      'Maintain continuous 2°C–8°C refrigeration for cold-chain medications such as insulin and vaccines.',
    ],
    keyTakeaway: 'Check storage specifications: "Store below 25°C in a dry place".',
    iconName: 'Thermometer',
  },
  {
    id: 'insight-3',
    title: 'Safe Disposal of Expired Medicines',
    category: 'Expiry & Disposal',
    readTime: '2 min read',
    summary: 'Safely dispose of expired medications without contaminating the local environment.',
    content: [
      'Never flush unconsumed tablets down sinks or toilets into groundwater systems.',
      'Return expired strips to certified pharmacy take-back drop boxes.',
      'De-identify personal prescription details before recycling external cardboard packaging.',
    ],
    keyTakeaway: 'Use authorized take-back collection points at certified partner pharmacies.',
    iconName: 'Recycle',
  },
];
