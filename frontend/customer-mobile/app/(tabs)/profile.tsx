import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import {
  User,
  Mail,
  Camera,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Phone,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState((user as any)?.displayName || 'Verified Patient');
  const [email, setEmail] = useState((user as any)?.email || 'patient@pharmachain.gov.in');
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleSave = () => {
    if (Platform.OS === 'web') {
      window.alert('Patient profile updated successfully!');
    } else {
      Alert.alert('Success', 'Patient profile updated successfully!');
    }
  };

  const handleLogout = () => {
    try {
      if (typeof logout === 'function') {
        logout();
      }
      if (typeof setAuth === 'function') {
        setAuth(null);
      }
    } catch (e) {
      console.warn('Logout error:', e);
    }
    router.replace('/(public)/home');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 20) + 12,
              paddingBottom: (insets.bottom || 10) + 30,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Patient Profile</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.verifiedText}>KYC Verified</Text>
            </View>
          </View>

          {/* Avatar Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                <Camera size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.avatarName}>{name}</Text>
                <CheckCircle2 size={16} color="#3b00b9" />
              </View>
              <Text style={styles.avatarEmail}>{email}</Text>
              <View style={styles.patientIdPill}>
                <Text style={styles.patientIdText}>ID: #PC-889214 • PharmaChain Node</Text>
              </View>
            </View>
          </View>

          {/* Personal Info Form */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <User size={18} color="#3b00b9" />
              <Text style={styles.sectionTitle}>Account Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Save Profile Updates</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut size={18} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Sign Out of Patient Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b00b9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0f172a',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  avatarEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  patientIdPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  patientIdText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  saveBtn: {
    backgroundColor: '#3b00b9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 6,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
});
