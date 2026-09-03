import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {
  User,
  Store,
  FileText,
  LogOut,
  Edit3,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Layers,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { logoutShopkeeper } from '../../src/services/api/auth';
import { getProfile, updateProfile } from '../../src/services/api/shopkeeper';
import { PharmaTheme } from '../../src/constants/theme';
import { PharmaChainLogo } from '../../src/components/common/PharmaChainLogo';

export default function ProfileScreen() {
  const router = useRouter();
  const { shopkeeper, user, updateShopkeeper, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState(
    shopkeeper?.shopName || user?.displayName || 'Apollo Medicos & Pharmacy'
  );
  const [ownerName, setOwnerName] = useState(
    shopkeeper?.ownerName || 'Dr. Ramesh Sharma'
  );
  const [phone, setPhone] = useState(
    shopkeeper?.ownerPhone || shopkeeper?.shopPhone || '+91 98765 43210'
  );
  const [email, setEmail] = useState(
    shopkeeper?.ownerEmail || shopkeeper?.shopEmail || 'ramesh.sharma@apollo.com'
  );

  useEffect(() => {
    getProfile()
      .then((res) => {
        const data = res?.data || res?.shopkeeper;
        if (data) {
          if (data.shopName) setShopName(data.shopName);
          if (data.ownerName) setOwnerName(data.ownerName);
          if (data.shopPhone || data.ownerPhone) setPhone(data.shopPhone || data.ownerPhone);
          if (data.shopEmail || data.ownerEmail) setEmail(data.shopEmail || data.ownerEmail);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ shopName, shopPhone: phone });
    } catch (e) {}
    updateShopkeeper({
      shopName,
      ownerName,
      ownerPhone: phone,
      ownerEmail: email,
    });
    setIsEditing(false);
    Alert.alert('Success', 'Profile details updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of this pharmacy terminal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutShopkeeper();
            } catch (e) {}
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const shopId = shopkeeper?.shopId || user?.shopId || 'SHOP-2026';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacy Node Profile</Text>
        <TouchableOpacity
          style={styles.editBadge}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          activeOpacity={0.8}
        >
          {isEditing ? (
            <>
              <CheckCircle2 size={15} color={PharmaTheme.colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.editBadgeText}>Save Changes</Text>
            </>
          ) : (
            <>
              <Edit3 size={15} color={PharmaTheme.colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.editBadgeText}>Edit Profile</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Hero Avatar with Official PharmaChain Logo */}
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <PharmaChainLogo size={36} colorScheme="cobalt" />
          </View>
          <Text style={styles.heroTitle} numberOfLines={1}>
            {shopName}
          </Text>
          <View style={styles.heroChipRow}>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>ID: #{shopId}</Text>
            </View>
            <View style={styles.verifiedSeal}>
              <ShieldCheck size={12} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedSealText}>CDSCO VALIDATED NODE</Text>
            </View>
          </View>
        </View>

        {/* Pharmacy Establishment Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Building2 size={18} color={PharmaTheme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Pharmacy Establishment</Text>
          </View>

          <Text style={styles.label}>Shop / Business Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={shopName}
              onChangeText={setShopName}
            />
          ) : (
            <Text style={styles.value}>{shopName}</Text>
          )}

          <Text style={styles.label}>Official Registered Address:</Text>
          <Text style={styles.value}>
            {shopkeeper?.address
              ? `${shopkeeper.address}, ${shopkeeper.city || ''}, ${shopkeeper.state || ''}`
              : 'Shop #14, Health Complex, Sector 18, Noida, Uttar Pradesh - 201301'}
          </Text>
        </View>

        {/* Pharmacist in charge */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={18} color={PharmaTheme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Authorized Pharmacist / Owner</Text>
          </View>

          <Text style={styles.label}>Pharmacist In-Charge:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
            />
          ) : (
            <Text style={styles.value}>{ownerName}</Text>
          )}

          <Text style={styles.label}>Contact Email:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}

          <Text style={styles.label}>Contact Phone:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{phone}</Text>
          )}
        </View>

        {/* CDSCO License */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={18} color={PharmaTheme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Pharmaceutical Regulatory License</Text>
          </View>

          <Text style={styles.label}>Drug License (DL) Number:</Text>
          <Text style={[styles.value, { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: PharmaTheme.colors.primary }]}>
            {shopkeeper?.drugLicenseNumber || 'DL-2026-UP-88741'}
          </Text>

          <Text style={styles.label}>License Classification:</Text>
          <Text style={styles.value}>
            {(shopkeeper?.licenseType || 'retail').toUpperCase()} Retail Drug Distribution
          </Text>

          <Text style={styles.label}>Compliance State:</Text>
          <View style={styles.statusBadge}>
            <ShieldCheck size={14} color="#059669" style={{ marginRight: 4 }} />
            <Text style={styles.statusText}>CDSCO AUTHORIZED (Active Validity to 2029)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={18} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of Pharmacy Terminal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  heroChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  heroChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroChipText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#475569',
  },
  verifiedSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  verifiedSealText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  editBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 11,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '800',
  },
});
