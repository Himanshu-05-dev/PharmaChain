import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Clock, LogIn, Store, ArrowRight } from 'lucide-react-native';
import { PharmaTheme } from '../../src/constants/theme';
import { AnimatedAuthBackground } from '../../src/components/common/AnimatedAuthBackground';
import { PharmaChainLogo } from '../../src/components/common/PharmaChainLogo';

export default function RegistrationSubmittedScreen() {
  const router = useRouter();
  const { shopId } = useLocalSearchParams<{ shopId?: string }>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AnimatedAuthBackground />

      <View style={styles.card}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <CheckCircle2 size={46} color="#059669" />
        </View>

        <Text style={styles.title}>Registration Submitted</Text>
        
        <Text style={styles.message}>
          Your pharmacy establishment account has been created successfully. Your drug license credentials will be verified by the CDSCO Drug Control Administration before terminal activation.
        </Text>

        {/* Status Card */}
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Clock size={16} color="#d97706" style={{ marginRight: 6 }} />
            <Text style={styles.statusLabel}>Verification State:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PENDING CDSCO REVIEW</Text>
            </View>
          </View>
          {!!shopId && (
            <View style={styles.shopIdRow}>
              <Store size={15} color="#64748b" style={{ marginRight: 6 }} />
              <Text style={styles.shopIdText}>Terminal ID: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{shopId}</Text></Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.85}
        >
          <LogIn size={17} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Return to Sign In</Text>
          <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  badge: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#d97706',
  },
  shopIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  shopIdText: {
    fontSize: 12,
    color: '#64748b',
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
