import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react-native";
import { useAuthStore } from "../../src/store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handlePatientAccess = () => {
    setLoading(true);
    const patientUser = {
      uid: `patient-${Date.now()}`,
      email: "himanshu@pharmachain.gov.in",
      displayName: "Himanshu",
    };

    setAuth(patientUser as any);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 300);
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
              <Text style={styles.loadingText}>Authenticating Patient Session...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handlePatientAccess}
              activeOpacity={0.85}
            >
              <View style={styles.googleIconBox}>
                <Text style={styles.googleIconLetter}>G</Text>
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
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  googleIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ea4335",
    justifyContent: "center",
    alignItems: "center",
  },
  googleIconLetter: {
    fontWeight: "800",
    color: "#ffffff",
    fontSize: 13,
  },
  googleButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
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
});
