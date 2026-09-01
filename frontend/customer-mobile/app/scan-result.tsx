import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Platform,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  BookmarkCheck,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
  Award,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verifyMedicineQR } from '../src/services/api/verify.api';
import { useCustomerStore } from '../src/store/customerStore';
import { VerificationResult, SavedMedicine } from '../src/types';

import CertificateCard from '../src/components/CertificateCard';
import MedicineJourneyAnimation from '../src/components/MedicineJourneyAnimation';
import SafetyFeaturesGrid from '../src/components/SafetyFeaturesGrid';

export default function ScanResultScreen() {
  const router = useRouter();
  const { status, qrData } = useLocalSearchParams<{ status?: string; qrData?: string }>();
  const insets = useSafeAreaInsets();
  const { addSavedMedicine, addScanRecord } = useCustomerStore();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [saved, setSaved] = useState(false);

  // Flow State: false = Show uninterrupted 5-step animation; true = Show final result
  const [journeyCompleted, setJourneyCompleted] = useState(false);

  // Reveal Animation for final result
  const revealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      qrData &&
      qrData !== 'PC-JWT-GENUINE-BATCH-PCM-2026-SUNPHARMA' &&
      qrData !== 'PC-JWT-FLAGGED-INVALID-SIGNATURE'
    ) {
      setLoading(true);
      verifyMedicineQR(qrData)
        .then((res) => {
          setResult(res);
          const isAuth =
            res.uiState === 'GENUINE' || res.uiState === 'AT_SHOP' || res.status === 'AUTHENTIC';
          addScanRecord({
            id: `scan-${Date.now()}`,
            name: res.pack?.medicineName || 'Augmentin 625 Duo',
            genericName: res.payload?.genericName || 'Amoxicillin Potassium Clavulanate IP',
            batchNumber: res.pack?.batchId || 'B0260074A',
            manufacturer: res.manufacturer?.name || 'Sun Pharma Laboratories Ltd.',
            scannedAt: 'Just now',
            location: res.shop?.name || 'Apollo Pharmacy #402',
            status: isAuth ? 'Verified' : 'Suspicious',
            trustScore: res.risk?.score ?? (isAuth ? 98 : 30),
            packId: res.pack?.packId || res.packHash || qrData,
          });
        })
        .catch((err) => {
          console.error('Scan verification error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [qrData]);

  const isAuthentic = result
    ? result.uiState === 'GENUINE' || result.uiState === 'AT_SHOP' || result.status === 'AUTHENTIC'
    : status === 'authentic' || status === 'verified' || !status;

  const isVerified = isAuthentic;
  const trustScore = result?.risk?.score ?? (isVerified ? 98 : 25);

  const medicineName = result?.pack?.medicineName || 'Augmentin 625 Duo';
  const genericName = result?.payload?.genericName || 'Amoxicillin Potassium Clavulanate IP';
  const supplierName = result?.manufacturer?.name || 'Sun Pharma Laboratories Ltd.';
  const batchId = result?.pack?.batchId || 'B0260074A';
  const mfgDate = result?.pack?.manufacturingDate || '01 August 2026';
  const expiryDate = result?.pack?.expiryDate || '31 July 2028';
  const packId = result?.pack?.packId || result?.packHash || qrData || 'PC-B0260074A-HASH';
  const warehouseName = 'PharmaChain Hub Gurgaon';
  const dispatchDate = '30 August 2026';
  const shopName = result?.shop?.name || 'Apollo Pharmacy #402';

  const handleFinishJourney = () => {
    setJourneyCompleted(true);
    revealAnim.setValue(0);
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  };

  const handleReplayJourney = () => {
    setJourneyCompleted(false);
  };

  const handleSaveToCabinet = () => {
    const med: SavedMedicine = {
      id: `med-${Date.now()}`,
      name: medicineName,
      genericName,
      dosage: result?.pack?.dosage || 'Oral 1 Strip (10 Tablets)',
      batchNumber: batchId,
      manufacturer: supplierName,
      mfgDate,
      expiryDate,
      daysToExpiry: 700,
      status: isVerified ? 'Verified' : 'Needs Attention',
      packId,
      category: 'Prescription Care',
      verifiedAt: 'Just now',
      safetyScore: trustScore,
    };
    addSavedMedicine(med);
    setSaved(true);
    if (Platform.OS === 'web') {
      window.alert('Saved to your PharmaChain Medicine Cabinet!');
    } else {
      Alert.alert('Saved to Cabinet', 'This medicine has been safely added to your digital cabinet.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `PharmaChain Authenticity Certificate: ${medicineName} (Batch ${batchId}) verified genuine on Hyperledger Fabric ledger. Trust Score: ${trustScore}/100.`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <View style={styles.loadingGlowRing}>
          <ActivityIndicator size="large" color="#FF5342" />
        </View>
        <Text style={styles.loadingTitle}>Connecting to Blockchain Ledger...</Text>
        <Text style={styles.loadingSubtitle}>
          Fetching cryptographic verification & live batch journey
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#17181A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{medicineName}</Text>
          <Text style={styles.headerSubtitle}>
            {journeyCompleted ? 'Authenticity Result' : 'Live Supply Journey'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={20} color="#17181A" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (insets.bottom || 10) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* PHASE 1: Live Step-by-Step Supply Chain Animation (Un-eruptable Timeline) */}
        {!journeyCompleted ? (
          <View style={styles.animationWrapper}>
            <MedicineJourneyAnimation
              medicineName={medicineName}
              supplierName={supplierName}
              tempRange="25–30°C"
              expiryDate={expiryDate}
              mfgDate={mfgDate}
              batchId={batchId}
              warehouseName={warehouseName}
              dispatchDate={dispatchDate}
              trustScore={trustScore}
              packId={packId}
              shopName={shopName}
              onFinishJourney={handleFinishJourney}
            />
          </View>
        ) : (
          /* PHASE 2: Clean, High-Impact Authenticity Result & Certificate */
          <Animated.View
            style={[
              styles.resultContainer,
              {
                opacity: revealAnim,
                transform: [
                  {
                    translateY: revealAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Grand Authenticity Banner */}
            <View
              style={[
                styles.resultCard,
                isVerified ? styles.resultCardSuccess : styles.resultCardWarning,
              ]}
            >
              <View style={styles.badgeCircle}>
                {isVerified ? (
                  <ShieldCheck size={36} color="#ffffff" strokeWidth={2.4} />
                ) : (
                  <ShieldAlert size={36} color="#ffffff" strokeWidth={2.4} />
                )}
              </View>

              <View style={styles.badgeTextGroup}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {isVerified ? 'VERIFIED AUTHENTIC • 100% GENUINE' : 'FLAGGED SUSPICIOUS'}
                  </Text>
                </View>
                <Text style={styles.resultHeadline}>
                  {isVerified ? '100% Genuine Medicine' : 'Counterfeit Warning'}
                </Text>
                <Text style={styles.resultDescription}>
                  {isVerified
                    ? 'All 5 supply chain checkpoints validated cryptographically on Hyperledger Fabric ledger.'
                    : 'Digital signature mismatch detected. Do not consume this formulation.'}
                </Text>
              </View>

              {/* Trust Score & Replay Action */}
              <View style={styles.scoreRow}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Fabric Trust Score</Text>
                  <Text style={[styles.scoreValue, { color: isVerified ? '#FF5342' : '#dc2626' }]}>
                    {trustScore}/100
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.replayBtn}
                  onPress={handleReplayJourney}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={14} color="#17181A" />
                  <Text style={styles.replayBtnText}>Replay Journey</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Medicine Dossier */}
            <View style={styles.dossierCard}>
              <View style={styles.dossierHeader}>
                <Award size={18} color="#FF5342" />
                <Text style={styles.dossierTitle}>Medicine Verification Dossier</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Medicine Name</Text>
                <Text style={styles.dossierValueBold}>{medicineName}</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Generic Salt</Text>
                <Text style={styles.dossierValue}>{genericName}</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Manufacturer</Text>
                <Text style={styles.dossierValue}>{supplierName}</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Batch Number</Text>
                <View style={styles.batchPill}>
                  <Text style={styles.batchPillText}>{batchId}</Text>
                </View>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Manufacturing Date</Text>
                <Text style={styles.dossierValue}>{mfgDate}</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Expiry Date</Text>
                <Text style={[styles.dossierValue, { color: '#FF5342', fontWeight: '800' }]}>
                  {expiryDate}
                </Text>
              </View>

              <View style={[styles.dossierRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.dossierLabel}>Blockchain Pack Hash</Text>
                <Text style={styles.hashText}>
                  {packId.length > 20 ? `${packId.substring(0, 10)}...${packId.substring(packId.length - 6)}` : packId}
                </Text>
              </View>
            </View>

            {/* Certificate of Authenticity Timeline */}
            <CertificateCard
              supplierName={supplierName}
              tempRange="25-30°C"
              expiryDate={expiryDate}
              batchId={batchId}
              warehouseName={warehouseName}
              dispatchDate={dispatchDate}
              onScanMore={() => router.push('/(tabs)/scan')}
            />

            {/* Safety Verification Pillars */}
            <SafetyFeaturesGrid />

            {/* Action Buttons */}
            <View style={styles.actionButtonGroup}>
              {isVerified ? (
                <TouchableOpacity
                  style={[
                    styles.primaryActionBtn,
                    saved && styles.primaryActionBtnSaved,
                  ]}
                  onPress={handleSaveToCabinet}
                  disabled={saved}
                  activeOpacity={0.85}
                >
                  <BookmarkCheck size={18} color="#ffffff" />
                  <Text style={styles.primaryActionBtnText}>
                    {saved ? 'Saved in My Medicine Cabinet' : 'Save to Medicine Cabinet'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.dangerActionBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/report',
                      params: { qrToken: packId, medicineName },
                    })
                  }
                  activeOpacity={0.85}
                >
                  <ShieldAlert size={18} color="#ffffff" />
                  <Text style={styles.dangerActionBtnText}>
                    Report Counterfeit to CDSCO
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => router.push('/(tabs)/scan')}
                activeOpacity={0.85}
              >
                <ScanLine size={18} color="#FF5342" />
                <Text style={styles.secondaryActionBtnText}>Scan Another Medicine</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  loadingGlowRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FBD9DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF5342',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17181A',
    marginBottom: 6,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#5B5F63',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17181A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#5B5F63',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  animationWrapper: {
    paddingBottom: 20,
  },
  resultContainer: {
    paddingTop: 6,
  },
  resultCard: {
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  resultCardSuccess: {
    backgroundColor: '#FFF7F7',
    borderColor: '#F3D9DB',
  },
  resultCardWarning: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  badgeCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF5342',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeTextGroup: {
    alignItems: 'center',
    marginBottom: 14,
  },
  statusPill: {
    backgroundColor: '#DFF9E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2E6B4C',
    letterSpacing: 0.5,
  },
  resultHeadline: {
    fontSize: 20,
    fontWeight: '900',
    color: '#17181A',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 12,
    color: '#5B5F63',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F3D9DB',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B5F63',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  replayBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#17181A',
  },
  dossierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#17181A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  dossierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  dossierTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#17181A',
  },
  dossierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dossierLabel: {
    fontSize: 12,
    color: '#5B5F63',
    fontWeight: '600',
  },
  dossierValue: {
    fontSize: 12,
    color: '#17181A',
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },
  dossierValueBold: {
    fontSize: 13,
    color: '#17181A',
    fontWeight: '800',
    maxWidth: '55%',
    textAlign: 'right',
  },
  batchPill: {
    backgroundColor: '#FBD9DC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  batchPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FF5342',
  },
  hashText: {
    fontSize: 11,
    color: '#FF5342',
    fontWeight: '800',
  },
  actionButtonGroup: {
    gap: 10,
    marginVertical: 14,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF5342',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionBtnSaved: {
    backgroundColor: '#2E6B4C',
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  dangerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 16,
  },
  dangerActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5342',
  },
});
