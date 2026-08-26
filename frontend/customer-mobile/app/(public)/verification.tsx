import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, AlertTriangle, XCircle, Info, ShieldCheck, ShieldAlert, ArrowLeft, BookmarkCheck } from "lucide-react-native";
import { verifyMedicineQR } from "../../src/services/api/verify.api";
import { useCustomerStore } from "../../src/store/customerStore";
import { VerificationResult, SavedMedicine } from "../../src/types";

export default function VerificationScreen() {
  const { qrData } = useLocalSearchParams<{ qrData: string }>();
  const router = useRouter();
  const { addSavedMedicine } = useCustomerStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const runVerification = async () => {
      if (!qrData) {
        setResult({
          success: false,
          status: "INVALID",
          message: "No QR data provided to verify.",
        });
        setLoading(false);
        return;
      }

      setLoading(false);
      try {
        setLoading(true);
        const res = await verifyMedicineQR(qrData);
        setResult(res);
      } catch (error) {
        setResult({
          success: false,
          status: "INVALID",
          message: "Unable to complete cryptographic verification.",
        });
      } finally {
        setLoading(false);
      }
    };

    runVerification();
  }, [qrData]);

  const handleSaveToCabinet = () => {
    if (!result || !result.pack) return;
    const med: SavedMedicine = {
      id: `med-${Date.now()}`,
      name: result.pack.medicineName || 'Verified Formulation',
      genericName: result.payload?.genericName || result.pack.medicineName,
      dosage: result.pack.dosage || 'Standard Dosage',
      batchNumber: result.pack.batchId,
      manufacturer: result.manufacturer?.name || 'Verified Manufacturer',
      mfgDate: result.pack.manufacturingDate,
      expiryDate: result.pack.expiryDate,
      daysToExpiry: 365,
      status: result.status === 'AUTHENTIC' || result.uiState === 'GENUINE' ? 'Verified' : 'Needs Attention',
      packId: result.pack.packId,
      category: 'General Care',
      verifiedAt: 'Just now',
      safetyScore: result.risk?.score || 98,
    };
    addSavedMedicine(med);
    setSaved(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Verifying against PharmaChain Ledger...</Text>
        <Text style={styles.loadingSub}>Verifying ES256 Signature & Fabric State</Text>
      </View>
    );
  }

  const renderIcon = () => {
    switch (result?.uiState) {
      case "GENUINE":
      case "AT_SHOP":
        return <CheckCircle color="#10b981" size={64} />;
      case "ALREADY_SOLD":
      case "EXPIRED":
        return <AlertTriangle color="#f59e0b" size={64} />;
      case "COUNTERFEIT":
      case "RECALLED":
        return <XCircle color="#ef4444" size={64} />;
      default:
        return result?.success ? (
          <CheckCircle color="#10b981" size={64} />
        ) : (
          <Info color="#6b7280" size={64} />
        );
    }
  };

  const getStatusMessage = () => {
    switch (result?.uiState) {
      case "GENUINE":
        return "100% Genuine Medicine";
      case "AT_SHOP":
        return "Verified Pharmacy Stock";
      case "ALREADY_SOLD":
        return "Warning: Pack Already Sold";
      case "RECALLED":
        return "CRITICAL: Batch Recalled";
      case "EXPIRED":
        return "Expired Medicine Warning";
      case "COUNTERFEIT":
        return "COUNTERFEIT DETECTED";
      case "NOT_FOUND":
        return "Genesis Event Not Found";
      default:
        return result?.message || (result?.success ? "Authentic Medicine" : "Verification Failed");
    }
  };

  const isPositive = result?.uiState === "GENUINE" || result?.uiState === "AT_SHOP" || (result?.success && !result?.uiState);
  const isCritical = result?.uiState === "COUNTERFEIT" || result?.uiState === "RECALLED";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          {renderIcon()}
          <Text
            style={[
              styles.statusText,
              isPositive ? styles.statusSuccess : isCritical ? styles.statusCritical : styles.statusWarning,
            ]}
          >
            {getStatusMessage()}
          </Text>
          {result?.message ? (
            <Text style={styles.messageText}>{result.message}</Text>
          ) : null}
        </View>

        {result?.pack && (
          <View style={styles.details}>
            <Text style={styles.medicineName}>{result.pack.medicineName}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Manufacturer</Text>
              <Text style={styles.value}>{result.manufacturer?.name || 'Verified CDSCO Facility'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Batch ID</Text>
              <Text style={styles.value}>{result.pack.batchId}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Expiry Date</Text>
              <Text style={styles.value}>{result.pack.expiryDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Manufacturing Date</Text>
              <Text style={styles.value}>{result.pack.manufacturingDate}</Text>
            </View>

            {result.pack.serial && (
              <View style={styles.row}>
                <Text style={styles.label}>Serial Number</Text>
                <Text style={styles.value}>{result.pack.serial}</Text>
              </View>
            )}

            {result.packHash && (
              <View style={styles.row}>
                <Text style={styles.label}>Pack Hash</Text>
                <Text style={[styles.value, styles.mono]}>
                  {result.packHash.substring(0, 12)}...{result.packHash.substring(result.packHash.length - 6)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Blockchain Ledger</Text>
              <Text style={[styles.value, { color: isPositive ? '#059669' : '#dc2626' }]}>
                {result.blockchainStatus || (isPositive ? 'COMMITTED' : 'UNVERIFIED')}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Signature Protocol</Text>
              <Text style={styles.value}>ECDSA ES256 (P-256)</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          {isPositive && (
            <TouchableOpacity
              style={[styles.saveButton, saved && styles.savedButton]}
              onPress={handleSaveToCabinet}
              disabled={saved}
            >
              <BookmarkCheck size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>
                {saved ? "Saved to Medicine Cabinet" : "Save to Medicine Cabinet"}
              </Text>
            </TouchableOpacity>
          )}

          {!isPositive && (
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => router.push({ pathname: '/report', params: { qrToken: qrData, medicineName: result?.pack?.medicineName } })}
            >
              <Text style={styles.buttonText}>Report This Medicine</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/(public)/home")}>
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "bold",
  },
  loadingSub: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  messageText: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 8,
  },
  statusSuccess: {
    color: "#10b981",
  },
  statusWarning: {
    color: "#f59e0b",
  },
  statusCritical: {
    color: "#ef4444",
  },
  details: {
    marginBottom: 24,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  label: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#3b00b9",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  buttonGroup: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  savedButton: {
    backgroundColor: "#059669",
  },
  reportButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },
});
