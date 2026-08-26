import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { XCircle, Edit3, Headphones, LogOut, AlertTriangle } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function VerificationRejectedScreen() {
  const router = useRouter();
  const { shopkeeper, logout } = useAuthStore();

  const handleEditRegistration = () => {
    router.push('/(auth)/register');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Compliance Support',
      'Please email your drug license queries to support@mediacare.pharma or call +91 1800 123 4567.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Rejected Icon */}
        <View style={styles.iconCircle}>
          <XCircle size={52} color="#dc2626" />
        </View>

        <Text style={styles.title}>Verification Rejected</Text>
        
        <Text style={styles.message}>
          Your pharmacy registration could not be verified by the compliance review team.
        </Text>

        {/* Reason Box */}
        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <AlertTriangle size={18} color="#b91c1c" style={{ marginRight: 6 }} />
            <Text style={styles.reasonHeading}>Reason for Rejection:</Text>
          </View>
          <Text style={styles.reasonText}>
            {shopkeeper?.rejectionReason || 
              'The uploaded pharmaceutical license copy was either illegible, expired, or did not match the registered pharmacy address.'}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={handleEditRegistration}
        >
          <Edit3 size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Edit Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.supportBtn}
          onPress={handleContactSupport}
        >
          <Headphones size={18} color="#4338ca" style={{ marginRight: 8 }} />
          <Text style={styles.supportBtnText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#64748b" style={{ marginRight: 8 }} />
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
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fecaca',
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
    marginBottom: 20,
  },
  reasonCard: {
    width: '100%',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reasonHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991b1b',
  },
  reasonText: {
    fontSize: 13,
    color: '#7f1d1d',
    lineHeight: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  supportBtn: {
    width: '100%',
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  supportBtnText: {
    color: '#0f766e',
    fontSize: 15,
    fontWeight: '700',
  },
  logoutBtn: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
