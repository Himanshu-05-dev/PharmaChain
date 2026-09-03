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
import { KeyRound, ArrowLeft, Send, CheckCircle2, AlertCircle, Mail, ArrowRight } from 'lucide-react-native';
import { forgotPassword } from '../../src/services/api/auth';
import { PharmaTheme } from '../../src/constants/theme';
import { PharmaChainLogo } from '../../src/components/common/PharmaChainLogo';
import { AnimatedAuthBackground } from '../../src/components/common/AnimatedAuthBackground';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendReset = async () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered pharmacy email or phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await forgotPassword(identifier.trim());
      if (response.success) {
        setIsSent(true);
      } else {
        setErrorMessage(response.message || 'Could not process password reset.');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to send reset link.');
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
              <ArrowLeft size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Account Recovery</Text>
            <View style={{ width: 40 }} />
          </View>

          {isSent ? (
            <View style={styles.card}>
              <View style={styles.iconCircleSuccess}>
                <CheckCircle2 size={40} color="#059669" />
              </View>
              <Text style={styles.title}>Reset Instructions Sent</Text>
              <Text style={styles.subtitle}>
                Password reset instructions have been dispatched to <Text style={{ fontWeight: '800', color: '#0f172a' }}>{identifier}</Text>. Please follow the email link to verify and reset your node password.
              </Text>

              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Return to Sign In</Text>
                <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.brandIconWrapper}>
                <PharmaChainLogo size={46} colorScheme="cobalt" />
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your registered pharmacy email address to receive a secure cryptographically verified password reset link.
              </Text>

              {!!errorMessage && (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color="#dc2626" style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Registered Email Address</Text>
                <View style={styles.inputContainer}>
                  <Mail size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="pharmacy@store.com"
                    placeholderTextColor="#94a3b8"
                    value={identifier}
                    onChangeText={(val) => {
                      setIdentifier(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
                onPress={handleSendReset}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <View style={styles.btnContent}>
                    <Send size={16} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnText}>Send Recovery Link</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    paddingBottom: 24,
    flexGrow: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  brandIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleSuccess: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 10,
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
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
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
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: '#0f172a',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 15,
    width: '100%',
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
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
