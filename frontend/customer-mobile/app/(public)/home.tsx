import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import {
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react-native";
import { useAuthStore } from "../../src/store/authStore";
import { signInWithGoogleCode } from "../../src/services/api/auth.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Required for expo-auth-session to handle the OAuth redirect back to the app
WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  // ── Stable Redirect URI ────────────────────────────────────────────────
  // makeRedirectUri() returns exp://IP:port in Expo Go (changes per session).
  // Google requires a stable HTTPS URI. We hardcode the Expo auth proxy URL
  // directly — register THIS EXACT URL in Google Cloud Console.
  const REDIRECT_URI = 'https://auth.expo.io/@sahilsharma30/temp-app';

  // Google OAuth 2.0 discovery document — used instead of expo-auth-session/providers/google
  // so a single webClientId works on all platforms without requiring separate Android/iOS IDs.
  const GOOGLE_DISCOVERY = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  // ── Google OAuth hook ─────────────────────────────────────────────────────
  // usePKCE: false → backend handles the code exchange using the client secret.
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: REDIRECT_URI,
      usePKCE: false,
    },
    GOOGLE_DISCOVERY
  );

  // ── Log redirect URI for GCC registration ─────────────────────────────────
  useEffect(() => {
    console.log('[MediaCare Auth] Redirect URI → ADD THIS TO GOOGLE CLOUD CONSOLE:');
    console.log(REDIRECT_URI);
  }, [REDIRECT_URI]);

  // Watch for OAuth response from the browser session
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleBackendSignIn(code);
    } else if (response?.type === "error") {
      setLoading(false);
      Alert.alert("Google Sign-In Error", response.error?.message || "Authentication was cancelled or failed.");
    } else if (response?.type === "cancel" || response?.type === "dismiss") {
      setLoading(false);
    }
  }, [response]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    setLoading(true);
    console.log('[MediaCare Auth] Using redirect URI:', REDIRECT_URI);
    try {
      await promptAsync();
      // Loading stays true until the response useEffect resolves it
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Failed to open Google Sign-In. Please try again.");
    }
  };

  const handleBackendSignIn = async (code: string) => {
    try {
      const { user, token } = await signInWithGoogleCode(code, REDIRECT_URI);
      // Persist token securely for session restore across app restarts
      await SecureStore.setItemAsync("pharmaToken", token);
      setAuth(user, token);
      router.replace("/(tabs)");
    } catch (e: any) {
      setLoading(false);
      Alert.alert(
        "Authentication Failed",
        "Could not verify your identity with the PharmaChain server. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24) + 16,
            paddingBottom: Math.max(insets.bottom, 16) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Hero */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoCircle}>
              <ShieldCheck size={48} color="#ffffff" strokeWidth={2.4} />
            </View>
            <View style={styles.glowRing} />
          </View>

          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>MediaCare</Text>
            <View style={styles.brandTag}>
              <Text style={styles.brandTagText}>PharmaChain</Text>
            </View>
          </View>

          <Text style={styles.brandSubtitle}>
            Blockchain-backed medicine verification & patient safety intelligence.
          </Text>
        </View>

        {/* Value Highlights */}
        <View style={styles.highlightsCard}>
          <View style={styles.highlightItem}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#ecfdf5' }]}>
              <CheckCircle2 size={16} color="#059669" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={styles.highlightTitle}>Cryptographic Batch Verification</Text>
              <Text style={styles.highlightDesc}>
                Instantly authenticate 2D DataMatrix codes against CDSCO ledger.
              </Text>
            </View>
          </View>

          <View style={styles.highlightDivider} />

          <View style={styles.highlightItem}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#f5f3ff' }]}>
              <Sparkles size={16} color="#7c3aed" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={styles.highlightTitle}>Counterfeit & Recall Detection</Text>
              <Text style={styles.highlightDesc}>
                Real-time national advisories on tampered packaging & recalls.
              </Text>
            </View>
          </View>

          <View style={styles.highlightDivider} />

          <View style={styles.highlightItem}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#eff6ff' }]}>
              <Lock size={16} color="#2563eb" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={styles.highlightTitle}>Tamper-Proof Supply Provenance</Text>
              <Text style={styles.highlightDesc}>
                Verify manufacturer, distributor, and pharmacy chain of custody.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Panel */}
        <View style={styles.actionPanel}>
          {/* Scan Direct CTA */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/(public)/scan")}
            activeOpacity={0.85}
          >
            <View style={styles.scanBtnLeft}>
              <View style={styles.scanIconWrapper}>
                <ScanLine color="#ffffff" size={22} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.scanButtonTitle}>Scan Medicine Now</Text>
                <Text style={styles.scanButtonSub}>No login required to verify</Text>
              </View>
            </View>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>SECURE PATIENT ACCESS</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Sign In CTA */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#3b00b9" />
              <Text style={styles.loadingText}>Authenticating with Google...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.googleButton, !request && styles.googleButtonDisabled]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.88}
              disabled={!request}
            >
              {/* Official Google G logo using colored squares */}
              <View style={styles.googleLogoBox}>
                <View style={styles.googleLogoInner}>
                  <View style={[styles.gSegment, { backgroundColor: '#4285F4', top: 0, left: 5, width: 8, height: 9, borderTopLeftRadius: 8, borderTopRightRadius: 8 }]} />
                  <View style={[styles.gSegment, { backgroundColor: '#34A853', bottom: 0, left: 5, width: 8, height: 8, borderBottomLeftRadius: 8 }]} />
                  <View style={[styles.gSegment, { backgroundColor: '#FBBC05', bottom: 0, left: 0, width: 6, height: 8 }]} />
                  <View style={[styles.gSegment, { backgroundColor: '#EA4335', top: 0, left: 0, width: 6, height: 9 }]} />
                  <View style={[styles.gBar, { backgroundColor: '#4285F4' }]} />
                </View>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          )}

          {/* Trust Footer */}
          <View style={styles.trustFooter}>
            <ShieldCheck size={14} color="#64748b" />
            <Text style={styles.trustFooterText}>
              256-Bit Encrypted • Aligned with CDSCO & Pharmacovigilance Standards
            </Text>
          </View>

          {/* DEBUG — shows exact redirect URI to register in Google Cloud Console */}
          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>📋 Register this URI in Google Cloud Console:</Text>
            <Text selectable style={styles.debugUri}>{REDIRECT_URI}</Text>
            <Text style={styles.debugHint}>GCC → Credentials → Web Client → Authorized Redirect URIs</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingHorizontal: 24,
    justifyContent: "space-between",
    flexGrow: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  logoBadgeContainer: {
    position: "relative",
    marginBottom: 16,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#3b00b9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b00b9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  glowRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: "rgba(59, 0, 185, 0.2)",
    top: -8,
    left: -8,
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandTag: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  brandTagText: {
    color: "#5b21b6",
    fontSize: 11,
    fontWeight: "700",
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 290,
  },

  // Highlights Card
  highlightsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  highlightIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  highlightTextBox: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  highlightDesc: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
  },
  highlightDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  // Action Panel
  actionPanel: {
    gap: 14,
  },
  scanButton: {
    backgroundColor: "#3b00b9",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#3b00b9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  scanBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scanButtonTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  scanButtonSub: {
    color: "#e0e7ff",
    fontSize: 11,
    marginTop: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 10,
  },
  googleButtonDisabled: {
    opacity: 0.45,
  },
  googleLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLogoInner: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  gSegment: {
    position: 'absolute',
  },
  gBar: {
    position: 'absolute',
    right: 0,
    top: 9,
    width: 9,
    height: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  googleButtonText: {
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // optical balance for the logo on the left
  },
  loadingBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#3b00b9",
    fontWeight: "600",
  },
  trustFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  trustFooterText: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 14,
  },
  debugBox: {
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fde047',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    gap: 4,
  },
  debugTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854d0e',
    marginBottom: 4,
  },
  debugUri: {
    fontSize: 11,
    color: '#1e40af',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  debugHint: {
    fontSize: 10,
    color: '#92400e',
    marginTop: 4,
  },
});
