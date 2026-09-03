import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, RefreshCw, LogOut, ShieldAlert, Store } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { getVerificationStatus } from '../../src/services/api/auth';
import { PharmaTheme } from '../../src/constants/theme';
import { AnimatedAuthBackground } from '../../src/components/common/AnimatedAuthBackground';

export default function VerificationPendingScreen() {
  const router = useRouter();
  const { shopkeeper, logout, setVerificationStatus } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const response = await getVerificationStatus();
      if (response.success && response.verificationStatus) {
        setVerificationStatus(response.verificationStatus);

        if (response.verificationStatus === 'verified') {
          Alert.alert('Congratulations!', 'Your pharmacy has been approved! Navigating to dashboard.');
          router.replace('/(shopkeeper)/dashboard');
        } else if (response.verificationStatus === 'rejected') {
          router.replace('/(auth)/verification-rejected');
        } else if (response.verificationStatus === 'suspended') {
          router.replace('/(auth)/account-suspended');
        } else {
          Alert.alert('Status Update', 'Your registration is still under review by the authority.');
        }
      }
    } catch (err: any) {
      Alert.alert('Status Check', 'Could not check status right now. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AnimatedAuthBackground />

      <View style={styles.card}>
        {/* Animated/Visual Icon */}
        <View style={styles.iconCircle}>
          <Clock size={44} color="#d97706" />
        </View>

        <Text style={styles.title}>Verification Pending</Text>
        
        <Text style={styles.message}>
          Your pharmacy details, store identity, and drug control license are currently under review by the compliance team.
        </Text>

        {/* Info Container */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shop Name:</Text>
            <Text style={styles.infoValue}>{shopkeeper?.shopName || 'Registered Pharmacy'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner Name:</Text>
            <Text style={styles.infoValue}>{shopkeeper?.ownerName || 'Authorized Pharmacist'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Drug License:</Text>
            <Text style={[styles.infoValue, { color: PharmaTheme.colors.primary }]}>
              {shopkeeper?.drugLicenseNumber || 'DL-PENDING'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.primaryBtn, isChecking && styles.primaryBtnDisabled]}
          onPress={handleCheckStatus}
          disabled={isChecking}
          activeOpacity={0.85}
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.btnRow}>
              <RefreshCw size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Refresh Approval Status</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#dc2626" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
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
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
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
  infoCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.65,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
