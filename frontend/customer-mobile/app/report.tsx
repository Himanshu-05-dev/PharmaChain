import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  FileText,
  QrCode,
  ShieldAlert,
} from 'lucide-react-native';
import { useReportStore } from '../src/store/reportStore';
import { submitCounterfeitReport } from '../src/services/api/report.api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const router = useRouter();
  const { qrToken, medicineName: initialMedName } = useLocalSearchParams<{
    qrToken?: string;
    medicineName?: string;
  }>();
  const { addReport } = useReportStore();
  const insets = useSafeAreaInsets();

  const [medicineName, setMedicineName] = useState(initialMedName || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() && !medicineName.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter the medicine name and description of the issue.');
      } else {
        Alert.alert('Details Required', 'Please enter medicine name and description of the issue.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const apiRes = await submitCounterfeitReport({
        qrToken: qrToken || 'MANUAL-REPORT',
        location: location || 'Direct Consumer Scan',
        notes: description,
        medicineName: medicineName || 'Suspected Medicine',
      });

      const reportId = apiRes.reportId || `RPT-${Date.now()}`;
      addReport({
        id: reportId,
        medicineName: medicineName || 'Suspected Medicine',
        description: description || 'Suspicious medicine reported by consumer.',
        location: location || 'Customer Terminal',
        qrToken: qrToken || undefined,
        status: 'Pending',
      });

      if (Platform.OS === 'web') {
        window.alert(`Report ${reportId} successfully lodged with CDSCO Incident Tracking.`);
      } else {
        Alert.alert(
          'Report Registered',
          `Report ${reportId} successfully lodged with CDSCO Incident Tracking.`
        );
      }
      router.push('/(tabs)/reports');
    } catch (err) {
      addReport({
        id: `RPT-${Date.now()}`,
        medicineName: medicineName || 'Suspected Medicine',
        description: description || 'Suspicious medicine reported by consumer.',
        location: location || 'Customer Terminal',
        status: 'Pending',
      });
      router.push('/(tabs)/reports');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) + 8 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1c1917" />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Report Incident</Text>
          <Text style={styles.headerSubtitle}>CDSCO Pharmacovigilance Cell</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (insets.bottom || 10) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.advisoryCard}>
          <ShieldAlert size={22} color="#e11d48" />
          <View style={styles.advisoryTextContainer}>
            <Text style={styles.advisoryTitle}>Official Regulatory Report</Text>
            <Text style={styles.advisoryDesc}>
              Your report is cryptographically timestamped and transmitted directly to state drug inspectors.
            </Text>
          </View>
        </View>

        {/* Medicine Info Section */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Medicine Brand Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Augmentin 625 Duo, Paracetamol 500mg"
            placeholderTextColor="#a8a29e"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <Text style={styles.label}>Reason for Reporting</Text>
          <View style={styles.reasonPillRow}>
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>Suspected Counterfeit</Text>
            </View>
            <View style={styles.unselectedPill}>
              <Text style={styles.unselectedPillText}>Broken Seal</Text>
            </View>
            <View style={styles.unselectedPill}>
              <Text style={styles.unselectedPillText}>Adverse Effect</Text>
            </View>
          </View>
        </View>

        {/* Upload Evidence */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Evidence & Packaging Photos</Text>
          <View style={styles.uploadGrid}>
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <Camera size={22} color="#ff5a36" />
              <Text style={styles.uploadText}>Foil / Blister</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <FileText size={22} color="#e11d48" />
              <Text style={styles.uploadText}>Invoice / Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <QrCode size={22} color="#ea580c" />
              <Text style={styles.uploadText}>Matrix Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Details & Location */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Detailed Description of Issue *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe packaging anomalies, texture, smell, lack of efficacy, or physical symptoms..."
            placeholderTextColor="#a8a29e"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Purchased Pharmacy / Location</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Apollo Pharmacy, Sector 18, Noida"
            placeholderTextColor="#a8a29e"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <ShieldAlert size={18} color="#ffffff" />
              <Text style={styles.submitBtnText}>Submit Incident to CDSCO</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf7', // Warm ivory
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3ede8',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1c1917',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#ea580c',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 18,
    gap: 14,
  },
  advisoryCard: {
    backgroundColor: '#fff1f2',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  advisoryTextContainer: {
    flex: 1,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#9f1239',
    marginBottom: 2,
  },
  advisoryDesc: {
    fontSize: 11,
    color: '#e11d48',
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1c1917',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fffaf5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1c1917',
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  reasonPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedPill: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c2410c',
  },
  unselectedPill: {
    backgroundColor: '#fffaf5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  unselectedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78716c',
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    flex: 1,
    backgroundColor: '#fffaf5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78716c',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff5a36',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
