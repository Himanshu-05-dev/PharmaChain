import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, RefreshCw, LogOut, ShieldAlert, Store } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { getVerificationStatus } from '../../src/services/api/auth';

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
      <View style={styles.card}>
        {/* Animated/Visual Icon */}
        <View style={styles.iconCircle}>
          <Clock size={48} color="#d97706" />
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
            <Text style={styles.infoLabel}>Shop ID:</Text>
            <Text style={[styles.infoValue, { color: '#4338ca', fontWeight: '700' }]}>
              {shopkeeper?.shopId || 'SHOP-PENDING'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>UNDER REVIEW</Text>
            </View>
          </View>
        </View>

        {/* Check Status Button */}
        <TouchableOpacity 
          style={[styles.checkBtn, isChecking && styles.disabledBtn]}
          onPress={handleCheckStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <RefreshCw size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.checkBtnText}>Check Status</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Logout</Text>
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
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pendingBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  checkBtn: {
    width: '100%',
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  checkBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.65,
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  },
});
