import { SavedMedicine, SafetyAlert, HealthInsight, MedicineSafetyMetrics } from '../types';

export const SAFETY_METRICS: MedicineSafetyMetrics = {
  verifiedCount: 0,
  attentionNeededCount: 0,
  expiringSoonCount: 0,
  suspiciousAlertsCount: 0,
  overallSafetyScore: 100,
  lastUpdated: 'Live',
};

export const SAVED_MEDICINES: SavedMedicine[] = [];

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-1',
    title: 'Advisory: Packaging Quality Recall on Batch #PCM-2024-X',
    severity: 'high',
    status: 'Warning',
    source: 'Central Drugs Standard Control Organisation (CDSCO)',
    date: '21 Aug 2026',
    summary: 'CDSCO issued an advisory regarding blister seal irregularities in Paracetamol 500mg (Batch PCM-2024-X). Check your home medicine cabinet.',
    affectedBatches: ['PCM-2024-X', 'PCM-2024-Y'],
    recommendedAction: 'Verify your batch on PharmaChain. Do not consume compromised seals.',
    isNationalAdvisory: true,
  },
  {
    id: 'alert-2',
    title: 'Counterfeit Alert: Look for PharmaChain 3D QR Codes',
    severity: 'medium',
    status: 'Suspicious',
    source: 'National Pharmacovigilance Network',
    date: '19 Aug 2026',
    summary: 'Reports of duplicate barcode stickers detected in NCR retail pharmacies. Genuine medicine packs feature encrypted verifiable QR codes.',
    affectedBatches: ['Multiple antacid brands'],
    recommendedAction: 'Scan every medicine pack before purchasing to verify cryptographic signature.',
    isNationalAdvisory: false,
  },
  {
    id: 'alert-3',
    title: 'Seasonal Storage Notice: Monsoon Temperature Guidelines',
    severity: 'low',
    status: 'Verified',
    source: 'Indian Pharmacopoeia Commission',
    date: '14 Aug 2026',
    summary: 'High humidity during rainy seasons can degrade hygroscopic tablets like effervescent Vitamin C and probiotic capsules.',
    affectedBatches: ['All moisture-sensitive capsules'],
    recommendedAction: 'Store in airtight containers below 25°C away from direct sunlight.',
    isNationalAdvisory: false,
  },
];

export const HEALTH_INSIGHTS: HealthInsight[] = [
  {
    id: 'insight-1',
    title: 'How to Spot Fake Blister Packs in 3 Easy Steps',
    category: 'Counterfeit Awareness',
    readTime: '2 min read',
    summary: 'Inspect foil thickness, text alignment, and verify cryptographic batch hashes via your PharmaChain camera.',
    content: [
      '1. Check Font Quality: Counterfeit packaging often exhibits faint, blurry typography or misspelled generic chemical names.',
      '2. Inspect the Holographic Strip: Authentic medicines have high-precision micro-embossed security holograms that shift color under light.',
      '3. Verify PharmaChain QR: Genuine digital packs validate instantly against tamper-proof blockchain supply records.',
    ],
    keyTakeaway: 'When in doubt, use the built-in scanner to verify provenance and distributor trace.',
    iconName: 'ShieldAlert',
  },
  {
    id: 'insight-2',
    title: 'Essential Temperature & Storage Rules for Antibiotics',
    category: 'Storage & Safety',
    readTime: '1 min read',
    summary: 'Reconstituted pediatric suspensions must be refrigerated between 2°C–8°C and discarded after 7 days.',
    content: [
      'Reconstituted liquid antibiotics lose efficacy rapidly at room temperature.',
      'Never store tablets inside bathroom medicine cabinets due to excessive steam and moisture.',
      'Keep chronic medications in their original moisture-resistant blister packaging until ingestion.',
    ],
    keyTakeaway: 'Always check the package storage conditions: "Store below 25°C in a dry place".',
    iconName: 'Thermometer',
  },
  {
    id: 'insight-3',
    title: 'Safe Disposal of Expired & Unused Medications',
    category: 'Expiry & Disposal',
    readTime: '2 min read',
    summary: 'Flushing expired antibiotics contaminates groundwater and contributes to antimicrobial resistance.',
    content: [
      'Never discard pills directly into garbage where animals or scavengers can access them.',
      'Drop off expired strips at local pharmacy take-back drop boxes participating in the GreenPharma network.',
      'Cross out your name and prescription details on discarded bottles to protect your medical privacy.',
    ],
    keyTakeaway: 'Use authorized take-back kiosks available at certified community pharmacies.',
    iconName: 'Recycle',
  },
];
