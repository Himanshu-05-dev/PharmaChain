import {
  Batch,
  DashboardStats,
  ExpiryMonitoringItem,
  InventoryItem,
  ManufacturerProfile,
  B2BOrder,
  QualityAlert,
  RecallRecord,
  TopProductMetric,
  TransitionRecord,
  Pack,
} from '../types';

export const mockManufacturerProfile: ManufacturerProfile = {
  id: 'MFR_MEDCORE_001',
  name: 'MedCore Pharmaceuticals Ltd.',
  code: 'MFR-001',
  email: 'compliance@medcorepharma.in',
  licenseNumber: 'CDSCO-MFG-DL-2024-88491',
  kycStatus: 'APPROVED',
  keyId: 'mfr-key-medcore-001',
  keyAlgorithm: 'ES256 (ECDSA P-256)',
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7Z13U0NqfL3Kj1yR3w5Q7sV8zN0A
aB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP==
-----END PUBLIC KEY-----`,
  keyStatus: 'Protected in AES-256-GCM Vault',
  headquarters: 'MedCore Tower, Plot 42, Okhla Phase III, New Delhi 110020, India',
  plantLocations: [
    { name: 'Baddi Formulation Unit 1', address: 'Plot 104, Industrial Area, Baddi, HP 173205', facilityId: 'FAC-HP-01', isActive: true },
    { name: 'Hyderabad Sterile Injectables Hub', address: 'Genome Valley, Shamirpet, Hyderabad 500078', facilityId: 'FAC-HYD-02', isActive: true },
    { name: 'Sikkim Oral Solid Dosage Plant', address: 'NH-10, Majhitar, Rangpo, Sikkim 737132', facilityId: 'FAC-SK-03', isActive: true }
  ],
  authorizedPersonnel: [
    { name: 'Dr. Rajesh Sharma', role: 'Head of Quality Assurance & QP', email: 'rajesh.sharma@medcorepharma.in', phone: '+91 98110 44219' },
    { name: 'Ananya Deshmukh', role: 'Plant Production Director', email: 'ananya.d@medcorepharma.in', phone: '+91 98220 11983' },
    { name: 'Vikram Mehta', role: 'Chief Compliance & Cryptographic Officer', email: 'vikram.m@medcorepharma.in', phone: '+91 98330 77412' }
  ],
  registeredAt: '2021-03-15',
  gstin: '07AAACM1234F1Z8',
  cdscoRegistration: 'REG-INDIA-2021-77810'
};

export const mockDashboardStats: DashboardStats = {
  totalBatches: 1284,
  totalBatchesTrend: 8.4,
  mintedPacks: '2.48M',
  mintedPacksNumber: 2480000,
  mintedPacksTrend: 12.6,
  activeProducts: 84,
  activeProductsTrend: 3.2,
  verifiedPackages: '2.31M',
  verifiedPackagesNumber: 2310000,
  verificationRate: 98.4,
  recalledBatches: 3,
  recalledBatchesTrend: -1,
  pendingActions: 12,
  traceabilityHealth: 98.7,
  blockchainRecordsCount: '2,480,000',
  unresolvedAlertsCount: 4,
  recalledPacksCount: 1240,
  qrGeneratedCount: '2,480,000',
  downloadedPackagesCount: 1842,
  pendingExportsCount: 4,
};

export const mockBatches: Batch[] = [
  {
    id: 'BATCH-2026-001',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Paracetamol Tablets IP',
    genericName: 'Paracetamol',
    composition: 'Paracetamol 500mg',
    dosage: '500mg',
    strength: '500mg per tablet',
    form: 'Tablet',
    brandName: 'Calpol / Dolo Alternative',
    therapeuticCategory: 'Analgesic / Antipyretic',
    drugSchedule: 'OTC',
    pharmacopoeiaStandard: 'IP (Indian Pharmacopoeia)',
    route: 'Oral',
    coating: 'Uncoated',
    shelfLifeMonths: 24,
    storageConditions: 'Store below 25°C, protect from direct sunlight',
    productionAddress: 'Plot 104, Industrial Area, Baddi, HP 173205',
    manufacturingLicenseNo: 'CDSCO-MFG-DL-2024-88491',
    productionLineId: 'LINE-OSD-01',
    supervisorId: 'SUP-RAJESH-441',
    shiftCode: 'SHIFT-A',
    packType: 'PVC Blister',
    unitsPerCarton: 1000,
    cdscoApprovalNo: 'CDSCO-APP-2024-11029',
    gstin: '07AAACM1234F1Z8',
    hsn: '30049060',
    controlledSubstance: false,
    coldChainRequired: false,
    qaOfficerId: 'QA-OFFICER-SHARMA-01',
    qaApprovalDate: '2026-08-22',
    retestDate: '2028-02-20',
    coaReferenceNo: 'COA-2026-AUG-88491',
    microbialTestStatus: 'PASSED',
    dissolutionTestStatus: 'PASSED (>80% in 30 min)',
    assayResult: '99.9% Active Purity',
    tags: ['Analgesic', 'Antipyretic', 'OTC', 'Fast Mover'],
    manufacturingDate: '2026-08-22',
    expiryDate: '2028-08-21',
    totalQuantity: 100000,
    packsMinted: 100000,
    packSize: 10,
    mintStatus: 'MINTED',
    productionSite: 'Baddi Formulation Unit 1 (FAC-HP-01)',
    createdAt: '2026-08-22T08:30:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x8f19e42c8b09d11e4917a22830f89814ac89e1b272183c50974f14a8069e2c45',
    blockNumber: 18421
  },

  {
    id: 'BATCH-2026-002',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Amoxicillin & Potassium Clavulanate',
    genericName: 'Amoxicillin + Clavulanic Acid',
    composition: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    dosage: '625mg',
    strength: '625mg per film coated tablet',
    form: 'Tablet',
    manufacturingDate: '2026-08-20',
    expiryDate: '2028-08-19',
    totalQuantity: 50000,
    packsMinted: 50000,
    packSize: 6,
    mintStatus: 'PACKAGED',
    productionSite: 'Baddi Formulation Unit 1 (FAC-HP-01)',
    createdAt: '2026-08-20T11:15:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x7e28a55d491c920f8319e77102b48925bb90f2c381294d61085f25b9170f3d56',
    blockNumber: 18414
  },
  {
    id: 'BATCH-2026-003',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Azithromycin Tablets IP 500mg',
    genericName: 'Azithromycin',
    composition: 'Azithromycin Dihydrate eq. to Azithromycin anhydrous 500mg',
    dosage: '500mg',
    strength: '500mg per tablet',
    form: 'Tablet',
    manufacturingDate: '2026-08-18',
    expiryDate: '2028-08-17',
    totalQuantity: 75000,
    packsMinted: 75000,
    packSize: 3,
    mintStatus: 'DISTRIBUTED',
    productionSite: 'Sikkim Oral Solid Dosage Plant (FAC-SK-03)',
    createdAt: '2026-08-18T09:40:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x6d37b66c382a819e7208f66091a37814aa89e3b470183c50974f14a8069e1a23',
    blockNumber: 18398
  },
  {
    id: 'BATCH-2026-004',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Metformin Hydrochloride Prolonged-Release',
    genericName: 'Metformin HCl',
    composition: 'Metformin Hydrochloride IP 500mg (Prolonged-Release)',
    dosage: '500mg PR',
    strength: '500mg sustained release',
    form: 'Tablet',
    manufacturingDate: '2026-08-22',
    expiryDate: '2029-08-21',
    totalQuantity: 120000,
    packsMinted: 0,
    packSize: 10,
    mintStatus: 'MINTING',
    productionSite: 'Baddi Formulation Unit 1 (FAC-HP-01)',
    createdAt: '2026-08-22T14:10:00Z',
    qrPackageStatus: 'GENERATING',
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockNumber: 18423
  },
  {
    id: 'BATCH-2026-005',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Pantoprazole Gastro-Resistant Tablets',
    genericName: 'Pantoprazole Sodium',
    composition: 'Pantoprazole Sodium Sesquihydrate IP eq. to Pantoprazole 40mg',
    dosage: '40mg',
    strength: '40mg enteric coated',
    form: 'Tablet',
    manufacturingDate: '2026-08-22',
    expiryDate: '2028-08-21',
    totalQuantity: 80000,
    packsMinted: 0,
    packSize: 15,
    mintStatus: 'DRAFT',
    productionSite: 'Sikkim Oral Solid Dosage Plant (FAC-SK-03)',
    createdAt: '2026-08-22T15:00:00Z',
    qrPackageStatus: 'NOT_STARTED'
  },
  {
    id: 'BATCH-2026-041',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Amoxicillin Trihydrate 500mg',
    genericName: 'Amoxicillin',
    composition: 'Amoxicillin Trihydrate IP eq. to Amoxicillin 500mg',
    dosage: '500mg',
    strength: '500mg per capsule',
    form: 'Capsule',
    manufacturingDate: '2026-06-10',
    expiryDate: '2028-06-09',
    totalQuantity: 60000,
    packsMinted: 60000,
    packSize: 10,
    mintStatus: 'RECALLED',
    recallReason: 'Blister packaging seal integrity defect identified in QC audit (Lot 41-B).',
    recallDate: '2026-08-21T16:00:00Z',
    productionSite: 'Baddi Formulation Unit 1 (FAC-HP-01)',
    createdAt: '2026-06-10T10:00:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    blockNumber: 17912
  },
  {
    id: 'BATCH-2026-018',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Atorvastatin Calcium Tablets IP',
    genericName: 'Atorvastatin',
    composition: 'Atorvastatin Calcium IP eq. to Atorvastatin 20mg',
    dosage: '20mg',
    strength: '20mg per tablet',
    form: 'Tablet',
    manufacturingDate: '2026-05-14',
    expiryDate: '2028-05-13',
    totalQuantity: 45000,
    packsMinted: 45000,
    packSize: 10,
    mintStatus: 'RECALLED',
    recallReason: 'Dissolution profile failure at stability interval 3-Month check.',
    recallDate: '2026-08-15T12:00:00Z',
    productionSite: 'Sikkim Oral Solid Dosage Plant (FAC-SK-03)',
    createdAt: '2026-05-14T08:00:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e',
    blockNumber: 17402
  },
  {
    id: 'BATCH-2026-088',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Ceftriaxone Injection IP 1g',
    genericName: 'Ceftriaxone Sodium',
    composition: 'Sterile Ceftriaxone Sodium IP eq. to anhydrous Ceftriaxone 1000mg',
    dosage: '1g Vial',
    strength: '1g sterile powder with WFI',
    form: 'Injection',
    manufacturingDate: '2026-04-02',
    expiryDate: '2028-04-01',
    totalQuantity: 30000,
    packsMinted: 30000,
    packSize: 1,
    mintStatus: 'RECALLED',
    recallReason: 'Particulate matter detected in glass vial supplier lot GV-991.',
    recallDate: '2026-08-01T10:30:00Z',
    productionSite: 'Hyderabad Sterile Injectables Hub (FAC-HYD-02)',
    createdAt: '2026-04-02T11:00:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    blockNumber: 16890
  },
  {
    id: 'BATCH-2026-012',
    manufacturerId: 'MFR_MEDCORE_001',
    medicineName: 'Telmisartan Tablets IP 40mg',
    genericName: 'Telmisartan',
    composition: 'Telmisartan IP 40mg',
    dosage: '40mg',
    strength: '40mg uncoated tablet',
    form: 'Tablet',
    manufacturingDate: '2026-07-28',
    expiryDate: '2028-07-27',
    totalQuantity: 90000,
    packsMinted: 90000,
    packSize: 10,
    mintStatus: 'DISTRIBUTED',
    productionSite: 'Baddi Formulation Unit 1 (FAC-HP-01)',
    createdAt: '2026-07-28T09:00:00Z',
    qrPackageStatus: 'READY',
    txHash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    blockNumber: 18120
  }
];

export const mockRecalls: RecallRecord[] = [
  {
    id: 'REC-2026-001',
    batchId: 'BATCH-2026-041',
    medicineName: 'Amoxicillin Trihydrate 500mg',
    dosage: '500mg (10 Caps)',
    reason: 'Packaging Defect: Blister heat-seal micro-pinhole discovered during QA retention sample testing.',
    date: '2026-08-21T16:00:00Z',
    affectedPacks: 4820,
    status: 'ACTIVE',
    initiatedBy: 'Dr. Rajesh Sharma (Head QA)',
    severity: 'CRITICAL',
    quarantineActionsTaken: [
      'Fabric Ledger :RECALL state appended at block #17912',
      'Instant lock enforced on 18 pharmacy POS terminals',
      'Automated CDSCO Regulatory Recall Notification filed (Form 28-A)',
      'Supply chain warehouse quarantine order issued'
    ]
  },
  {
    id: 'REC-2026-002',
    batchId: 'BATCH-2026-018',
    medicineName: 'Atorvastatin Calcium Tablets IP',
    dosage: '20mg (10 Tabs)',
    reason: 'Dissolution profile failure at 3-Month accelerated stability test.',
    date: '2026-08-15T12:00:00Z',
    affectedPacks: 5210,
    status: 'ACTIVE',
    initiatedBy: 'Dr. Rajesh Sharma (Head QA)',
    severity: 'MAJOR',
    quarantineActionsTaken: [
      'Fabric Ledger :RECALL state appended at block #17402',
      'Distributor recall notice broadcast to 42 stockists',
      '92% physical units retrieved to central warehouse'
    ]
  },
  {
    id: 'REC-2026-003',
    batchId: 'BATCH-2026-088',
    medicineName: 'Ceftriaxone Injection IP 1g',
    dosage: '1g Sterile Vial',
    reason: 'Sub-visible particulate matter anomaly detected in vendor vial batch #GV-991.',
    date: '2026-08-01T10:30:00Z',
    affectedPacks: 2420,
    status: 'ACTIVE',
    initiatedBy: 'Vikram Mehta (Compliance Officer)',
    severity: 'CRITICAL',
    quarantineActionsTaken: [
      'Fabric Ledger :RECALL state appended at block #16890',
      'Hospital direct recall advisory issued to 14 medical institutions',
      'Quarantine reconciliation 100% complete'
    ]
  }
];

export const mockExpiryItems: ExpiryMonitoringItem[] = [
  {
    id: 'EXP-001',
    batchId: 'BATCH-2024-092',
    medicineName: 'Ciprofloxacin Eye Drops 0.3%',
    dosage: '5ml Sterile Drops',
    manufacturingDate: '2024-09-10',
    expiryDate: '2026-09-09',
    daysRemaining: 18,
    quantity: 4500,
    risk: 'CRITICAL_30',
    status: 'QUARANTINE_REQUIRED'
  },
  {
    id: 'EXP-002',
    batchId: 'BATCH-2024-098',
    medicineName: 'Amoxicillin Oral Suspension 125mg/5ml',
    dosage: '60ml Dry Syrup',
    manufacturingDate: '2024-09-20',
    expiryDate: '2026-09-19',
    daysRemaining: 28,
    quantity: 7800,
    risk: 'CRITICAL_30',
    status: 'PRIORITY_DISPATCH'
  },
  {
    id: 'EXP-003',
    batchId: 'BATCH-2024-110',
    medicineName: 'Omeprazole Capsules IP 20mg',
    dosage: '20mg (15 Caps)',
    manufacturingDate: '2024-10-15',
    expiryDate: '2026-10-14',
    daysRemaining: 53,
    quantity: 18400,
    risk: 'WARNING_60',
    status: 'PRIORITY_DISPATCH'
  },
  {
    id: 'EXP-004',
    batchId: 'BATCH-2024-115',
    medicineName: 'Cetirizine Hydrochloride Tablets 10mg',
    dosage: '10mg (10 Tabs)',
    manufacturingDate: '2024-11-01',
    expiryDate: '2026-10-31',
    daysRemaining: 70,
    quantity: 34000,
    risk: 'MONITOR_90',
    status: 'NORMAL'
  },
  {
    id: 'EXP-005',
    batchId: 'BATCH-2024-080',
    medicineName: 'Ranitidine Injection 25mg/ml',
    dosage: '2ml Ampoule',
    manufacturingDate: '2024-08-01',
    expiryDate: '2026-07-31',
    daysRemaining: -22,
    quantity: 1200,
    risk: 'EXPIRED',
    status: 'QUARANTINE_REQUIRED'
  }
];

export const mockQualityAlerts: QualityAlert[] = [
  {
    id: 'ALT-101',
    title: 'Suspicious Verification Spike in Delhi NCR',
    description: '14 consumer verification scans recorded within 3 minutes for identical pack token serial #00042 at Karol Bagh. Potential barcode cloning detected.',
    type: 'CRITICAL',
    timestamp: '25 mins ago',
    batchId: 'BATCH-2026-001',
    packHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    resolved: false,
    category: 'COUNTERFEIT_SCAN',
    location: 'Karol Bagh, New Delhi (Lat: 28.651, Lon: 77.190)',
    reporter: 'Consumer Mobile App Incident Router'
  },
  {
    id: 'ALT-102',
    title: '3 Packs Failed Cryptographic Signature Check',
    description: 'POS intake scanner at Apollo Chemist Mumbai rejected 3 packs with invalid ES256 key signature. Pack rejected before pharmacy inventory entry.',
    type: 'CRITICAL',
    timestamp: '1 hour ago',
    batchId: 'BATCH-2026-003',
    resolved: false,
    category: 'COUNTERFEIT_SCAN',
    location: 'Andheri West, Mumbai',
    reporter: 'Shopkeeper POS Terminal #409'
  },
  {
    id: 'ALT-103',
    title: 'CDSCO Manufacturing License Renewal Due in 45 Days',
    description: 'Central Drugs Standard Control Organization Form 28-D manufacturing license (CDSCO-MFG-DL-2024-88491) expires on 05 Oct 2026. Renewal dossier required.',
    type: 'WARNING',
    timestamp: '3 hours ago',
    resolved: false,
    category: 'LICENSE_EXPIRY'
  },
  {
    id: 'ALT-104',
    title: 'Batch BATCH-2026-001 Successfully Minted',
    description: '100,000 packs signed with ES256 key mfr-key-medcore-001 and committed to Hyperledger Fabric block #18421.',
    type: 'SUCCESS',
    timestamp: 'Today, 08:31 AM',
    batchId: 'BATCH-2026-001',
    resolved: true,
    category: 'MINTING_STATUS'
  }
];

export const mockTopProducts: TopProductMetric[] = [
  {
    id: 'PROD-01',
    medicineName: 'Paracetamol Tablets IP 500mg',
    dosage: '500mg Strip of 10',
    batchesCount: 42,
    packsCount: 480000,
    productionVelocity: 'High',
    status: 'Active',
    revenueShare: 32
  },
  {
    id: 'PROD-02',
    medicineName: 'Amoxicillin & Clavulanate 625mg',
    dosage: '625mg Strip of 6',
    batchesCount: 24,
    packsCount: 220000,
    productionVelocity: 'High',
    status: 'Active',
    revenueShare: 24
  },
  {
    id: 'PROD-03',
    medicineName: 'Azithromycin Tablets 500mg',
    dosage: '500mg Strip of 3',
    batchesCount: 18,
    packsCount: 185000,
    productionVelocity: 'Medium',
    status: 'Active',
    revenueShare: 16
  },
  {
    id: 'PROD-04',
    medicineName: 'Pantoprazole Gastro-Resistant 40mg',
    dosage: '40mg Strip of 15',
    batchesCount: 15,
    packsCount: 140000,
    productionVelocity: 'Medium',
    status: 'Active',
    revenueShare: 14
  },
  {
    id: 'PROD-05',
    medicineName: 'Metformin PR 500mg',
    dosage: '500mg Strip of 10',
    batchesCount: 12,
    packsCount: 110000,
    productionVelocity: 'Steady',
    status: 'Active',
    revenueShare: 9
  }
];

export const mockOrders: B2BOrder[] = [
  {
    id: 'ORD-2026-9401',
    orderNumber: 'PO-APOLLO-8812',
    pharmacyName: 'Apollo Pharmacy Ltd. (North Hub)',
    pharmacyLicense: 'DL-DL-2021-99820',
    shippingAddress: 'Central Logistics Park, Kundli, Sonipat, Haryana 131028',
    items: [
      { medicineName: 'Paracetamol 500mg', dosage: '500mg', quantity: 20000, batchId: 'BATCH-2026-001', unitPrice: 18.5 },
      { medicineName: 'Amoxicillin 625mg', dosage: '625mg', quantity: 10000, batchId: 'BATCH-2026-002', unitPrice: 120.0 }
    ],
    totalQuantity: 30000,
    totalAmount: 1570000,
    status: 'SHIPPED',
    orderDate: '2026-08-21',
    expectedDeliveryDate: '2026-08-24',
    trackingNumber: 'TRK-BLUEDART-8941029',
    dispatchedAt: '2026-08-22T06:00:00Z'
  },
  {
    id: 'ORD-2026-9402',
    orderNumber: 'PO-NETMEDS-4011',
    pharmacyName: 'Netmeds Marketplace DC Chennai',
    pharmacyLicense: 'DL-TN-2022-77119',
    shippingAddress: 'Plot 18, Sriperumbudur Industrial Corridor, Chennai 602105',
    items: [
      { medicineName: 'Azithromycin 500mg', dosage: '500mg', quantity: 15000, batchId: 'BATCH-2026-003', unitPrice: 85.0 }
    ],
    totalQuantity: 15000,
    totalAmount: 1275000,
    status: 'PROCESSING',
    orderDate: '2026-08-22',
    expectedDeliveryDate: '2026-08-25'
  },
  {
    id: 'ORD-2026-9403',
    orderNumber: 'PO-MEDPLUS-3108',
    pharmacyName: 'MedPlus Health Services Hyderabad',
    pharmacyLicense: 'DL-TG-2020-55410',
    shippingAddress: 'Nacharam Industrial Area, Hyderabad 500076',
    items: [
      { medicineName: 'Paracetamol 500mg', dosage: '500mg', quantity: 40000, batchId: 'BATCH-2026-001', unitPrice: 18.5 },
      { medicineName: 'Telmisartan 40mg', dosage: '40mg', quantity: 12000, batchId: 'BATCH-2026-012', unitPrice: 42.0 }
    ],
    totalQuantity: 52000,
    totalAmount: 1244000,
    status: 'PENDING',
    orderDate: '2026-08-22',
    expectedDeliveryDate: '2026-08-26'
  },
  {
    id: 'ORD-2026-9390',
    orderNumber: 'PO-WELLNESS-1994',
    pharmacyName: 'Wellness Forever Mumbai Hub',
    pharmacyLicense: 'DL-MH-2019-33109',
    shippingAddress: 'Bhiwandi Warehousing Zone, Thane 421302',
    items: [
      { medicineName: 'Amoxicillin 625mg', dosage: '625mg', quantity: 8000, batchId: 'BATCH-2026-002', unitPrice: 120.0 }
    ],
    totalQuantity: 8000,
    totalAmount: 960000,
    status: 'DELIVERED',
    orderDate: '2026-08-17',
    expectedDeliveryDate: '2026-08-20',
    trackingNumber: 'TRK-DELHIVERY-774129',
    dispatchedAt: '2026-08-18T10:00:00Z'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'INV-01',
    sku: 'MED-PCM-500-TAB',
    medicineName: 'Paracetamol Tablets IP 500mg',
    genericName: 'Paracetamol',
    form: 'Tablet',
    strength: '500mg',
    activeBatchesCount: 4,
    totalPacks: 480000,
    lowStockThreshold: 50000,
    status: 'HEALTHY',
    unitPrice: 18.5,
    category: 'Analgesics'
  },
  {
    id: 'INV-02',
    sku: 'MED-AMX-625-TAB',
    medicineName: 'Amoxicillin & Potassium Clavulanate 625mg',
    genericName: 'Amoxicillin + Clavulanic Acid',
    form: 'Tablet',
    strength: '625mg',
    activeBatchesCount: 3,
    totalPacks: 220000,
    lowStockThreshold: 40000,
    status: 'HEALTHY',
    unitPrice: 120.0,
    category: 'Antibiotics'
  },
  {
    id: 'INV-03',
    sku: 'MED-AZI-500-TAB',
    medicineName: 'Azithromycin Tablets IP 500mg',
    genericName: 'Azithromycin',
    form: 'Tablet',
    strength: '500mg',
    activeBatchesCount: 2,
    totalPacks: 185000,
    lowStockThreshold: 30000,
    status: 'HEALTHY',
    unitPrice: 85.0,
    category: 'Antibiotics'
  },
  {
    id: 'INV-04',
    sku: 'MED-MET-500-PR',
    medicineName: 'Metformin Hydrochloride PR 500mg',
    genericName: 'Metformin HCl',
    form: 'Tablet',
    strength: '500mg PR',
    activeBatchesCount: 2,
    totalPacks: 110000,
    lowStockThreshold: 25000,
    status: 'HEALTHY',
    unitPrice: 32.0,
    category: 'Antidiabetic'
  },
  {
    id: 'INV-05',
    sku: 'MED-PAN-40-EC',
    medicineName: 'Pantoprazole Gastro-Resistant 40mg',
    genericName: 'Pantoprazole Sodium',
    form: 'Tablet',
    strength: '40mg',
    activeBatchesCount: 2,
    totalPacks: 140000,
    lowStockThreshold: 35000,
    status: 'HEALTHY',
    unitPrice: 75.0,
    category: 'Gastrointestinal'
  },
  {
    id: 'INV-06',
    sku: 'MED-AMX-500-CAP',
    medicineName: 'Amoxicillin Trihydrate 500mg',
    genericName: 'Amoxicillin',
    form: 'Capsule',
    strength: '500mg',
    activeBatchesCount: 0,
    totalPacks: 0,
    lowStockThreshold: 20000,
    status: 'RECALLED',
    unitPrice: 65.0,
    category: 'Antibiotics'
  },
  {
    id: 'INV-07',
    sku: 'MED-TEL-40-TAB',
    medicineName: 'Telmisartan Tablets IP 40mg',
    genericName: 'Telmisartan',
    form: 'Tablet',
    strength: '40mg',
    activeBatchesCount: 2,
    totalPacks: 18000,
    lowStockThreshold: 25000,
    status: 'LOW_STOCK',
    unitPrice: 42.0,
    category: 'Cardiovascular'
  }
];

export const mockLedgerTransitions: TransitionRecord[] = [
  {
    docType: 'transition',
    hash: 'a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:MFG',
    fromId: 'MINTED',
    toId: 'MFR_MEDCORE_001',
    sellingDate: '22082026',
    sellingTime: '08:30:14',
    sellerId: 'OP_PLANT_MGR_401',
    blockNumber: 18421,
    txId: 'tx_8f19e42c8b09d11e4917a22830f89814ac89e1b2',
    timestamp: '2026-08-22T08:30:14Z',
    rawPayload: {
      batchId: 'BATCH-2026-001',
      serialRange: '00001 - 100000',
      facility: 'FAC-HP-01',
      keyId: 'mfr-key-medcore-001'
    }
  },
  {
    docType: 'transition',
    hash: 'a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:INTAKE',
    fromId: 'MFR_MEDCORE_001',
    toId: 'SHOP_APOLLO_NORTH_01',
    sellingDate: '22082026',
    sellingTime: '11:45:00',
    sellerId: 'OP_APOLLO_CHEM_12',
    blockNumber: 18422,
    txId: 'tx_34b11f09823a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
    timestamp: '2026-08-22T11:45:00Z',
    rawPayload: {
      shopName: 'Apollo Pharmacy Ltd.',
      drugLicense: 'DL-DL-2021-99820',
      stockIntakeQty: 20000
    }
  },
  {
    docType: 'transition',
    hash: 'a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:SALE',
    fromId: 'SHOP_APOLLO_NORTH_01',
    toId: 'CONSUMER',
    sellingDate: '22082026',
    sellingTime: '14:20:10',
    sellerId: 'POS_TERMINAL_04',
    blockNumber: 18423,
    txId: 'tx_7e28a55d491c920f8319e77102b48925bb90f2c3',
    timestamp: '2026-08-22T14:20:10Z',
    rawPayload: {
      packSerial: '00042',
      invoiceNo: 'INV-AP-88410',
      patientVerified: true
    }
  },
  {
    docType: 'transition',
    hash: 'BATCH-2026-041:RECALL',
    fromId: 'MFR_MEDCORE_001',
    toId: 'RECALLED',
    sellingDate: '21082026',
    sellingTime: '16:00:00',
    sellerId: 'QA_DIR_SHARMA',
    blockNumber: 17912,
    txId: 'tx_99a77c1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    timestamp: '2026-08-21T16:00:00Z',
    rawPayload: {
      batchId: 'BATCH-2026-041',
      reason: 'Blister packaging seal integrity defect',
      scope: 'GLOBAL_BATCH_LOCK'
    }
  }
];

export const mockSamplePacks: Pack[] = [
  {
    id: 'PACK-00042',
    batchId: 'BATCH-2026-001',
    serialNumber: '00042',
    packHash: 'a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91',
    signedToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1mci1rZXktbWVkY29yZS0wMDEifQ.eyJiYXRjaElkIjoiQkFUQ0gtMjAyNi0wMDEiLCJzZXJpYWwiOiIwMDA0MiIsImV4cGlyeURhdGUiOiIyMDI4LTA4LTIxIiwibWFudWZhY3R1cmVySWQiOiJNRlJfTUVEQ09SRV8wMDEifQ.MEQCIBk...',
    status: 'SOLD',
    currentHolder: 'Consumer (Sold by Apollo Pharmacy)',
    lastEventDate: '2026-08-22 14:20:10',
    intakeShopName: 'Apollo Pharmacy Ltd.',
    saleDate: '2026-08-22'
  },
  {
    id: 'PACK-00043',
    batchId: 'BATCH-2026-001',
    serialNumber: '00043',
    packHash: 'b7e3d820129a01f12653728101e7d8091a37814aa89e3b470183c50974f14a80',
    signedToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1mci1rZXktbWVkY29yZS0wMDEifQ.eyJiYXRjaElkIjoiQkFUQ0gtMjAyNi0wMDEiLCJzZXJpYWwiOiIwMDA0MyIsImV4cGlyeURhdGUiOiIyMDI4LTA4LTIxIiwibWFudWZhY3R1cmVySWQiOiJNRlJfTUVEQ09SRV8wMDEifQ.MEUCIFz...',
    status: 'AT_SHOP',
    currentHolder: 'Apollo Pharmacy Ltd. (North Hub)',
    lastEventDate: '2026-08-22 11:45:00',
    intakeShopName: 'Apollo Pharmacy Ltd.'
  },
  {
    id: 'PACK-00044',
    batchId: 'BATCH-2026-001',
    serialNumber: '00044',
    packHash: 'c6d2e730129b01e33764839201f8e9102b48925bb90f2c381294d61085f25b93',
    signedToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1mci1rZXktbWVkY29yZS0wMDEifQ.eyJiYXRjaElkIjoiQkFUQ0gtMjAyNi0wMDEiLCJzZXJpYWwiOiIwMDA0NCIsImV4cGlyeURhdGUiOiIyMDI4LTA4LTIxIiwibWFudWZhY3R1cmVySWQiOiJNRlJfTUVEQ09SRV8wMDEifQ.MEQCIDx...',
    status: 'PACKAGED',
    currentHolder: 'MedCore Central Warehouse Baddi',
    lastEventDate: '2026-08-22 08:30:14'
  },
  {
    id: 'PACK-REC-001',
    batchId: 'BATCH-2026-041',
    serialNumber: '00109',
    packHash: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2',
    signedToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1mci1rZXktbWVkY29yZS0wMDEifQ.eyJiYXRjaElkIjoiQkFUQ0gtMjAyNi0wNDEiLCJzZXJpYWwiOiIwMDEwOSIsImV4cGlyeURhdGUiOiIyMDI4LTA2LTA5IiwibWFudWZhY3R1cmVySWQiOiJNRlJfTUVEQ09SRV8wMDEifQ.MEUCIQD...',
    status: 'RECALLED',
    currentHolder: 'Quarantined Supply Chain Unit',
    lastEventDate: '2026-08-21 16:00:00'
  }
];

export const mockProductionAnalyticsData = {
  '7D': [
    { name: 'Mon', batches: 4, packsMinted: 120000, packsDistributed: 95000 },
    { name: 'Tue', batches: 6, packsMinted: 180000, packsDistributed: 140000 },
    { name: 'Wed', batches: 5, packsMinted: 150000, packsDistributed: 160000 },
    { name: 'Thu', batches: 8, packsMinted: 240000, packsDistributed: 210000 },
    { name: 'Fri', batches: 7, packsMinted: 210000, packsDistributed: 190000 },
    { name: 'Sat', batches: 3, packsMinted: 90000, packsDistributed: 80000 },
    { name: 'Sun', batches: 2, packsMinted: 60000, packsDistributed: 40000 },
  ],
  '30D': [
    { name: 'Week 1', batches: 32, packsMinted: 620000, packsDistributed: 540000 },
    { name: 'Week 2', batches: 38, packsMinted: 740000, packsDistributed: 690000 },
    { name: 'Week 3', batches: 41, packsMinted: 810000, packsDistributed: 750000 },
    { name: 'Week 4', batches: 45, packsMinted: 880000, packsDistributed: 820000 },
  ],
  '90D': [
    { name: 'Jun', batches: 135, packsMinted: 2400000, packsDistributed: 2150000 },
    { name: 'Jul', batches: 148, packsMinted: 2750000, packsDistributed: 2500000 },
    { name: 'Aug', batches: 162, packsMinted: 3100000, packsDistributed: 2890000 },
  ],
  '1Y': [
    { name: 'Jan', batches: 95, packsMinted: 1650000, packsDistributed: 1420000 },
    { name: 'Feb', batches: 110, packsMinted: 1900000, packsDistributed: 1750000 },
    { name: 'Mar', batches: 128, packsMinted: 2200000, packsDistributed: 2010000 },
    { name: 'Apr', batches: 132, packsMinted: 2350000, packsDistributed: 2180000 },
    { name: 'May', batches: 140, packsMinted: 2500000, packsDistributed: 2340000 },
    { name: 'Jun', batches: 145, packsMinted: 2600000, packsDistributed: 2410000 },
    { name: 'Jul', batches: 152, packsMinted: 2780000, packsDistributed: 2590000 },
    { name: 'Aug', batches: 162, packsMinted: 3100000, packsDistributed: 2890000 },
  ]
};

export const mockBatchStatusDistribution = [
  { name: 'Minted', value: 64, color: '#10b981', count: 821 },
  { name: 'Packaged', value: 18, color: '#0ea5e9', count: 231 },
  { name: 'Distributed', value: 14, color: '#3b82f6', count: 180 },
  { name: 'Pending / Draft', value: 3, color: '#f59e0b', count: 39 },
  { name: 'Recalled', value: 1, color: '#ef4444', count: 13 },
];

export const mockActivityTimeline = [
  {
    id: 'ACT-01',
    title: 'Batch BATCH-2026-001 Minted & Endorsed',
    description: '100,000 packs signed with ES256 and committed to Fabric Block #18421',
    timestamp: '10 minutes ago',
    type: 'SUCCESS',
    badge: 'MINTED'
  },
  {
    id: 'ACT-02',
    title: '100,000 QR Codes Generated & Bundled',
    description: 'Print-ready high-density QR payload ZIP archive generated for Baddi Plant',
    timestamp: '25 minutes ago',
    type: 'INFO',
    badge: 'QR READY'
  },
  {
    id: 'ACT-03',
    title: 'Recall Cascade Executed for BATCH-2026-041',
    description: 'Global immutable state key written to ledger. 18 POS terminals notified',
    timestamp: '1 hour ago',
    type: 'CRITICAL',
    badge: 'RECALL'
  },
  {
    id: 'ACT-04',
    title: 'Shipment PO-APOLLO-8812 Dispatched',
    description: '30,000 units dispatched via BlueDart Express (TRK-BLUEDART-8941029)',
    timestamp: '2 hours ago',
    type: 'SUCCESS',
    badge: 'SHIPPED'
  },
  {
    id: 'ACT-05',
    title: 'CDSCO Regulatory Audit Log Synced',
    description: 'Monthly electronic provenance report hash anchored to Ethereum testnet checkpoint',
    timestamp: '5 hours ago',
    type: 'INFO',
    badge: 'AUDIT'
  }
];
