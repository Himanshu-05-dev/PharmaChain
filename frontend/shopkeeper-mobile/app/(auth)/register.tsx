import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Building2, 
  User, 
  FileCheck2, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckSquare, 
  Square, 
  Trash2, 
  FileText, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react-native';
import { RegistrationForm } from '../../src/types/auth';
import { registerShopkeeper } from '../../src/services/api/auth';

const INITIAL_FORM: RegistrationForm = {
  shopName: '',
  shopPhone: '',
  shopEmail: '',
  address: '',
  city: '',
  state: '',
  pincode: '',

  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',

  drugLicenseNumber: '',
  licenseType: 'retail',
  issuingAuthority: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
  licenseDocument: null,

  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

export default function RegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<RegistrationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generic typed update function for single source of truth
  const updateField = <K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field if present
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  // Validate Step 1: Shop Info
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.shopName.trim()) newErrors.shopName = 'Shop name is required.';
    if (!form.shopPhone.trim()) newErrors.shopPhone = 'Shop phone number is required.';
    if (!form.shopEmail.trim()) {
      newErrors.shopEmail = 'Shop email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.shopEmail.trim())) {
      newErrors.shopEmail = 'Enter a valid email address.';
    }
    if (!form.address.trim()) newErrors.address = 'Street address is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!form.state.trim()) newErrors.state = 'State is required.';
    if (!form.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required.';
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2: Owner Info
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.ownerName.trim()) newErrors.ownerName = 'Owner/Authorized person name is required.';
    if (!form.ownerPhone.trim()) {
      newErrors.ownerPhone = 'Mobile number is required.';
    } else if (form.ownerPhone.trim().replace(/\D/g, '').length < 10) {
      newErrors.ownerPhone = 'Enter a valid 10-digit mobile number.';
    }
    if (!form.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail.trim())) {
      newErrors.ownerEmail = 'Enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3: License & Password
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.drugLicenseNumber.trim()) newErrors.drugLicenseNumber = 'Drug license number is required.';
    if (!form.issuingAuthority.trim()) newErrors.issuingAuthority = 'Issuing authority is required.';
    if (!form.licenseIssueDate.trim()) newErrors.licenseIssueDate = 'Issue date is required (YYYY-MM-DD).';
    if (!form.licenseExpiryDate.trim()) newErrors.licenseExpiryDate = 'Expiry date is required (YYYY-MM-DD).';
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!form.termsAccepted) {
      newErrors.termsAccepted = 'You must confirm that the provided information is accurate.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
    else router.back();
  };

  const handleSelectMockDocument = () => {
    // Select license document (mock picker for reliability across all devices)
    updateField('licenseDocument', {
      name: `Drug_License_${form.drugLicenseNumber || '2026'}.pdf`,
      size: 1024 * 340,
      mimeType: 'application/pdf'
    });
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      const response = await registerShopkeeper(form);
      if (response.success) {
        router.replace({
          pathname: '/(auth)/registration-submitted',
          params: { shopId: response.shopId || 'SHOP-PENDING' }
        });
      } else {
        Alert.alert('Registration Failed', response.message || 'Could not submit registration.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to submit registration. Please try again.';
      Alert.alert('Registration Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Pharmacy Registration</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Step Progress Tracker */}
        <View style={styles.progressContainer}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, currentStep >= 1 && styles.stepActive]}>
              <Building2 size={16} color={currentStep >= 1 ? '#ffffff' : '#94a3b8'} />
            </View>
            <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>1. Shop</Text>
          </View>

          <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, currentStep >= 2 && styles.stepActive]}>
              <User size={16} color={currentStep >= 2 ? '#ffffff' : '#94a3b8'} />
            </View>
            <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>2. Owner</Text>
          </View>

          <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, currentStep >= 3 && styles.stepActive]}>
              <FileCheck2 size={16} color={currentStep >= 3 ? '#ffffff' : '#94a3b8'} />
            </View>
            <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>3. License</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* STEP 1: SHOP INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <View style={styles.formCard}>
            <Text style={styles.stepHeading}>Shop Information</Text>
            <Text style={styles.stepSubheading}>Tell us about your pharmacy store</Text>

            {/* Shop Name */}
            <Text style={styles.label}>Pharmacy / Shop Name *</Text>
            <TextInput
              style={[styles.input, !!errors.shopName && styles.inputError]}
              placeholder="E.g., Apollo Medicos & Clinic"
              placeholderTextColor="#94a3b8"
              value={form.shopName}
              onChangeText={(val) => updateField('shopName', val)}
            />
            {!!errors.shopName && <Text style={styles.errorText}>{errors.shopName}</Text>}

            {/* Shop Phone */}
            <Text style={styles.label}>Shop Landline / Phone *</Text>
            <TextInput
              style={[styles.input, !!errors.shopPhone && styles.inputError]}
              placeholder="E.g., +91 11 2345 6789"
              placeholderTextColor="#94a3b8"
              value={form.shopPhone}
              onChangeText={(val) => updateField('shopPhone', val)}
              keyboardType="phone-pad"
            />
            {!!errors.shopPhone && <Text style={styles.errorText}>{errors.shopPhone}</Text>}

            {/* Shop Email */}
            <Text style={styles.label}>Shop Official Email *</Text>
            <TextInput
              style={[styles.input, !!errors.shopEmail && styles.inputError]}
              placeholder="E.g., contact@apollomedicos.com"
              placeholderTextColor="#94a3b8"
              value={form.shopEmail}
              onChangeText={(val) => updateField('shopEmail', val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!errors.shopEmail && <Text style={styles.errorText}>{errors.shopEmail}</Text>}

            {/* Address */}
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={[styles.input, !!errors.address && styles.inputError]}
              placeholder="Shop No, Building, Market Area"
              placeholderTextColor="#94a3b8"
              value={form.address}
              onChangeText={(val) => updateField('address', val)}
            />
            {!!errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            {/* City & State row */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={[styles.input, !!errors.city && styles.inputError]}
                  placeholder="Noida"
                  placeholderTextColor="#94a3b8"
                  value={form.city}
                  onChangeText={(val) => updateField('city', val)}
                />
                {!!errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={[styles.input, !!errors.state && styles.inputError]}
                  placeholder="Uttar Pradesh"
                  placeholderTextColor="#94a3b8"
                  value={form.state}
                  onChangeText={(val) => updateField('state', val)}
                />
                {!!errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
              </View>
            </View>

            {/* PIN Code */}
            <Text style={styles.label}>PIN Code *</Text>
            <TextInput
              style={[styles.input, !!errors.pincode && styles.inputError]}
              placeholder="6-digit PIN code (e.g. 201301)"
              placeholderTextColor="#94a3b8"
              value={form.pincode}
              onChangeText={(val) => updateField('pincode', val)}
              keyboardType="numeric"
              maxLength={6}
            />
            {!!errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}

            {/* Continue Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryBtnText}>Continue to Owner Details</Text>
              <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: OWNER INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <View style={styles.formCard}>
            <Text style={styles.stepHeading}>Owner Information</Text>
            <Text style={styles.stepSubheading}>Details of the licensed pharmacist or store owner</Text>

            {/* Owner Name */}
            <Text style={styles.label}>Owner / Pharmacist Full Name *</Text>
            <TextInput
              style={[styles.input, !!errors.ownerName && styles.inputError]}
              placeholder="Dr. / Mr. Ramesh Sharma"
              placeholderTextColor="#94a3b8"
              value={form.ownerName}
              onChangeText={(val) => updateField('ownerName', val)}
            />
            {!!errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}

            {/* Owner Mobile */}
            <Text style={styles.label}>Personal Mobile Number *</Text>
            <TextInput
              style={[styles.input, !!errors.ownerPhone && styles.inputError]}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94a3b8"
              value={form.ownerPhone}
              onChangeText={(val) => updateField('ownerPhone', val)}
              keyboardType="phone-pad"
            />
            {!!errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone}</Text>}

            {/* Owner Email */}
            <Text style={styles.label}>Personal / Login Email *</Text>
            <TextInput
              style={[styles.input, !!errors.ownerEmail && styles.inputError]}
              placeholder="ramesh.sharma@gmail.com"
              placeholderTextColor="#94a3b8"
              value={form.ownerEmail}
              onChangeText={(val) => updateField('ownerEmail', val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!errors.ownerEmail && <Text style={styles.errorText}>{errors.ownerEmail}</Text>}

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleBack}>
                <Text style={styles.secondaryBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 2, marginLeft: 12 }]} onPress={handleNext}>
                <Text style={styles.primaryBtnText}>Continue to License</Text>
                <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PHARMACEUTICAL LICENSE & PASSWORD */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <View style={styles.formCard}>
            <Text style={styles.stepHeading}>Pharmaceutical License</Text>
            <Text style={styles.stepSubheading}>Provide your regulatory license credentials</Text>

            {/* Drug License Number */}
            <Text style={styles.label}>Drug License (DL) Number *</Text>
            <TextInput
              style={[styles.input, !!errors.drugLicenseNumber && styles.inputError]}
              placeholder="DL-2026-UP-88741"
              placeholderTextColor="#94a3b8"
              value={form.drugLicenseNumber}
              onChangeText={(val) => updateField('drugLicenseNumber', val)}
              autoCapitalize="characters"
            />
            {!!errors.drugLicenseNumber && <Text style={styles.errorText}>{errors.drugLicenseNumber}</Text>}

            {/* License Type Dropdown / Segmented */}
            <Text style={styles.label}>License Type *</Text>
            <View style={styles.segmentedContainer}>
              {(['retail', 'wholesale', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.segmentOption,
                    form.licenseType === type && styles.segmentOptionActive
                  ]}
                  onPress={() => updateField('licenseType', type)}
                >
                  <Text style={[
                    styles.segmentText,
                    form.licenseType === type && styles.segmentTextActive
                  ]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Issuing Authority */}
            <Text style={styles.label}>Issuing Authority *</Text>
            <TextInput
              style={[styles.input, !!errors.issuingAuthority && styles.inputError]}
              placeholder="State Drug Control Administration"
              placeholderTextColor="#94a3b8"
              value={form.issuingAuthority}
              onChangeText={(val) => updateField('issuingAuthority', val)}
            />
            {!!errors.issuingAuthority && <Text style={styles.errorText}>{errors.issuingAuthority}</Text>}

            {/* License Dates */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Issue Date *</Text>
                <TextInput
                  style={[styles.input, !!errors.licenseIssueDate && styles.inputError]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                  value={form.licenseIssueDate}
                  onChangeText={(val) => updateField('licenseIssueDate', val)}
                />
                {!!errors.licenseIssueDate && <Text style={styles.errorText}>{errors.licenseIssueDate}</Text>}
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Expiry Date *</Text>
                <TextInput
                  style={[styles.input, !!errors.licenseExpiryDate && styles.inputError]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                  value={form.licenseExpiryDate}
                  onChangeText={(val) => updateField('licenseExpiryDate', val)}
                />
                {!!errors.licenseExpiryDate && <Text style={styles.errorText}>{errors.licenseExpiryDate}</Text>}
              </View>
            </View>

            {/* License Document Upload */}
            <Text style={styles.label}>Upload License Copy (PDF / JPG / PNG)</Text>
            {form.licenseDocument ? (
              <View style={styles.documentPreview}>
                <FileText size={22} color="#0f766e" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName} numberOfLines={1}>{form.licenseDocument.name}</Text>
                  <Text style={styles.docSize}>Document attached</Text>
                </View>
                <TouchableOpacity onPress={() => updateField('licenseDocument', null)}>
                  <Trash2 size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={handleSelectMockDocument}>
                <Upload size={24} color="#0f766e" style={{ marginBottom: 6 }} />
                <Text style={styles.uploadTitle}>Tap to Select License Document</Text>
                <Text style={styles.uploadSubtitle}>PDF, PNG, JPG up to 10MB</Text>
              </TouchableOpacity>
            )}

            {/* Password */}
            <Text style={[styles.label, { marginTop: 14 }]}>Account Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#94a3b8"
                value={form.password}
                onChangeText={(val) => updateField('password', val)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter password"
                placeholderTextColor="#94a3b8"
                value={form.confirmPassword}
                onChangeText={(val) => updateField('confirmPassword', val)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
              </TouchableOpacity>
            </View>
            {!!errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => updateField('termsAccepted', !form.termsAccepted)}
            >
              {form.termsAccepted ? (
                <CheckSquare size={22} color="#0f766e" />
              ) : (
                <Square size={22} color="#94a3b8" />
              )}
              <Text style={styles.checkboxLabel}>
                I confirm that the pharmaceutical license and store information provided are genuine and accurate.
              </Text>
            </TouchableOpacity>
            {!!errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleBack} disabled={isLoading}>
                <Text style={styles.secondaryBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryBtn, { flex: 2, marginLeft: 12 }, isLoading && styles.disabledBtn]} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 6,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: '#0f766e',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stepLabelActive: {
    color: '#0f766e',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#0f766e',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stepHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  stepSubheading: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.65,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  segmentOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentOptionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentTextActive: {
    color: '#0f766e',
    fontWeight: '700',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#99f6e4',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdfa',
    marginBottom: 14,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f766e',
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  docName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  docSize: {
    fontSize: 11,
    color: '#64748b',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeBtn: {
    padding: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 14,
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
