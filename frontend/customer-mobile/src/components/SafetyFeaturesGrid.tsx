import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ShieldCheck,
  ClipboardCheck,
  ThermometerSnowflake,
  PackageCheck,
} from 'lucide-react-native';

export default function SafetyFeaturesGrid() {
  const safetyPillars = [
    {
      id: 'genuine',
      title: 'Genuine Medicines',
      icon: ShieldCheck,
      iconColor: '#FF5342',
      iconBg: '#FBD9DC',
      points: [
        'Directly sourced from licensed manufacturers',
        'Cryptographically signed on Hyperledger Fabric',
      ],
    },
    {
      id: 'quality',
      title: 'Strict Quality Checks',
      icon: ClipboardCheck,
      iconColor: '#FF5342',
      iconBg: '#FBD9DC',
      points: [
        'Batch purity & potency tests logged on-chain',
        '100% compliance with CDSCO safety standards',
      ],
    },
    {
      id: 'storage',
      title: 'Proper Storage',
      icon: ThermometerSnowflake,
      iconColor: '#FF5342',
      iconBg: '#FBD9DC',
      points: [
        'Maintained strictly at 25°C to 30°C in warehouses',
        'Active temperature monitoring for sensitive drugs',
      ],
    },
    {
      id: 'delivery',
      title: 'Safe Delivery',
      icon: PackageCheck,
      iconColor: '#FF5342',
      iconBg: '#FBD9DC',
      points: [
        'Pharmacist-verified batch dispensing',
        'Tamper-evident security packaging',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Centered Heading with Brand in Accent Color (§3.4) */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>
          How does <Text style={styles.brandAccent}>PharmaChain</Text> ensure your safety?
        </Text>
      </View>

      {/* 2x2 Grid of Cards */}
      <View style={styles.grid}>
        {safetyPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <View key={pillar.id} style={styles.card}>
              <View
                style={[
                  styles.iconTile,
                  { backgroundColor: pillar.iconBg },
                ]}
              >
                <Icon size={20} color={pillar.iconColor} strokeWidth={2.4} />
              </View>

              <Text style={styles.cardTitle}>{pillar.title}</Text>

              <View style={styles.pointsList}>
                {pillar.points.map((pt, i) => (
                  <View key={i} style={styles.pointRow}>
                    <View style={styles.dot} />
                    <Text style={styles.pointText}>{pt}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17181A',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  brandAccent: {
    color: '#FF5342', // Brand accent from spec
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#F5F5F5', // card-neutral-bg from spec
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17181A',
    marginBottom: 8,
  },
  pointsList: {
    gap: 6,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF5342',
    marginTop: 6,
  },
  pointText: {
    fontSize: 11,
    color: '#5B5F63',
    lineHeight: 15,
    flex: 1,
  },
});
