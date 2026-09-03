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
  Alert,
  StatusBar,
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
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react-native';
import { RegistrationForm } from '../../src/types/auth';
import { registerShopkeeper } from '../../src/services/api/auth';
import { PharmaTheme } from '../../src/constants/theme';
import { PharmaChainLogo } from '../../src/components/common/PharmaChainLogo';
import { AnimatedAuthBackground } from '../../src/components/common/AnimatedAuthBackground';

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

  const updateField = <K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    if (!form.ownerName.trim()) newErrors.ownerName = 'Owner/Authorized pharmacist name is required.';
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AnimatedAuthBackground />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.8}>
              <ArrowLeft size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Pharmacy Registration</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Step Progress Tracker */}
          <View style={styles.progressContainer}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 1 && styles.stepActive]}>
                <Building2 size={15} color={currentStep >= 1 ? '#ffffff' : '#94a3b8'} />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>1. Shop</Text>
            </View>

            <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 2 && styles.stepActive]}>
                <User size={15} color={currentStep >= 2 ? '#ffffff' : '#94a3b8'} />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>2. Owner</Text>
            </View>

            <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 3 && styles.stepActive]}>
                <FileCheck2 size={15} color={currentStep >= 3 ? '#ffffff' : '#94a3b8'} />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>3. License</Text>
            </View>
          </View>

          {/* Step Form Card */}
          <View style={styles.card}>
            {/* STEP 1: SHOP INFORMATION */}
            {currentStep === 1 && (
              <View>
                <Text style={styles.stepHeading}>Establishment Details</Text>
                <Text style={styles.stepSubheading}>Enter official pharmacy registration information</Text>

                {/* Shop Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Pharmacy / Shop Name *</Text>
                  <TextInput
                    style={[styles.input, errors.shopName && styles.inputError]}
                    placeholder="e.g., Apollo Medicos & Pharmacy"
                    placeholderTextColor="#94a3b8"
                    value={form.shopName}
                    onChangeText={(val) => updateField('shopName', val)}
                  />
                  {!!errors.shopName && <Text style={styles.errorText}>{errors.shopName}</Text>}
                </View>

                {/* Shop Phone & Email */}
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Shop Phone *</Text>
                    <TextInput
                      style={[styles.input, errors.shopPhone && styles.inputError]}
                      placeholder="e.g., 9876543210"
                      placeholderTextColor="#94a3b8"
                      value={form.shopPhone}
                      onChangeText={(val) => updateField('shopPhone', val)}
                      keyboardType="phone-pad"
                    />
                    {!!errors.shopPhone && <Text style={styles.errorText}>{errors.shopPhone}</Text>}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Shop Email *</Text>
                    <TextInput
                      style={[styles.input, errors.shopEmail && styles.inputError]}
                      placeholder="shop@domain.com"
                      placeholderTextColor="#94a3b8"
                      value={form.shopEmail}
                      onChangeText={(val) => updateField('shopEmail', val)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {!!errors.shopEmail && <Text style={styles.errorText}>{errors.shopEmail}</Text>}
                  </View>
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Premise / Shop Address *</Text>
                  <TextInput
                    style={[styles.input, { height: 70, textAlignVertical: 'top' }, errors.address && styles.inputError]}
                    placeholder="Full physical address"
                    placeholderTextColor="#94a3b8"
                    value={form.address}
                    onChangeText={(val) => updateField('address', val)}
                    multiline
                  />
                  {!!errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                </View>

                {/* City, State, PIN */}
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
                    <Text style={styles.inputLabel}>City *</Text>
                    <TextInput
                      style={[styles.input, errors.city && styles.inputError]}
                      placeholder="e.g., Noida"
                      placeholderTextColor="#94a3b8"
                      value={form.city}
                      onChangeText={(val) => updateField('city', val)}
                    />
                    {!!errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 3 }]}>
                    <Text style={styles.inputLabel}>State *</Text>
                    <TextInput
                      style={[styles.input, errors.state && styles.inputError]}
                      placeholder="e.g., Uttar Pradesh"
                      placeholderTextColor="#94a3b8"
                      value={form.state}
                      onChangeText={(val) => updateField('state', val)}
                    />
                    {!!errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                  </View>

                  <View style={[styles.inputGroup, { flex: 0.9, marginLeft: 6 }]}>
                    <Text style={styles.inputLabel}>PIN Code *</Text>
                    <TextInput
                      style={[styles.input, errors.pincode && styles.inputError]}
                      placeholder="201301"
                      placeholderTextColor="#94a3b8"
                      value={form.pincode}
                      onChangeText={(val) => updateField('pincode', val)}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    {!!errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
                  </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Proceed to Owner Details</Text>
                  <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: OWNER INFORMATION */}
            {currentStep === 2 && (
              <View>
                <Text style={styles.stepHeading}>Authorized Pharmacist / Owner</Text>
                <Text style={styles.stepSubheading}>Details of the licensed practitioner in charge</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Legal Name *</Text>
                  <TextInput
                    style={[styles.input, errors.ownerName && styles.inputError]}
                    placeholder="e.g., Dr. Ramesh Sharma"
                    placeholderTextColor="#94a3b8"
                    value={form.ownerName}
                    onChangeText={(val) => updateField('ownerName', val)}
                  />
                  {!!errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Registered Mobile Number *</Text>
                  <TextInput
                    style={[styles.input, errors.ownerPhone && styles.inputError]}
                    placeholder="e.g., 9876543210"
                    placeholderTextColor="#94a3b8"
                    value={form.ownerPhone}
                    onChangeText={(val) => updateField('ownerPhone', val)}
                    keyboardType="phone-pad"
                  />
                  {!!errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Personal / Official Email *</Text>
                  <TextInput
                    style={[styles.input, errors.ownerEmail && styles.inputError]}
                    placeholder="ramesh.sharma@domain.com"
                    placeholderTextColor="#94a3b8"
                    value={form.ownerEmail}
                    onChangeText={(val) => updateField('ownerEmail', val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {!!errors.ownerEmail && <Text style={styles.errorText}>{errors.ownerEmail}</Text>}
                </View>

                <View style={styles.row}>
                  <TouchableOpacity style={[styles.secondaryBtn, { flex: 1, marginRight: 8 }]} onPress={handleBack} activeOpacity={0.8}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.primaryBtn, { flex: 2, marginLeft: 8 }]} onPress={handleNext} activeOpacity={0.85}>
                    <Text style={styles.primaryBtnText}>Proceed to License</Text>
                    <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 3: LICENSE & CREDENTIALS */}
            {currentStep === 3 && (
              <View>
                <Text style={styles.stepHeading}>CDSCO Drug License</Text>
                <Text style={styles.stepSubheading}>Regulatory compliance and terminal authentication credentials</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Drug License (DL) Number *</Text>
                  <TextInput
                    style={[styles.input, errors.drugLicenseNumber && styles.inputError]}
                    placeholder="e.g., 20B/21B-UP-2026-8874"
                    placeholderTextColor="#94a3b8"
                    value={form.drugLicenseNumber}
                    onChangeText={(val) => updateField('drugLicenseNumber', val)}
                    autoCapitalize="characters"
                  />
                  {!!errors.drugLicenseNumber && <Text style={styles.errorText}>{errors.drugLicenseNumber}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Issuing State Authority *</Text>
                  <TextInput
                    style={[styles.input, errors.issuingAuthority && styles.inputError]}
                    placeholder="e.g., Food and Drug Administration UP"
                    placeholderTextColor="#94a3b8"
                    value={form.issuingAuthority}
                    onChangeText={(val) => updateField('issuingAuthority', val)}
                  />
                  {!!errors.issuingAuthority && <Text style={styles.errorText}>{errors.issuingAuthority}</Text>}
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Issue Date *</Text>
                    <TextInput
                      style={[styles.input, errors.licenseIssueDate && styles.inputError]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94a3b8"
                      value={form.licenseIssueDate}
                      onChangeText={(val) => updateField('licenseIssueDate', val)}
                    />
                    {!!errors.licenseIssueDate && <Text style={styles.errorText}>{errors.licenseIssueDate}</Text>}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Expiry Date *</Text>
                    <TextInput
                      style={[styles.input, errors.licenseExpiryDate && styles.inputError]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94a3b8"
                      value={form.licenseExpiryDate}
                      onChangeText={(val) => updateField('licenseExpiryDate', val)}
                    />
                    {!!errors.licenseExpiryDate && <Text style={styles.errorText}>{errors.licenseExpiryDate}</Text>}
                  </View>
                </View>

                {/* Document Upload Button */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Upload Drug License PDF</Text>
                  {form.licenseDocument ? (
                    <View style={styles.uploadedDocBadge}>
                      <FileText size={16} color="#2563eb" />
                      <Text style={styles.uploadedDocName} numberOfLines={1}>
                        {form.licenseDocument.name}
                      </Text>
                      <TouchableOpacity onPress={() => updateField('licenseDocument', null)}>
                        <Trash2 size={16} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.uploadDocBtn} onPress={handleSelectMockDocument} activeOpacity={0.8}>
                      <Upload size={16} color="#2563eb" style={{ marginRight: 6 }} />
                      <Text style={styles.uploadDocText}>Select PDF Document</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Password Fields */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Set Terminal Password *</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, { flex: 1, borderWidth: 0 }, errors.password && styles.inputError]}
                      placeholder="Minimum 6 characters"
                      placeholderTextColor="#94a3b8"
                      value={form.password}
                      onChangeText={(val) => updateField('password', val)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                    </TouchableOpacity>
                  </View>
                  {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password *</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, { flex: 1, borderWidth: 0 }, errors.confirmPassword && styles.inputError]}
                      placeholder="Re-enter password"
                      placeholderTextColor="#94a3b8"
                      value={form.confirmPassword}
                      onChangeText={(val) => updateField('confirmPassword', val)}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                    </TouchableOpacity>
                  </View>
                  {!!errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                {/* Terms and conditions */}
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => updateField('termsAccepted', !form.termsAccepted)}
                  activeOpacity={0.8}
                >
                  {form.termsAccepted ? (
                    <CheckSquare size={18} color="#2563eb" style={{ marginRight: 8 }} />
                  ) : (
                    <Square size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                  )}
                  <Text style={styles.termsText}>
                    I solemnly declare that I am an authorized pharmacist complying with CDSCO Drug Rule 96(5B).
                  </Text>
                </TouchableOpacity>
                {!!errors.termsAccepted && <Text style={[styles.errorText, { marginBottom: 12 }]}>{errors.termsAccepted}</Text>}

                {/* Buttons */}
                <View style={styles.row}>
                  <TouchableOpacity style={[styles.secondaryBtn, { flex: 1, marginRight: 8 }]} onPress={handleBack} activeOpacity={0.8}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { flex: 2, marginLeft: 8 }, isLoading && styles.primaryBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.85}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.primaryBtnText}>Submit Registration</Text>
                        <ShieldCheck size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
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
    paddingTop: 54,
    paddingBottom: 40,
    flexGrow: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  stepLabelActive: {
    color: '#2563eb',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#2563eb',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  stepSubheading: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13.5,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingRight: 8,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    padding: 8,
  },
  uploadedDocBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    justifyContent: 'space-between',
  },
  uploadedDocName: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
    flex: 1,
    marginHorizontal: 8,
  },
  uploadDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
  },
  uploadDocText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 4,
  },
  termsText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnDisabled: {
    opacity: 0.65,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
