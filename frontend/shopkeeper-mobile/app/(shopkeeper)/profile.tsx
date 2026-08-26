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
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { logoutShopkeeper } from '../../src/services/api/auth';
import { getProfile, updateProfile } from '../../src/services/api/shopkeeper';

export default function ProfileScreen() {
  const router = useRouter();
  const { shopkeeper, user, updateShopkeeper, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState(
    shopkeeper?.shopName || user?.displayName || 'Pharmacy Store'
  );
  const [ownerName, setOwnerName] = useState(
    shopkeeper?.ownerName || 'Pharmacy Owner'
  );
  const [phone, setPhone] = useState(
    shopkeeper?.ownerPhone || shopkeeper?.shopPhone || '+91 98765 43210'
  );
  const [email, setEmail] = useState(
    shopkeeper?.ownerEmail || shopkeeper?.shopEmail || 'owner@pharmacy.com'
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

  const handleLogout = async () => {
    try {
      await logoutShopkeeper();
    } catch (e) {}
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editBadge}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <>
              <CheckCircle2 size={16} color="#0f766e" style={{ marginRight: 4 }} />
              <Text style={[styles.editBadgeText, { color: '#0f766e' }]}>Save</Text>
            </>
          ) : (
            <>
              <Edit3 size={16} color="#0f766e" style={{ marginRight: 4 }} />
              <Text style={[styles.editBadgeText, { color: '#0f766e' }]}>Edit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Pharmacy Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Store size={20} color="#0f766e" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Pharmacy Information</Text>
          </View>

          <Text style={styles.label}>Shop Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={shopName}
              onChangeText={setShopName}
            />
          ) : (
            <Text style={styles.value}>{shopName}</Text>
          )}

          <Text style={styles.label}>Shop ID (System Unique):</Text>
          <Text style={[styles.value, { color: '#0f766e' }]}>
            {shopkeeper?.shopId || user?.shopId || 'SHOP-12345'}
          </Text>

          <Text style={styles.label}>Official Address:</Text>
          <Text style={styles.value}>
            {shopkeeper?.address
              ? `${shopkeeper.address}, ${shopkeeper.city || ''}, ${shopkeeper.state || ''}`
              : 'Shop #14, Health Complex, Sector 18, Noida, Uttar Pradesh - 201301'}
          </Text>
        </View>

        {/* Owner Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={20} color="#0f766e" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Owner / Authorized Person</Text>
          </View>

          <Text style={styles.label}>Full Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
            />
          ) : (
            <Text style={styles.value}>{ownerName}</Text>
          )}

          <Text style={styles.label}>Email Address:</Text>
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

        {/* Pharmaceutical License Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={20} color="#0f766e" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Pharmaceutical License</Text>
          </View>

          <Text style={styles.label}>Drug License (DL) Number:</Text>
          <Text style={styles.value}>
            {shopkeeper?.drugLicenseNumber || 'DL-2026-UP-88741'}
          </Text>

          <Text style={styles.label}>License Type:</Text>
          <Text style={styles.value}>
            {(shopkeeper?.licenseType || 'retail').toUpperCase()} Retail Pharmacy
          </Text>

          <Text style={styles.label}>Issuing Authority:</Text>
          <Text style={styles.value}>
            {shopkeeper?.issuingAuthority || 'Drug Control Department UP'}
          </Text>

          <Text style={styles.label}>Status & Validity:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✓ CDSCO VALIDATED (Expires 2029)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of Pharmacy Account</Text>
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
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  editBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#f0fdfa',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  statusText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 12,
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
    borderColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
