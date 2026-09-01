import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Building2,
} from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { loginShopkeeper } from '../../src/services/api/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PharmaTheme } from '../../src/constants/theme';
import { PharmaChainLogo } from '../../src/components/common/PharmaChainLogo';
import { AnimatedAuthBackground } from '../../src/components/common/AnimatedAuthBackground';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<'identifier' | 'password' | null>(null);

  const validateForm = (): boolean => {
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered pharmacy email or phone.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loginShopkeeper(identifier.trim(), password);

      if (response.success && response.shopkeeper) {
        await login(response.accessToken, response.refreshToken, response.shopkeeper);

        const status = response.shopkeeper.verificationStatus;
        if (status === 'verified') {
          router.replace('/(shopkeeper)/dashboard');
        } else if (status === 'pending') {
          router.replace('/(auth)/verification-pending');
        } else if (status === 'rejected') {
          router.replace('/(auth)/verification-rejected');
        } else if (status === 'suspended') {
          router.replace('/(auth)/account-suspended');
        } else {
          router.replace('/(shopkeeper)/dashboard');
        }
      } else {
        setErrorMessage(response.message || 'Invalid credentials. Please verify and try again.');
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Connection failed. Please check your network and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Continuous Animated Blockchain & Light Orb Background */}
      <AnimatedAuthBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 24) + 20,
              paddingBottom: Math.max(insets.bottom, 16) + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Brand Section */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadgeOuter}>
              <View style={styles.logoBadgeInner}>
                <PharmaChainLogo size={54} colorScheme="cobalt" />
              </View>
            </View>

            <Text style={styles.companyName}>PharmaChain</Text>
            <View style={styles.roleTagPill}>
              <Building2 size={12} color={PharmaTheme.colors.primary} />
              <Text style={styles.roleTagText}>PHARMACY TERMINAL</Text>
            </View>

            <Text style={styles.headerSubtitle}>
              Cryptographic Medicine Authentication & Supply Chain Traceability
            </Text>
          </View>

          {/* Form Glass Card */}
          <View style={styles.formCard}>
            <Text style={styles.formHeading}>Sign In to Node</Text>
            <Text style={styles.formSubheading}>
              Enter your registered store credentials
            </Text>

            {/* Error Message Banner */}
            {!!errorMessage && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#dc2626" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Email / Store ID Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pharmacy Email or Mobile</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'identifier' && styles.inputContainerFocused,
                ]}
              >
                <Mail
                  size={18}
                  color={focusedInput === 'identifier' ? PharmaTheme.colors.primary : '#94a3b8'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="pharmacy@store.com"
                  placeholderTextColor="#94a3b8"
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setFocusedInput('identifier')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Terminal Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputContainerFocused,
                ]}
              >
                <Lock
                  size={18}
                  color={focusedInput === 'password' ? PharmaTheme.colors.primary : '#94a3b8'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/(auth)/forgot-password')}
              activeOpacity={0.8}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Submit Action Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.primaryBtnText}>Authenticating Node...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                  <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Registration Trigger */}
          <View style={styles.registerSection}>
            <Text style={styles.registerPrompt}>Don't have a registered pharmacy terminal?</Text>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.8}
            >
              <Store size={15} color={PharmaTheme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.registerBtnText}>Register New Pharmacy</Text>
            </TouchableOpacity>
          </View>

          {/* Compliance & Regulatory Seal */}
          <View style={styles.footerSeal}>
            <ShieldCheck size={14} color="#94a3b8" />
            <Text style={styles.footerSealText}>
              CDSCO Drug Rule 96(5B) Compliant • ES256 Hardware Secured
            </Text>
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoBadgeOuter: {
    padding: 6,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(219, 234, 254, 0.8)',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 12,
  },
  logoBadgeInner: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  companyName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.6,
  },
  roleTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dbeafe',
    gap: 5,
    marginTop: 6,
    marginBottom: 8,
  },
  roleTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 24,
  },
  formCard: {
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
    marginBottom: 20,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  formSubheading: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    flex: 1,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeBtn: {
    padding: 8,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.65,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  registerSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  registerPrompt: {
    fontSize: 12.5,
    color: '#64748b',
    marginBottom: 8,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  registerBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  footerSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  footerSealText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
