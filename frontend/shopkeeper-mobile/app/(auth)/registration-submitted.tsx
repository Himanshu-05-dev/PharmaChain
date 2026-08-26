import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Clock, LogIn, Store } from 'lucide-react-native';

export default function RegistrationSubmittedScreen() {
  const router = useRouter();
  const { shopId } = useLocalSearchParams<{ shopId?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <CheckCircle2 size={54} color="#16a34a" />
        </View>

        <Text style={styles.title}>Registration Submitted</Text>
        
        <Text style={styles.message}>
          Your shopkeeper account has been created successfully. Your pharmacy and license information will be reviewed by the drug control administration before you can access medicine traceability features.
        </Text>

        {/* Status Card */}
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Clock size={18} color="#d97706" style={{ marginRight: 6 }} />
            <Text style={styles.statusLabel}>Verification Status:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PENDING REVIEW</Text>
            </View>
          </View>
          {!!shopId && (
            <View style={styles.shopIdRow}>
              <Store size={16} color="#64748b" style={{ marginRight: 6 }} />
              <Text style={styles.shopIdText}>Shop ID: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{shopId}</Text></Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => router.replace('/(auth)/login')}
        >
          <LogIn size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Go to Login</Text>
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
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
  },
  badge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  shopIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
  },
  shopIdText: {
    fontSize: 13,
    color: '#78350f',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
