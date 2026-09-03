import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
  ShieldCheck,
  Milk,
  Thermometer,
  FileCheck2,
  Building2,
  Package,
  ScanLine,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  supplierName?: string;
  tempRange?: string;
  expiryDate?: string;
  batchId?: string;
  warehouseName?: string;
  dispatchDate?: string;
  onScanMore?: () => void;
}

export default function CertificateCard({
  supplierName = 'Sun Pharma Laboratories Ltd.',
  tempRange = '25-30°C',
  expiryDate = '31 July 2028',
  batchId = 'B0260074A',
  warehouseName = 'PharmaChain Hub Gurgaon',
  dispatchDate = '30 August 2026',
  onScanMore,
}: Props) {
  const router = useRouter();

  const steps = [
    {
      id: 'source',
      icon: Milk,
      label: 'Source',
      boldText: supplierName,
      detail: `Directly sourced from ${supplierName}`,
    },
    {
      id: 'storage',
      icon: Thermometer,
      label: 'Storage',
      boldText: tempRange,
      detail: `Maintained at a temperature of ${tempRange}`,
    },
    {
      id: 'pharmacist',
      icon: FileCheck2,
      label: 'Pharmacist Verification',
      boldText: `(${expiryDate}) • (${batchId})`,
      detail: `Verified by your pharmacist: dose, strength, expiry (${expiryDate}) for batch (${batchId})`,
    },
    {
      id: 'dispatch',
      icon: Building2,
      label: 'Dispatch',
      boldText: `${warehouseName} on ${dispatchDate}`,
      detail: `From ${warehouseName} on ${dispatchDate}`,
    },
    {
      id: 'transit',
      icon: Package,
      label: 'Transit',
      boldText: 'Safe & eco-friendly package',
      detail: 'Order shipped in safe & eco-friendly package with cold-chain seal',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Banner with GENUINE Stamp Badge */}
      <View style={styles.heroBanner}>
        <View style={styles.stampBadgeContainer}>
          <View style={styles.stampCircle}>
            <ShieldCheck size={26} color="#ffffff" strokeWidth={2.4} />
            <Text style={styles.stampText}>GENUINE</Text>
          </View>
          <View style={styles.stampOuterRing} />
        </View>

        <View style={styles.heroTextGroup}>
          <Text style={styles.heroTitle}>Certificate of Authenticity</Text>
          <Text style={styles.heroSubtitle}>
            Verified on Hyperledger Fabric • CDSCO Rule 96
          </Text>
        </View>
      </View>

      {/* 2. White Elevated Card with Vertical Stepper Timeline */}
      <View style={styles.timelineCard}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <View key={step.id} style={styles.stepRow}>
              {/* Left Column: Icon + Dotted Connector */}
              <View style={styles.iconColumn}>
                <View style={styles.iconCircle}>
                  <Icon size={16} color="#2E6B4C" strokeWidth={2.2} />
                </View>
                {!isLast && <View style={styles.dottedLine} />}
              </View>

              {/* Right Column: Eyebrow Pill + Detail */}
              <View style={[styles.contentColumn, !isLast && { paddingBottom: 22 }]}>
                <View style={styles.eyebrowPill}>
                  <Text style={styles.eyebrowText}>{step.label}</Text>
                </View>
                <Text style={styles.stepDetailText}>{step.detail}</Text>
              </View>
            </View>
          );
        })}

        {/* 3. Outlined Pill Button "⊞ Scan more medicines" */}
        <TouchableOpacity
          style={styles.scanMoreBtn}
          onPress={onScanMore || (() => router.push('/(tabs)/scan'))}
          activeOpacity={0.8}
        >
          <ScanLine size={18} color="#FF5342" strokeWidth={2.4} />
          <Text style={styles.scanMoreBtnText}>Scan more medicines</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Chevron Down Hint */}
      <View style={styles.chevronHintContainer}>
        <ChevronDown size={22} color="#FF5342" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  heroBanner: {
    backgroundColor: '#FBD9DC',
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  stampBadgeContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  stampCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F9584B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F9584B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  stampOuterRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.5,
    borderColor: 'rgba(249, 88, 75, 0.4)',
    borderStyle: 'dashed',
    top: -7,
    left: -7,
  },
  stampText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  heroTextGroup: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17181A',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#5B5F63',
    marginTop: 3,
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: -32,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#F3D9DB',
    shadowColor: '#17181A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  stepRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 14,
    width: 32,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DFF9E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8ECCB',
  },
  dottedLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#DFF9E8',
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
  },
  eyebrowPill: {
    backgroundColor: '#DFF9E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E6B4C',
    letterSpacing: 0.2,
  },
  stepDetailText: {
    fontSize: 13,
    color: '#17181A',
    lineHeight: 19,
    fontWeight: '500',
  },
  scanMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FF5342',
    paddingVertical: 13,
    borderRadius: 999,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  scanMoreBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5342',
  },
  chevronHintContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
});
