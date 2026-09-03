import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, ShieldAlert, BookmarkCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verifyMedicineQR } from '../src/services/api/verify.api';
import { useCustomerStore } from '../src/store/customerStore';
import { VerificationResult, SavedMedicine } from '../src/types';

export default function ScanResultScreen() {
  const router = useRouter();
  const { status, qrData } = useLocalSearchParams<{ status?: string; qrData?: string }>();
  const insets = useSafeAreaInsets();
  const { addSavedMedicine } = useCustomerStore();

  const [loading, setLoading] = useState(Boolean(qrData));
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (qrData) {
      setLoading(true);
      verifyMedicineQR(qrData)
        .then((res) => {
          setResult(res);
        })
        .catch((err) => {
          console.error('Scan verification error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [qrData]);

  const isRecentlySold = result?.uiState === 'PURCHASED_RECENTLY' || Boolean(result?.isRecentlySold);
  const isPreviouslySold = result?.uiState === 'ALREADY_SOLD';
  const isAtShop = result?.uiState === 'AT_SHOP';
  const isGenuine = result?.uiState === 'GENUINE';
  const isRecalled = result?.uiState === 'RECALLED';
  const isExpired = result?.uiState === 'EXPIRED';
  const isCounterfeit = result?.uiState === 'COUNTERFEIT';

  const isAuthentic = result
    ? isGenuine || isRecentlySold || isAtShop || result.status === 'AUTHENTIC'
    : status === 'authentic' || status === 'verified';

  // Even if sold previously (> 2 days), the medicine specification and batch details are valid and should be visible
  const hasValidMetadata = isAuthentic || isPreviouslySold;
  const trustScore = result?.risk?.score ?? (isAuthentic ? 98 : isPreviouslySold ? 60 : 0);

  const medicineName = result?.pack?.medicineName || (qrData ? 'Verified Formulation' : 'No Active Scan');
  const manufacturerName = result?.manufacturer?.name || (qrData ? 'Verified Facility' : 'Unknown Manufacturer');
  const batchNumber = result?.pack?.batchId || (qrData ? 'BATCH-SCAN' : 'N/A');
  const mfgDate = result?.pack?.manufacturingDate || 'N/A';
  const expiryDate = result?.pack?.expiryDate || 'N/A';
  const packId = result?.pack?.packId || result?.packHash || qrData || 'N/A';
  const dispensingShop = result?.dispensingShop;

  const handleSaveToCabinet = () => {
    const med: SavedMedicine = {
      id: `med-${Date.now()}`,
      name: medicineName,
      genericName: result?.pack?.genericName || result?.payload?.genericName || medicineName,
      brandName: result?.pack?.brandName,
      dosage: result?.pack?.dosage || 'Standard Formulation',
      composition: result?.pack?.composition,
      drugSchedule: result?.pack?.drugSchedule,
      storageCondition: result?.pack?.storageCondition,
      productionSite: result?.manufacturer?.productionSite,
      batchNumber,
      manufacturer: manufacturerName,
      mfgDate,
      expiryDate,
      daysToExpiry: 365,
      status: isAuthentic ? 'Verified' : 'Needs Attention',
      packId,
      category: result?.pack?.drugSchedule ? `Schedule ${result.pack.drugSchedule}` : 'General Care',
      verifiedAt: 'Just now',
      safetyScore: trustScore,
    };
    addSavedMedicine(med);
    setSaved(true);
  };

  const getStatusCardBg = () => {
    if (isGenuine) return '#10b981';
    if (isRecentlySold) return '#059669';
    if (isAtShop) return '#2563eb';
    if (isPreviouslySold) return '#d97706';
    if (isRecalled) return '#dc2626';
    if (isExpired) return '#e11d48';
    if (isCounterfeit) return '#991b1b';
    return isAuthentic ? '#10b981' : '#f97316';
  };

  const getStatusTitle = () => {
    if (isGenuine) return '100% Genuine Medicine';
    if (isRecentlySold) return 'Verified — Recently Purchased';
    if (isAtShop) return 'Verified at Pharmacy';
    if (isPreviouslySold) return 'Notice: Dispensed Previously';
    if (isRecalled) return 'CRITICAL: Batch Recalled';
    if (isExpired) return 'Medicine Expired';
    if (isCounterfeit) return 'Counterfeit Warning';
    return isAuthentic ? 'Authentic Medicine' : 'Suspicious / Unverified';
  };

  const renderStatusIcon = () => {
    if (isGenuine || isRecentlySold) return <CheckCircle2 size={44} color="#fff" />;
    if (isAtShop) return <ShieldCheck size={44} color="#fff" />;
    if (isPreviouslySold || isExpired) return <AlertTriangle size={44} color="#fff" />;
    if (isCounterfeit || isRecalled) return <ShieldAlert size={44} color="#fff" />;
    return isAuthentic ? <CheckCircle2 size={44} color="#fff" /> : <AlertTriangle size={44} color="#fff" />;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#3b00b9" />
        <Text style={styles.loadingTitle}>Verifying Cryptographic Ledger...</Text>
        <Text style={styles.loadingSubtitle}>Checking ES256 Signature & Hyperledger State</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Verification</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: getStatusCardBg() }]}>
          <View style={styles.statusHeader}>
            {renderStatusIcon()}
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>{getStatusTitle()}</Text>
              <Text style={styles.statusDesc}>
                {result?.message ||
                  (isAuthentic
                    ? 'Cryptographically verified on Hyperledger Fabric. Safe for consumption.'
                    : 'Digital signature mismatch or invalid batch records detected.')}
              </Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Fabric Trust Score</Text>
            <Text style={styles.scoreValue}>{trustScore}/100</Text>
          </View>
        </View>

        {/* Dispensing Pharmacy & Provenance Card */}
        {(dispensingShop || result?.shop?.name) && (
          <View style={styles.provenanceCard}>
            <View style={styles.provenanceHeader}>
              <Text style={styles.provenanceHeaderTitle}>Dispensing Pharmacy & Purchase Info</Text>
            </View>

            <View style={styles.provenanceRow}>
              <Text style={styles.provenanceLabel}>Pharmacy</Text>
              <Text style={styles.provenanceValue}>
                {dispensingShop?.name || result?.shop?.name || 'Registered CDSCO Pharmacy'}
              </Text>
            </View>

            {(dispensingShop?.licenseNumber || result?.shop?.licenseNumber) ? (
              <View style={styles.provenanceRow}>
                <Text style={styles.provenanceLabel}>CDSCO License</Text>
                <Text style={[styles.provenanceValue, { color: '#0369a1', fontWeight: '700' }]}>
                  {dispensingShop?.licenseNumber || result?.shop?.licenseNumber}
                </Text>
              </View>
            ) : null}

            {(dispensingShop?.formattedSaleTime || result?.transaction?.saleTime) ? (
              <View style={styles.provenanceRow}>
                <Text style={styles.provenanceLabel}>Dispense Time</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.provenanceValue}>
                    {dispensingShop?.formattedSaleTime || result?.transaction?.saleTime}
                  </Text>
                  {dispensingShop?.relativeSaleTime && (
                    <Text style={styles.relativeTimeBadge}>
                      {dispensingShop.relativeSaleTime}
                    </Text>
                  )}
                </View>
              </View>
            ) : null}

            {(dispensingShop?.address || dispensingShop?.location || result?.transaction?.location) ? (
              <View style={styles.provenanceRow}>
                <Text style={styles.provenanceLabel}>Location / GPS</Text>
                <Text style={[styles.provenanceValue, { fontSize: 13, color: '#047857' }]}>
                  {dispensingShop?.address || dispensingShop?.location || result?.transaction?.location}
                </Text>
              </View>
            ) : null}

            {/* Contextual Guidance Box */}
            {isRecentlySold ? (
              <View style={styles.guidanceBoxSuccess}>
                <Text style={styles.guidanceTitleSuccess}>✓ Recent Purchase Verified</Text>
                <Text style={styles.guidanceTextSuccess}>
                  This medicine was dispensed from this verified pharmacy within the last 48 hours. If you just bought this medicine from this pharmacy, it is 100% genuine and your purchase was recorded on the blockchain.
                </Text>
              </View>
            ) : isPreviouslySold ? (
              <View style={styles.guidanceBoxWarning}>
                <Text style={styles.guidanceTitleWarning}>⚖️ Buyer Verification Advisory</Text>
                <Text style={styles.guidanceTextWarning}>
                  • Checking Your Personal Medicine? If you previously purchased this medicine from this pharmacy and are checking it in your home cabinet, this is genuine and matches your purchase history.
                </Text>
                <Text style={[styles.guidanceTextWarning, { marginTop: 6 }]}>
                  • Buying New in a Shop Now? If a store is attempting to sell you this pack today as brand-new stock, do not accept it — this pack was already sold on {dispensingShop?.formattedSaleTime || 'a prior date'} and could be a refilled duplicate clone.
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Medicine Details */}
        {hasValidMetadata ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicine Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Medicine</Text>
              <Text style={styles.detailValue}>{medicineName}</Text>
            </View>
            {result?.pack?.genericName && result?.pack?.genericName !== medicineName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Generic Name</Text>
                <Text style={styles.detailValue}>{result.pack.genericName}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Manufacturer</Text>
              <Text style={styles.detailValue}>{manufacturerName}</Text>
            </View>
            {result?.manufacturer?.productionSite && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Facility</Text>
                <Text style={styles.detailValue}>{result.manufacturer.productionSite}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch No.</Text>
              <Text style={styles.detailValue}>{batchNumber}</Text>
            </View>
            {result?.pack?.dosage && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dosage</Text>
                <Text style={styles.detailValue}>{result.pack.dosage}</Text>
              </View>
            )}
            {result?.pack?.composition && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Composition</Text>
                <Text style={[styles.detailValue, { fontSize: 12 }]}>{result.pack.composition}</Text>
              </View>
            )}
            {result?.pack?.drugSchedule && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Schedule</Text>
                <Text style={[styles.detailValue, { color: '#0369a1', fontWeight: '700' }]}>
                  Schedule {result.pack.drugSchedule}
                </Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mfg. Date</Text>
              <Text style={styles.detailValue}>{mfgDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{expiryDate}</Text>
            </View>
            {result?.pack?.storageCondition && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Storage</Text>
                <Text style={[styles.detailValue, { fontSize: 12 }]}>{result.pack.storageCondition}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pack ID / Hash</Text>
              <Text style={[styles.detailValue, { fontFamily: 'monospace', fontSize: 13 }]}>
                {packId.length > 16 ? `${packId.substring(0, 10)}...${packId.substring(packId.length - 6)}` : packId}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionBtnOutline, saved && { backgroundColor: '#ecfdf5' }]}
              onPress={handleSaveToCabinet}
              disabled={saved}
            >
              <Text style={styles.actionBtnOutlineText}>
                {saved ? '✓ Saved in My Medicine Cabinet' : 'Save to Medicine Cabinet'}
              </Text>
            </TouchableOpacity>

            {isPreviouslySold && (
              <TouchableOpacity
                style={[styles.actionBtnOutline, { borderColor: '#f97316', marginTop: 12 }]}
                onPress={() =>
                  router.push({
                    pathname: '/report',
                    params: { qrToken: qrData || packId, medicineName },
                  })
                }
              >
                <Text style={[styles.actionBtnOutlineText, { color: '#ea580c' }]}>
                  Report Suspicious Resale to CDSCO
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Indicators</Text>

            <View style={styles.riskItem}>
              <AlertTriangle size={20} color="#dc2626" style={styles.riskIcon} />
              <Text style={styles.riskText}>
                {result?.message || 'Cryptographic ES256 signature verification failed or pack state unverified.'}
              </Text>
            </View>
            <View style={styles.riskItem}>
              <AlertTriangle size={20} color="#dc2626" style={styles.riskIcon} />
              <Text style={styles.riskText}>Possible counterfeit packaging, altered QR label, or unauthorized distribution channel.</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recommended Action</Text>
            <Text style={styles.instructionText}>
              Do not consume this medicine. Return it to the pharmacy and submit an instant incident report to CDSCO.
            </Text>

            <TouchableOpacity
              style={styles.actionBtnFilled}
              onPress={() =>
                router.push({
                  pathname: '/report',
                  params: { qrToken: qrData || packId, medicineName },
                })
              }
            >
              <Text style={styles.actionBtnFilledText}>Report This Medicine</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  loadingSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  scoreLabel: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  scoreValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 15,
  },
  detailValue: {
    color: '#111827',
    fontWeight: '500',
    fontSize: 15,
  },
  viewFullDetailsBtn: {
    paddingVertical: 16,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  viewFullDetailsText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnOutlineText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  riskIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  riskText: {
    flex: 1,
    color: '#4b5563',
    lineHeight: 22,
    fontSize: 15,
  },
  instructionText: {
    color: '#4b5563',
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 24,
  },
  actionBtnFilled: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnFilledText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  provenanceCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  provenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  provenanceHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  provenanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  provenanceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  provenanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    maxWidth: '65%',
    textAlign: 'right',
  },
  relativeTimeBadge: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  guidanceBoxSuccess: {
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 12,
    marginTop: 14,
  },
  guidanceTitleSuccess: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 4,
  },
  guidanceTextSuccess: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },
  guidanceBoxWarning: {
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 12,
    marginTop: 14,
  },
  guidanceTitleWarning: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  guidanceTextWarning: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});
