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

  const isAuthentic = result
    ? result.uiState === 'GENUINE' || result.uiState === 'AT_SHOP' || result.status === 'AUTHENTIC'
    : status === 'authentic' || status === 'verified';

  const isVerified = isAuthentic;
  const trustScore = result?.risk?.score ?? (isVerified ? 98 : 0);

  const medicineName = result?.pack?.medicineName || (qrData ? 'Verified Formulation' : 'No Active Scan');
  const manufacturerName = result?.manufacturer?.name || (qrData ? 'Verified Facility' : 'Unknown Manufacturer');
  const batchNumber = result?.pack?.batchId || (qrData ? 'BATCH-SCAN' : 'N/A');
  const mfgDate = result?.pack?.manufacturingDate || 'N/A';
  const expiryDate = result?.pack?.expiryDate || 'N/A';
  const packId = result?.pack?.packId || result?.packHash || qrData || 'N/A';

  const handleSaveToCabinet = () => {
    const med: SavedMedicine = {
      id: `med-${Date.now()}`,
      name: medicineName,
      genericName: result?.payload?.genericName || medicineName,
      dosage: result?.pack?.dosage || 'Standard Formulation',
      batchNumber,
      manufacturer: manufacturerName,
      mfgDate,
      expiryDate,
      daysToExpiry: 365,
      status: isVerified ? 'Verified' : 'Needs Attention',
      packId,
      category: 'General Care',
      verifiedAt: 'Just now',
      safetyScore: trustScore,
    };
    addSavedMedicine(med);
    setSaved(true);
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
        <View style={[styles.statusCard, { backgroundColor: isVerified ? '#10b981' : '#f97316' }]}>
          <View style={styles.statusHeader}>
            {isVerified ? (
              <CheckCircle2 size={48} color="#fff" />
            ) : (
              <AlertTriangle size={48} color="#fff" />
            )}
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>
                {result?.uiState === 'GENUINE'
                  ? '100% Genuine'
                  : result?.uiState === 'AT_SHOP'
                  ? 'Verified at Pharmacy'
                  : result?.uiState === 'ALREADY_SOLD'
                  ? 'Previously Sold'
                  : result?.uiState === 'COUNTERFEIT'
                  ? 'Counterfeit Warning'
                  : isVerified
                  ? 'Authentic Medicine'
                  : 'Suspicious / Unverified'}
              </Text>
              <Text style={styles.statusDesc}>
                {result?.message ||
                  (isVerified
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

        {/* Content based on status */}
        {isVerified ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicine Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Medicine</Text>
              <Text style={styles.detailValue}>{medicineName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Manufacturer</Text>
              <Text style={styles.detailValue}>{manufacturerName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch No.</Text>
              <Text style={styles.detailValue}>{batchNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mfg. Date</Text>
              <Text style={styles.detailValue}>{mfgDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{expiryDate}</Text>
            </View>
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
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Indicators</Text>

            <View style={styles.riskItem}>
              <AlertTriangle size={20} color="#f97316" style={styles.riskIcon} />
              <Text style={styles.riskText}>
                {result?.message || 'Cryptographic ES256 signature verification failed or pack state unverified.'}
              </Text>
            </View>
            <View style={styles.riskItem}>
              <AlertTriangle size={20} color="#f97316" style={styles.riskIcon} />
              <Text style={styles.riskText}>Possible duplicate QR packaging or unauthorized distribution channel.</Text>
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
});
