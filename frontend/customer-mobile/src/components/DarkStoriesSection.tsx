import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  AlertTriangle,
  HeartCrack,
  Brain,
  ShieldAlert,
  Flame,
  FileWarning,
  ExternalLink,
  MessageSquareWarning,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  qrToken?: string;
  medicineName?: string;
}

export default function DarkStoriesSection({
  qrToken,
  medicineName = 'Suspected Medicine',
}: Props) {
  const router = useRouter();

  const newsStories = [
    {
      id: 'story-1',
      title: "Spurious medicines sold like vegetables in Assam's weekly markets",
      source: 'The Sentinel',
      excerpt:
        'State enforcement units confiscated unverified duplicate blister packs lacking verifiable cryptographic barcodes across regional distributors.',
      tag: 'INVESTIGATION',
    },
    {
      id: 'story-2',
      title: "India's Toxic Cough Syrup Scare: What You Need to Know",
      source: 'NDTV Health',
      excerpt:
        'Substandard glycol contaminants detected in unauthorized manufacturing batches led to strict mandatory QR serial tracking on all schedules.',
      tag: 'ALERT',
    },
    {
      id: 'story-3',
      title: 'Counterfeit Antibiotic Foils Flagged by National Regulators',
      source: 'CDSCO Bulletin',
      excerpt:
        'Patients are advised to verify 2D DataMatrix provenance and manufacturer cryptographic signature before consuming high-potency antibiotics.',
      tag: 'REGULATORY',
    },
  ];

  const risks = [
    {
      id: 'health',
      title: 'Health Deterioration',
      desc: 'Condition may worsen with harmful ingredients or zero active molecules.',
      icon: HeartCrack,
    },
    {
      id: 'psychological',
      title: 'Psychological Impact',
      desc: 'Can cause severe anxiety, lack of recovery, or loss of medical trust.',
      icon: Brain,
    },
    {
      id: 'allergic',
      title: 'Allergic Reactions',
      desc: 'Rashes, swelling, or toxic responses from unverified industrial fillers.',
      icon: AlertTriangle,
    },
    {
      id: 'unpredictable',
      title: 'Unpredictable Reactions',
      desc: 'Severe side-effects and organ strain from impure chemical isomers.',
      icon: ShieldAlert,
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Row */}
      <View style={styles.header}>
        <View style={styles.headerTag}>
          <Flame size={12} color="#FF5342" />
          <Text style={styles.headerTagText}>PATIENT AWARENESS</Text>
        </View>
        <Text style={styles.heading}>
          Here are some real life stories of spurious medicines
        </Text>
      </View>

      {/* 2. Horizontal Snap News Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newsCarousel}
        pagingEnabled
      >
        {newsStories.map((story) => (
          <View key={story.id} style={styles.newsCard}>
            <View style={styles.newsTagPill}>
              <Text style={styles.newsTagText}>{story.tag}</Text>
            </View>
            <Text style={styles.newsTitle} numberOfLines={2}>
              {story.title}
            </Text>
            <Text style={styles.newsExcerpt} numberOfLines={3}>
              {story.excerpt}
            </Text>
            <View style={styles.newsFooter}>
              <Text style={styles.newsSource}>{story.source}</Text>
              <ExternalLink size={13} color="#FF5342" />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. "What can be the risks of consuming fake medicines?" */}
      <View style={styles.risksSection}>
        <Text style={styles.risksHeading}>
          What can be the risks of consuming fake medicines?
        </Text>

        <View style={styles.riskGrid}>
          {risks.map((risk) => {
            const Icon = risk.icon;
            return (
              <View key={risk.id} style={styles.riskCard}>
                <View style={styles.riskIconBox}>
                  <Icon size={18} color="#FF5342" />
                </View>
                <Text style={styles.riskTitle}>{risk.title}</Text>
                <Text style={styles.riskDesc}>{risk.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 4. "Let's take care of your health & peace of mind" Banner */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaHeading}>
          Let's take care of your health & peace of mind
        </Text>
        <Text style={styles.ctaSubtitle}>
          Suspect any packaging anomaly or seal tampering? Submit a direct regulatory complaint.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() =>
            router.push({
              pathname: '/report',
              params: { qrToken: qrToken || 'AWARENESS-REPORT', medicineName },
            })
          }
          activeOpacity={0.85}
        >
          <MessageSquareWarning size={16} color="#ffffff" />
          <Text style={styles.ctaButtonText}>Report Suspicious Medicine to CDSCO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A0E1E', // Dark maroon background (Section 3.6 of spec)
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginVertical: 18,
    marginHorizontal: -8,
  },
  header: {
    marginBottom: 16,
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 83, 66, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FF5342',
    letterSpacing: 0.6,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  newsCarousel: {
    gap: 14,
    paddingRight: 10,
    marginBottom: 24,
  },
  newsCard: {
    width: SCREEN_WIDTH * 0.76,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
  },
  newsTagPill: {
    backgroundColor: '#FBD9DC',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newsTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F9584B',
    letterSpacing: 0.5,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17181A',
    lineHeight: 19,
    marginBottom: 6,
  },
  newsExcerpt: {
    fontSize: 12,
    color: '#5B5F63',
    lineHeight: 16,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 8,
  },
  newsSource: {
    fontSize: 11,
    fontWeight: '700',
    color: '#17181A',
  },
  risksSection: {
    marginBottom: 20,
  },
  risksHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
    lineHeight: 24,
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  riskCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  riskIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 83, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  riskDesc: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 15,
  },
  ctaBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 83, 66, 0.3)',
  },
  ctaHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 17,
    marginBottom: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF5342',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
