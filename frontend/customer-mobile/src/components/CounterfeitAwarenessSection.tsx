import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AlertTriangle,
  HeartCrack,
  Brain,
  ShieldAlert,
  FileWarning,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  qrToken?: string;
  medicineName?: string;
}

export default function CounterfeitAwarenessSection({
  qrToken,
  medicineName,
}: Props) {
  const router = useRouter();

  const risks = [
    {
      id: 'health',
      title: 'Health Deterioration',
      desc: 'Condition may worsen with harmful ingredients or zero active molecules.',
      icon: HeartCrack,
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
    },
    {
      id: 'psychological',
      title: 'Psychological Impact',
      desc: 'Can cause severe anxiety, lack of recovery, or loss of medical trust.',
      icon: Brain,
      color: '#d97706',
      bg: '#fefce8',
      border: '#fef08a',
    },
    {
      id: 'allergic',
      title: 'Allergic Reactions',
      desc: 'Rashes, swelling, or toxic responses from unverified industrial fillers.',
      icon: AlertTriangle,
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fed7aa',
    },
    {
      id: 'unpredictable',
      title: 'Unpredictable Toxicity',
      desc: 'Severe side-effects and organ strain from impure chemical isomers.',
      icon: ShieldAlert,
      color: '#ff5a36',
      bg: '#fff5f5',
      border: '#fed7d7',
    },
  ];

  const newsItems = [
    {
      id: 'n1',
      tag: 'CDSCO ADVISORY',
      headline: 'State Drug Control Raids Intercept Duplicate Blister Foils in Regional Markets',
      source: 'National Pharmacovigilance Bulletin',
    },
    {
      id: 'n2',
      tag: 'ALERT',
      headline: 'Spurious Pediatric Suspensions Without Active Potency Flagged in Health Advisory',
      source: 'Central Drugs Standard Control Organisation',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Risks Grid */}
      <View style={styles.headerRow}>
        <AlertTriangle size={18} color="#e11d48" />
        <Text style={styles.headerTitle}>
          What can be the risks of consuming fake medicines?
        </Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Spurious and counterfeit drugs pose critical dangers to patient health and treatment recovery.
      </Text>

      <View style={styles.riskGrid}>
        {risks.map((risk) => {
          const Icon = risk.icon;
          return (
            <View
              key={risk.id}
              style={[
                styles.riskCard,
                { backgroundColor: risk.bg, borderColor: risk.border },
              ]}
            >
              <View
                style={[styles.riskIconCircle, { backgroundColor: '#ffffff' }]}
              >
                <Icon size={20} color={risk.color} />
              </View>
              <Text style={styles.riskTitle}>{risk.title}</Text>
              <Text style={styles.riskDesc}>{risk.desc}</Text>
            </View>
          );
        })}
      </View>

      {/* 2. Real World Case Bulletins */}
      <View style={styles.newsSection}>
        <View style={styles.newsHeaderRow}>
          <FileWarning size={16} color="#1c1917" />
          <Text style={styles.newsSectionTitle}>
            Real-life reports of spurious medicines
          </Text>
        </View>

        {newsItems.map((news) => (
          <View key={news.id} style={styles.newsCard}>
            <View style={styles.newsTagPill}>
              <Text style={styles.newsTagText}>{news.tag}</Text>
            </View>
            <Text style={styles.newsHeadline}>{news.headline}</Text>
            <Text style={styles.newsSource}>{news.source}</Text>
          </View>
        ))}
      </View>

      {/* 3. Safety Banner & Direct Report CTA */}
      <View style={styles.actionBanner}>
        <View style={styles.actionBannerLeft}>
          <Text style={styles.actionBannerTitle}>
            Let's take care of your health & peace of mind
          </Text>
          <Text style={styles.actionBannerSubtitle}>
            If you suspect any discrepancy in your medicine's seal, packaging, or QR verification, report it immediately.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reportActionBtn}
          onPress={() =>
            router.push({
              pathname: '/report',
              params: {
                qrToken: qrToken || 'AWARENESS-REPORT',
                medicineName: medicineName || 'Suspected Batch',
              },
            })
          }
          activeOpacity={0.85}
        >
          <ShieldAlert size={16} color="#ffffff" />
          <Text style={styles.reportActionBtnText}>Report Suspicious Medicine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1c1917',
    flex: 1,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#78716c',
    lineHeight: 17,
    marginBottom: 14,
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  riskCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#1c1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  riskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1c1917',
    marginBottom: 4,
  },
  riskDesc: {
    fontSize: 11,
    color: '#44403c',
    lineHeight: 15,
  },
  newsSection: {
    backgroundColor: '#fffaf5',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 16,
  },
  newsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  newsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1c1917',
  },
  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  newsTagPill: {
    backgroundColor: '#fff1f2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  newsTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#e11d48',
    letterSpacing: 0.5,
  },
  newsHeadline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1c1917',
    lineHeight: 17,
    marginBottom: 4,
  },
  newsSource: {
    fontSize: 10,
    color: '#78716c',
  },
  actionBanner: {
    backgroundColor: '#1c1917',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ffedd5',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  actionBannerLeft: {
    marginBottom: 14,
  },
  actionBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionBannerSubtitle: {
    fontSize: 12,
    color: '#d6d3d1',
    lineHeight: 17,
  },
  reportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff5a36',
    paddingVertical: 12,
    borderRadius: 14,
  },
  reportActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});
