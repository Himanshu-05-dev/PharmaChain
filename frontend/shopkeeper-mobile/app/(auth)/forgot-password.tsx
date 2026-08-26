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
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { KeyRound, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { forgotPassword } from '../../src/services/api/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendReset = async () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email or mobile number.');
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Forgot Password</Text>
          <View style={{ width: 22 }} />
        </View>

        {isSent ? (
          <View style={styles.card}>
            <View style={styles.iconCircleSuccess}>
              <CheckCircle2 size={48} color="#16a34a" />
            </View>
            <Text style={styles.title}>Reset Link Sent</Text>
            <Text style={styles.subtitle}>
              Password reset instructions have been sent to <Text style={{ fontWeight: '700', color: '#0f172a' }}>{identifier}</Text>. Please follow the instructions to set your new password.
            </Text>

            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.primaryBtnText}>Return to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <KeyRound size={44} color="#0f766e" />
            </View>
            <Text style={styles.title}>Account Recovery</Text>
            <Text style={styles.subtitle}>
              Enter your registered pharmacy email or owner mobile number to receive a secure password reset link.
            </Text>

            {!!errorMessage && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#dc2626" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Text style={styles.label}>Registered Email / Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., store@pharmacy.com or mobile"
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

            <TouchableOpacity 
              style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
              onPress={handleSendReset}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <View style={styles.btnRow}>
                  <Send size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryBtnText}>Send Reset Link</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Back to Login</Text>
            </TouchableOpacity>
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
    marginBottom: 24,
  },
  backButton: {
    padding: 6,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#99f6e4',
  },
  iconCircleSuccess: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  errorBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    flex: 1,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.65,
  },
  cancelBtn: {
    paddingVertical: 14,
    marginTop: 6,
  },
  cancelText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
});
