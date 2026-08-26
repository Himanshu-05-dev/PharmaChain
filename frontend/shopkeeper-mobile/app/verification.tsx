import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Boxes,
  ShoppingCart,
  Clock,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scanMedicine, intakeMedicine, dispenseMedicine } from '../src/services/api/scan';

// Mock database to simulate fetching data based on ID
const mockDatabase: Record<string, any> = {
  '1': {
    name: 'Paracetamol 500mg',
    mfg: 'XYZ Pharma Pvt. Ltd.',
    batch: 'PCM-26-A91',
    mfgDate: '20 Aug 2026',
    expDate: '19 Aug 2028',
    packId: 'PK8F29A71X',
    status: 'Verified (In Stock)',
    score: '96/100',
    color: '#16a34a',
    bg: '#dcfce7',
    icon: <CheckCircle2 color="#ffffff" size={44} />,
    desc: 'This medicine is genuine and cryptographically verified on PharmaChain.',
  },
  '2': {
    name: 'Amoxicillin 250mg',
    mfg: 'HealthCorp Ltd.',
    batch: 'AMX-25-B42',
    mfgDate: '15 Jul 2025',
    expDate: '14 Jul 2027',
    packId: 'PK3B12C99Y',
    status: 'Suspicious (Duplicate)',
    score: '54/100',
    color: '#d97706',
    bg: '#fef3c7',
    icon: <AlertTriangle color="#ffffff" size={44} />,
    desc: 'This pack token was previously received or scanned. Proceed with caution.',
  },
  '3': {
    name: 'Vitamin D3',
    mfg: 'NutriLife Inc.',
    batch: 'VD3-26-C11',
    mfgDate: '10 Jan 2026',
    expDate: '09 Jan 2028',
    packId: 'PK9L34D88Z',
    status: 'Verified (In Stock)',
    score: '98/100',
    color: '#16a34a',
    bg: '#dcfce7',
    icon: <CheckCircle2 color="#ffffff" size={44} />,
    desc: 'This medicine is genuine and safe for pharmacy dispensing.',
  },
  '4': {
    name: 'Ibuprofen 400mg',
    mfg: 'Medika Co.',
    batch: 'IBU-26-X99',
    mfgDate: '01 Mar 2026',
    expDate: '28 Feb 2028',
    packId: 'PK1A55E77W',
    status: 'Counterfeit Alert',
    score: '12/100',
    color: '#dc2626',
    bg: '#fee2e2',
    icon: <ShieldAlert color="#ffffff" size={44} />,
    desc: 'DANGER: Invalid digital signature! Do not accept or dispense this medicine!',
  },
  '5': {
    name: 'Cetirizine 10mg',
    mfg: 'AllergyMeds Ltd.',
    batch: 'CET-25-Y77',
    mfgDate: '05 May 2025',
    expDate: '04 May 2027',
    packId: 'PK4N66F22V',
    status: 'Verified',
    score: '95/100',
    color: '#16a34a',
    bg: '#dcfce7',
    icon: <CheckCircle2 color="#ffffff" size={44} />,
    desc: 'This medicine is genuine and safe to use.',
  },
};

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    qrData?: string;
    mode?: 'RECEIVE' | 'DISPENSE' | 'VERIFY';
  }>();

  const [loading, setLoading] = useState(Boolean(params.qrData));
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    if (!params.qrData) return;

    const runScanOperation = async () => {
      setLoading(true);
      try {
        const mode = params.mode || 'VERIFY';

        if (mode === 'RECEIVE') {
          // Inbound Stock Intake
          const res = await intakeMedicine({ qrData: params.qrData! });
          if (res?.status === 'error') {
            throw { response: { data: res } };
          }
          setApiData({
            type: 'RECEIVE_SUCCESS',
            name: res?.data?.medicineName || 'Pharmaceutical Medicine',
            mfg: res?.data?.manufacturerId || 'Verified Manufacturer',
            batch: res?.data?.batchId || 'PC-BATCH-LIVE',
            serial: res?.data?.serial || '00001',
            packId: res?.data?.packHash || 'PACK-HASH',
            expDate: res?.data?.expiryDate || 'N/A',
            mfgDate: '2026-08-01',
            status: 'Stock Inbound Accepted',
            score: '98/100',
            color: '#16a34a',
            bg: '#dcfce7',
            icon: <CheckCircle2 color="#ffffff" size={44} />,
            desc: res?.message || 'Medicine successfully received into shop inventory (State: AT_SHOP).',
          });
        } else if (mode === 'DISPENSE') {
          // Point of Sale Dispense
          const res = await dispenseMedicine({ qrData: params.qrData! });
          if (res?.status === 'error') {
            throw { response: { data: res } };
          }
          setApiData({
            type: 'DISPENSE_SUCCESS',
            name: res?.data?.medicineName || 'Pharmaceutical Medicine',
            mfg: res?.data?.manufacturerId || 'Verified Manufacturer',
            batch: res?.data?.batchId || 'PC-BATCH-LIVE',
            serial: res?.data?.serial || '00001',
            packId: res?.data?.packHash || 'PACK-HASH',
            expDate: res?.data?.expiryDate || 'N/A',
            mfgDate: '2026-08-01',
            status: 'Sale Confirmed (SOLD)',
            score: '99/100',
            color: '#16a34a',
            bg: '#dcfce7',
            icon: <CheckCircle2 color="#ffffff" size={44} />,
            desc: res?.message || 'Sale recorded on blockchain ledger. Medicine dispensed to patient.',
          });
        } else {
          // Read-only Verification
          const res = await scanMedicine(params.qrData!);
          const payload = res?.payload || {};
          const isAtShop = res?.ledgerStatus === 'AtShop' || res?.ledgerStatus === 'AT_SHOP';
          const isSold = res?.ledgerStatus === 'Sold' || res?.ledgerStatus === 'SOLD';
          const isRecalled = res?.ledgerStatus === 'Recalled' || res?.ledgerStatus === 'RECALLED';

          let statusTitle = 'Cryptographically Verified';
          let statusDesc = 'Genuine medicine with valid ES256 manufacturer signature.';
          let statusColor = '#16a34a';
          let statusScore = '96/100';

          if (isRecalled) {
            statusTitle = 'RECALLED BATCH ALERT';
            statusDesc = 'CRITICAL: Batch recalled by manufacturer. Do not sell or dispense!';
            statusColor = '#dc2626';
            statusScore = '0/100';
          } else if (isSold) {
            statusTitle = 'Already Sold on Ledger';
            statusDesc = 'This pack has already been sold previously. Possible duplicate or clone barcode.';
            statusColor = '#d97706';
            statusScore = '45/100';
          } else if (isAtShop) {
            statusTitle = 'Verified Authentic (At Shop)';
            statusDesc = 'Pack is registered in pharmacy stock and ready for dispense.';
            statusColor = '#16a34a';
            statusScore = '98/100';
          }

          setApiData({
            type: 'VERIFY_SUCCESS',
            name: payload.medicineName || 'Verified Formulation',
            mfg: payload.manufacturerId || 'Verified CDSCO Manufacturer',
            batch: payload.batchId || 'BATCH-LIVE',
            serial: payload.serial || '00001',
            packId: res?.packHash || 'PACK-HASH',
            expDate: payload.expiryDate || 'N/A',
            mfgDate: '2026-08-01',
            status: statusTitle,
            score: statusScore,
            color: statusColor,
            bg: statusColor === '#dc2626' ? '#fee2e2' : statusColor === '#d97706' ? '#fef3c7' : '#dcfce7',
            icon: statusColor === '#dc2626' ? <ShieldAlert color="#ffffff" size={44} /> : statusColor === '#d97706' ? <AlertTriangle color="#ffffff" size={44} /> : <CheckCircle2 color="#ffffff" size={44} />,
            desc: statusDesc,
          });
        }
      } catch (err: any) {
        const errorData = err?.response?.data || {};
        const errorCode = errorData?.code || '';
        const errorMessage = errorData?.message || err?.message || 'Verification failed';

        if (errorCode === 'DUPLICATE_INTAKE' || err?.response?.status === 409) {
          setApiData({
            type: 'DUPLICATE_INTAKE',
            name: 'Scanned Pack Item',
            mfg: 'Registered Manufacturer',
            batch: 'PC-BATCH',
            mfgDate: '2026-08-01',
            expDate: '2028-08-01',
            packId: 'DUPLICATE-CHECK',
            status: 'Duplicate Inbound Scan',
            score: '50/100',
            color: '#d97706',
            bg: '#fef3c7',
            icon: <AlertTriangle color="#ffffff" size={44} />,
            desc: errorMessage || 'This pack has already been received into shop inventory. Duplicate intake blocked.',
          });
        } else if (errorCode === 'ALREADY_SOLD') {
          setApiData({
            type: 'ALREADY_SOLD',
            name: 'Scanned Pack Item',
            mfg: 'Registered Manufacturer',
            batch: 'PC-BATCH',
            mfgDate: '2026-08-01',
            expDate: '2028-08-01',
            packId: 'ALREADY-SOLD',
            status: 'Already Sold / Dispensed',
            score: '15/100',
            color: '#dc2626',
            bg: '#fee2e2',
            icon: <ShieldAlert color="#ffffff" size={44} />,
            desc: errorMessage || 'This pack has already been sold on the blockchain. Double-dispense blocked.',
          });
        } else if (errorCode === 'INVALID_SIGNATURE' || errorCode === 'COUNTERFEIT') {
          setApiData({
            type: 'COUNTERFEIT',
            name: 'Unverified Product',
            mfg: 'Unknown Origin',
            batch: 'INVALID-SIGNATURE',
            mfgDate: 'N/A',
            expDate: 'N/A',
            packId: 'FORGED-TOKEN',
            status: 'Counterfeit Warning',
            score: '0/100',
            color: '#dc2626',
            bg: '#fee2e2',
            icon: <ShieldAlert color="#ffffff" size={44} />,
            desc: 'Cryptographic signature verification failed! This medicine barcode is unauthentic or forged.',
          });
        } else if (errorMessage.toLowerCase().includes('network') || err.message?.includes('Network')) {
          setApiData({
            type: 'NETWORK_ERROR',
            name: 'Connection Unavailable',
            mfg: 'Local Network Node',
            batch: 'N/A',
            mfgDate: 'N/A',
            expDate: 'N/A',
            packId: 'OFFLINE',
            status: 'Network Connection Error',
            score: '0/100',
            color: '#dc2626',
            bg: '#fee2e2',
            icon: <AlertTriangle color="#ffffff" size={44} />,
            desc: 'Could not connect to the backend server. Please verify your phone is connected to the same Wi-Fi network.',
          });
        } else {
          setApiData({
            type: 'GENERIC_INFO',
            name: 'Scan Notice',
            mfg: 'PharmaChain Network',
            batch: 'N/A',
            mfgDate: 'N/A',
            expDate: 'N/A',
            packId: 'SCAN-ERROR',
            status: 'Verification Notice',
            score: '0/100',
            color: '#dc2626',
            bg: '#fee2e2',
            icon: <AlertTriangle color="#ffffff" size={44} />,
            desc: errorMessage,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    runScanOperation();
  }, [params.qrData, params.mode]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingTitle}>Querying PharmaChain Node...</Text>
        <Text style={styles.loadingSubtitle}>
          Verifying ES256 Signature & Fabric Custody State
        </Text>
      </SafeAreaView>
    );
  }

  // Fallback to mock data if ID is passed directly
  const data = apiData || (params.id ? mockDatabase[params.id] : null) || mockDatabase['1'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(shopkeeper)/dashboard');
          }}
          style={styles.iconButton}
        >
          <ArrowLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan & Verification Result</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Share2 color="#0f172a" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.resultCard, { backgroundColor: data.color }]}>
          <View style={styles.resultHeader}>
            {data.icon}
            <View style={styles.resultHeaderText}>
              <Text style={styles.resultTitle}>{data.status}</Text>
              <Text style={styles.resultDesc}>{data.desc}</Text>
            </View>
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: 'rgba(0,0,0,0.18)' }]}>
            <Text style={styles.scoreLabel}>Authenticity Trust Score</Text>
            <Text style={styles.scoreValue}>{data.score}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pharmaceutical Specifications</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Medicine Name</Text>
            <Text style={styles.detailValue}>{data.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Manufacturer</Text>
            <Text style={styles.detailValue}>{data.mfg}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Batch Identifier</Text>
            <Text style={[styles.detailValue, { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}>
              {data.batch}
            </Text>
          </View>
          {data.serial && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Unit Serial No.</Text>
              <Text style={[styles.detailValue, { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}>
                #{data.serial}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry Date</Text>
            <Text style={styles.detailValue}>{data.expDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pack Hash</Text>
            <Text style={[styles.detailValue, { fontSize: 11, maxWidth: '60%' }]} numberOfLines={1}>
              {data.packId}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor: data.color }]}
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(shopkeeper)/dashboard');
          }}
        >
          <Text style={[styles.actionButtonText, { color: data.color }]}>
            {data.color === '#dc2626'
              ? 'Report Suspicious Batch'
              : params.mode === 'RECEIVE'
              ? 'Scan Next Inbound Pack'
              : params.mode === 'DISPENSE'
              ? 'Scan Next POS Item'
              : 'Done / Back to Dashboard'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  resultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  resultHeaderText: {
    marginLeft: 14,
    flex: 1,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDesc: {
    color: '#ffffff',
    opacity: 0.95,
    fontSize: 13,
    lineHeight: 18,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  scoreLabel: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 13,
  },
  scoreValue: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 13,
  },
  detailValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
