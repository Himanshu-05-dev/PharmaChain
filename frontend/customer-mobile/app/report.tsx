import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bell, Camera, FileText, QrCode, Calendar, MapPin, ChevronDown } from 'lucide-react-native';
import { useReportStore } from '../src/store/reportStore';
import { submitCounterfeitReport } from '../src/services/api/report.api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const router = useRouter();
  const { qrToken, medicineName: initialMedName } = useLocalSearchParams<{ qrToken?: string; medicineName?: string }>();
  const { addReport } = useReportStore();
  const insets = useSafeAreaInsets();

  const [medicineName, setMedicineName] = useState(initialMedName || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const renderUploadBox = (title: string, icon: React.ReactNode, isGreen: boolean = false) => (
    <TouchableOpacity style={styles.uploadBox}>
      {icon}
      <Text style={styles.uploadText}>{title}</Text>
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    if (!description.trim() && !medicineName.trim()) {
      Alert.alert('Details Required', 'Please enter medicine name and a description of the issue.');
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

      Alert.alert('Report Registered', `Report ${reportId} successfully lodged with CDSCO Incident Tracking.`);
      router.push('/(tabs)/reports');
    } catch (err) {
      addReport({
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
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Medicine</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Medicine Info Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Medicine Name</Text>
          <TextInput 
            style={styles.input}
            placeholder="E.g., Paracetamol 500mg"
            placeholderTextColor="#9ca3af"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <Text style={styles.label}>Why are you reporting this?</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Suspected Counterfeit</Text>
            <ChevronDown size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Upload Evidence */}
        <View style={styles.section}>
          <Text style={styles.label}>Upload Evidence</Text>
          <View style={styles.uploadGrid}>
            {renderUploadBox('Medicine Photo', <Camera size={24} color="#3b00b9" style={styles.uploadIcon} />)}
            {renderUploadBox('Invoice Photo', <FileText size={24} color="#10b981" style={styles.uploadIcon} />)}
            {renderUploadBox('QR Code Photo', <QrCode size={24} color="#3b00b9" style={styles.uploadIcon} />)}
            {renderUploadBox('Other Photo', <FileText size={24} color="#10b981" style={styles.uploadIcon} />)}
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Describe the issue (e.g. broken seal, blurry text)"
            placeholderTextColor="#9ca3af"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          
          <Text style={styles.label}>Where did you buy this?</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter Pharmacy / Seller Name"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Purchase Date</Text>
          <View style={styles.inputWithIcon}>
            <TextInput 
              style={styles.inputField}
              placeholder="Select Date"
              placeholderTextColor="#9ca3af"
              editable={false}
            />
            <Calendar size={20} color="#6b7280" />
          </View>

          <Text style={styles.label}>Location / Pharmacy (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <TextInput 
              style={styles.inputField}
              placeholder="E.g., Apollo Pharmacy, Sector 18"
              placeholderTextColor="#9ca3af"
              value={location}
              onChangeText={setLocation}
            />
            <MapPin size={20} color="#6b7280" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Incident Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 15,
    color: '#111827',
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#3b00b9',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
