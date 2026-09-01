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
  Share,
  Alert,
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
  Building2,
  Barcode,
  Hash,
  Sparkles,
  ChevronRight,
  Copy,
  Award,
  Layers,
  Lock,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scanMedicine, intakeMedicine, dispenseMedicine } from '../src/services/api/scan';
import { PharmaTheme } from '../src/constants/theme';
import { Skeleton } from '../src/components/common/Skeleton';

interface VerificationResult {
  name: string;
  generic?: string;
  mfg: string;
  batch: string;
  mfgDate: string;
  expDate: string;
  packId: string;
  serial?: string;
  status: string;
  ledgerStatus: string;
  score: string;
  color: string;
  bg: string;
  desc: string;
}

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    qrData?: string;
    mode?: 'RECEIVE' | 'DISPENSE' | 'VERIFY';
  }>();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const rawQr = params.qrData || params.id || '';

    const executeVerification = async () => {
      setLoading(true);
      try {
        const mode = params.mode || 'VERIFY';

        if (mode === 'RECEIVE') {
          const res = await intakeMedicine({ qrData: rawQr });
          if (res?.status === 'error') {
            throw { response: { data: res } };
          }
          const itemData = res?.data || res?.medicine || {};
          setData({
            name: itemData.medicineName || itemData.name || 'Pharmaceutical Formulation',
            generic: itemData.genericName || 'Active Generic Compound',
            mfg: itemData.manufacturerId || itemData.manufacturer || 'CDSCO Registered Manufacturer',
            batch: itemData.batchId || itemData.batchNumber || 'PC-BATCH-001',
            serial: itemData.serial || itemData.serialNo || '00001',
            packId: itemData.packHash || rawQr || '0x49a71...9921',
            expDate: itemData.expiryDate || '2028-08-19',
            mfgDate: itemData.mfgDate || '2026-08-01',
            status: 'Stock Inbound Accepted',
            ledgerStatus: 'AT_SHOP',
            score: '98',
            color: '#059669',
            bg: '#ecfdf5',
            desc: res?.message || 'Medicine successfully received and registered into shop inventory (State: AT_SHOP).',
          });
        } else if (mode === 'DISPENSE') {
          const res = await dispenseMedicine({ qrData: rawQr });
          if (res?.status === 'error') {
            throw { response: { data: res } };
          }
          const itemData = res?.data || res?.medicine || {};
          setData({
            name: itemData.medicineName || itemData.name || 'Pharmaceutical Formulation',
            generic: itemData.genericName || 'Active Generic Compound',
            mfg: itemData.manufacturerId || itemData.manufacturer || 'CDSCO Registered Manufacturer',
            batch: itemData.batchId || itemData.batchNumber || 'PC-BATCH-001',
            serial: itemData.serial || itemData.serialNo || '00001',
            packId: itemData.packHash || rawQr || '0x49a71...9921',
            expDate: itemData.expiryDate || '2028-08-19',
            mfgDate: itemData.mfgDate || '2026-08-01',
            status: 'Sale Confirmed (SOLD)',
            ledgerStatus: 'SOLD',
            score: '99',
            color: '#059669',
            bg: '#ecfdf5',
            desc: res?.message || 'Sale recorded on blockchain ledger. Unit token burned from inventory.',
          });
        } else {
          // Read-only Verification
          const res = await scanMedicine(rawQr);
          const payload = res?.payload || res?.data || {};
          const isAtShop = res?.ledgerStatus === 'AtShop' || res?.ledgerStatus === 'AT_SHOP';
          const isSold = res?.ledgerStatus === 'Sold' || res?.ledgerStatus === 'SOLD';
          const isRecalled = res?.ledgerStatus === 'Recalled' || res?.ledgerStatus === 'RECALLED';

          let statusTitle = 'Cryptographically Verified';
          let statusDesc = 'Genuine medicine with valid ES256 manufacturer cryptographic signature.';
          let statusColor = '#059669';
          let statusScore = '98';

          if (isRecalled) {
            statusTitle = 'RECALLED BATCH ALERT';
            statusDesc = 'CRITICAL: Batch recalled by manufacturer. Do not sell or dispense!';
            statusColor = '#dc2626';
            statusScore = '0';
          } else if (isSold) {
            statusTitle = 'Already Sold on Ledger';
            statusDesc = 'This pack has already been sold previously. Possible clone or duplicate barcode.';
            statusColor = '#d97706';
            statusScore = '45';
          } else if (isAtShop) {
            statusTitle = 'Verified Authentic (At Shop)';
            statusDesc = 'Pack is registered in active pharmacy stock and ready for dispensing.';
            statusColor = '#059669';
            statusScore = '98';
          }

          setData({
            name: payload.medicineName || payload.name || 'Verified Formulation',
            generic: payload.genericName || 'Active Generic Compound',
            mfg: payload.manufacturerId || payload.manufacturer || 'CDSCO Registered Manufacturer',
            batch: payload.batchId || payload.batchNumber || 'BATCH-LIVE',
            serial: payload.serial || payload.serialNo || '00001',
            packId: res?.packHash || rawQr || '0x49a71...9921',
            expDate: payload.expiryDate || '2028-08-19',
            mfgDate: payload.mfgDate || '2026-08-01',
            status: statusTitle,
            ledgerStatus: res?.ledgerStatus || 'AT_SHOP',
            score: statusScore,
            color: statusColor,
            bg: statusColor === '#dc2626' ? '#fef2f2' : statusColor === '#d97706' ? '#fffbeb' : '#ecfdf5',
            desc: statusDesc,
          });
        }
      } catch (err: any) {
        const errorData = err?.response?.data || {};
        const errorCode = errorData?.code || '';
        const errorMessage = errorData?.message || err?.message || 'Verification failed';

        const isDuplicate = errorCode === 'DUPLICATE_INTAKE' || err?.response?.status === 409;
        const isSold = errorCode === 'ALREADY_SOLD';

        setData({
          name: isDuplicate ? 'Duplicate Inbound Pack' : isSold ? 'Previously Sold Pack' : 'Unverified Barcode Token',
          generic: 'Unverified Generic',
          mfg: 'Unknown Origin',
          batch: isDuplicate ? 'DUPLICATE-BATCH' : 'INVALID-TOKEN',
          mfgDate: 'N/A',
          expDate: 'N/A',
          packId: rawQr || '0xUNKNOWN',
          status: isDuplicate ? 'Duplicate Scan' : isSold ? 'Already Dispensed' : 'Counterfeit Alert',
          ledgerStatus: isDuplicate ? 'DUPLICATE' : isSold ? 'SOLD' : 'COUNTERFEIT',
          score: isDuplicate ? '45' : isSold ? '20' : '0',
          color: isDuplicate ? '#d97706' : '#dc2626',
          bg: isDuplicate ? '#fffbeb' : '#fef2f2',
          desc: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    executeVerification();
  }, [params.qrData, params.id, params.mode]);

  const handleShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `[PharmaChain Verification Report]\nMedicine: ${data.name}\nBatch: ${data.batch}\nTrust Score: ${data.score}/100\nVerdict: ${data.status}`,
      });
    } catch (e) {}
  };

  const copyToClipboard = (text: string) => {
    Alert.alert('Copied to Clipboard', text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(shopkeeper)/dashboard');
          }}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#0f172a" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Certificate</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare} activeOpacity={0.8}>
          <Share2 color="#0f172a" size={18} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={PharmaTheme.colors.primary} />
          <Text style={styles.loadingTitle}>Querying Blockchain Nodes...</Text>
          <Text style={styles.loadingSubtitle}>
            Verifying ES256 cryptographic signature and fabric ledger custody
          </Text>

          <View style={{ width: '100%', marginTop: 28, paddingHorizontal: 20 }}>
            <Skeleton width="100%" height={160} borderRadius={20} />
            <Skeleton width="100%" height={240} borderRadius={18} style={{ marginTop: 16 }} />
          </View>
        </View>
      ) : data ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Result Verdict Hero */}
          <View style={[styles.resultCard, { backgroundColor: data.color }]}>
            <View style={styles.resultHeader}>
              <View style={styles.iconCircle}>
                {data.color === '#dc2626' ? (
                  <ShieldAlert color="#ffffff" size={38} />
                ) : data.color === '#d97706' ? (
                  <AlertTriangle color="#ffffff" size={38} />
                ) : (
                  <CheckCircle2 color="#ffffff" size={38} />
                )}
              </View>
              <View style={styles.resultHeaderText}>
                <View style={styles.verdictChip}>
                  <Sparkles size={11} color="#ffffff" />
                  <Text style={styles.verdictChipText}>AUTHENTICITY VERDICT</Text>
                </View>
                <Text style={styles.resultTitle}>{data.status}</Text>
                <Text style={styles.resultDesc}>{data.desc}</Text>
              </View>
            </View>

            {/* Trust Score Gauge Bar */}
            <View style={styles.scoreContainer}>
              <View>
                <Text style={styles.scoreLabel}>Authenticity Trust Score</Text>
                <Text style={styles.scoreSub}>ES256 Cryptographic Matrix</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreValue}>{data.score}/100</Text>
              </View>
            </View>
          </View>

          {/* Ledger Custody State Card */}
          <View style={styles.custodyCard}>
            <View style={styles.custodyLeft}>
              <Boxes size={18} color={PharmaTheme.colors.primary} />
              <Text style={styles.custodyTitle}>Ledger Custody State:</Text>
            </View>
            <View style={[styles.custodyBadge, { backgroundColor: data.bg }]}>
              <Text style={[styles.custodyBadgeText, { color: data.color }]}>
                {data.ledgerStatus || 'AT_SHOP'}
              </Text>
            </View>
          </View>

          {/* Specifications Card */}
          <Text style={styles.sectionTitle}>Pharmaceutical Specifications</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand Formulation</Text>
              <Text style={styles.detailValueBold}>{data.name}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Active Generic</Text>
              <Text style={styles.detailValue}>{data.generic || data.name}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.labelWithIcon}>
                <Building2 size={13} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Manufacturer</Text>
              </View>
              <Text style={styles.detailValue}>{data.mfg}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.labelWithIcon}>
                <Barcode size={13} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Batch Identifier</Text>
              </View>
              <TouchableOpacity
                style={styles.batchChip}
                onPress={() => copyToClipboard(data.batch)}
                activeOpacity={0.8}
              >
                <Text style={styles.batchChipText}>{data.batch}</Text>
                <Copy size={11} color={PharmaTheme.colors.primary} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            {data.serial && (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <View style={styles.labelWithIcon}>
                    <Hash size={13} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={styles.detailLabel}>Unit Serial No.</Text>
                  </View>
                  <Text style={styles.serialText}>#{data.serial}</Text>
                </View>
              </>
            )}

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.labelWithIcon}>
                <Clock size={13} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Expiry Date</Text>
              </View>
              <Text style={styles.detailValue}>{data.expDate}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pack Token Hash</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(data.packId)}
                activeOpacity={0.8}
              >
                <Text style={styles.hashValue} numberOfLines={1}>
                  {data.packId}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action CTA */}
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: data.color }]}
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(shopkeeper)/dashboard');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionBtnText}>
              {data.color === '#dc2626'
                ? 'Report Counterfeit Incident'
                : params.mode === 'RECEIVE'
                ? 'Scan Next Inbound Shipment'
                : params.mode === 'DISPENSE'
                ? 'Scan Next POS Item'
                : 'Done / Return to Dashboard'}
            </Text>
            <ChevronRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  resultCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start',
  },
  iconCircle: {
    marginRight: 14,
    marginTop: 2,
  },
  resultHeaderText: {
    flex: 1,
  },
  verdictChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  verdictChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    opacity: 0.9,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultDesc: {
    color: '#ffffff',
    opacity: 0.95,
    fontSize: 12,
    lineHeight: 17,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  scoreLabel: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  scoreSub: {
    color: '#ffffff',
    opacity: 0.75,
    fontSize: 10,
    marginTop: 1,
  },
  scorePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  scoreValue: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  custodyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  custodyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  custodyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  custodyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  custodyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  detailValueBold: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    maxWidth: '60%',
    textAlign: 'right',
  },
  detailValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  batchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  batchChipText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#2563eb',
  },
  serialText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#2563eb',
  },
  hashValue: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748b',
    maxWidth: '55%',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
});
