import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, Headphones, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function AccountSuspendedScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleContactSupport = () => {
    Alert.alert(
      'Compliance Support',
      'Your account access has been suspended due to compliance flags. Please reach out to legal@mediacare.pharma or contact +91 1800 123 4567.',
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
        {/* Suspended Warning Icon */}
        <View style={styles.iconCircle}>
          <ShieldAlert size={52} color="#dc2626" />
        </View>

        <Text style={styles.title}>Account Suspended</Text>
        
        <Text style={styles.message}>
          Your pharmacy account has been suspended by the regulatory system. Access to medicine verification, sales, and supply chain updates is currently disabled.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={handleContactSupport}
        >
          <Headphones size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Contact Support</Text>
        </TouchableOpacity>

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
    marginBottom: 28,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#4338ca',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4338ca',
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
