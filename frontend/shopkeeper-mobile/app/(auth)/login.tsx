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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('test@test.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<'identifier' | 'password' | null>(null);

  const validateForm = (): boolean => {
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
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
        setErrorMessage(response.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your network and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
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
              paddingTop: Math.max(insets.top, 24) + 16,
              paddingBottom: Math.max(insets.bottom, 16) + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Brand Badge */}
          <View style={styles.header}>
            <View style={styles.badgePill}>
              <Building2 size={13} color="#0f766e" />
              <Text style={styles.badgePillText}>PHARMACY MERCHANT TERMINAL</Text>
            </View>

            <View style={styles.logoBadge}>
              <Store size={38} color="#0f766e" strokeWidth={2.2} />
            </View>

            <Text style={styles.title}>Shopkeeper Login</Text>
            <Text style={styles.subtitle}>
              Medicine Forgery Detection & Pharmaceutical Traceability
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Banner */}
            {!!errorMessage && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#dc2626" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registered Email / Store ID</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'identifier' && styles.inputContainerFocused,
                ]}
              >
                <Mail
                  size={18}
                  color={focusedInput === 'identifier' ? '#0f766e' : '#94a3b8'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="test@test.com"
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputContainerFocused,
                ]}
              >
                <Lock
                  size={18}
                  color={focusedInput === 'password' ? '#0f766e' : '#94a3b8'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="12345678"
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/(auth)/forgot-password')}
              activeOpacity={0.8}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.primaryBtnText}>Authenticating...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Text style={styles.primaryBtnText}>LOGIN</Text>
                  <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Registration Section */}
          <View style={styles.registerSection}>
            <Text style={styles.registerPrompt}>Don't have a pharmacy account?</Text>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.8}
            >
              <Store size={16} color="#0f766e" style={{ marginRight: 6 }} />
              <Text style={styles.registerBtnText}>Register Your Pharmacy</Text>
            </TouchableOpacity>
          </View>

          {/* Compliance Footer */}
          <View style={styles.footer}>
            <ShieldCheck size={14} color="#94a3b8" />
            <Text style={styles.footerText}>
              CDSCO Drug Rule 96(5B) Compliant • 256-Bit Encrypted
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
    paddingHorizontal: 22,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#99f6e4',
    gap: 6,
    marginBottom: 16,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f766e',
    letterSpacing: 0.8,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#99f6e4',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
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
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: '#0f766e',
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
    color: '#0f766e',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    letterSpacing: 0.5,
  },
  registerSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  registerPrompt: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
  },
  registerBtnText: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
