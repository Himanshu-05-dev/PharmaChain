import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, AlertTriangle, XCircle, Info, ShieldCheck, ShieldAlert, ArrowLeft, BookmarkCheck, Store, MapPin } from "lucide-react-native";
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
      genericName: result.pack.genericName || result.payload?.genericName || result.pack.medicineName,
      brandName: result.pack.brandName,
      dosage: result.pack.dosage || 'Standard Dosage',
      composition: result.pack.composition,
      drugSchedule: result.pack.drugSchedule,
      storageCondition: result.pack.storageCondition,
      productionSite: result.manufacturer?.productionSite,
      batchNumber: result.pack.batchId,
      manufacturer: result.manufacturer?.name || 'Verified Manufacturer',
      mfgDate: result.pack.manufacturingDate,
      expiryDate: result.pack.expiryDate,
      daysToExpiry: 365,
      status: result.status === 'AUTHENTIC' || result.uiState === 'GENUINE' ? 'Verified' : 'Needs Attention',
      packId: result.pack.packId,
      category: result.pack.drugSchedule ? `Schedule ${result.pack.drugSchedule}` : 'General Care',
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

  const isRecentlySold = result?.uiState === "PURCHASED_RECENTLY" || Boolean(result?.isRecentlySold);
  const isPreviouslySold = result?.uiState === "ALREADY_SOLD";
  const isPositive = result?.uiState === "GENUINE" || isRecentlySold || result?.uiState === "AT_SHOP" || (result?.success && !result?.uiState);
  const isCritical = result?.uiState === "COUNTERFEIT" || result?.uiState === "RECALLED";

  const renderIcon = () => {
    switch (result?.uiState) {
      case "GENUINE":
      case "PURCHASED_RECENTLY":
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
      case "PURCHASED_RECENTLY":
        return "Verified — Recently Purchased";
      case "AT_SHOP":
        return "Verified Pharmacy Stock";
      case "ALREADY_SOLD":
        return "Notice: Pack Dispensed Previously";
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

            {isPositive || result.pack.batchId !== 'N/A' ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Manufacturer</Text>
                  <Text style={styles.value}>{result.manufacturer?.name || 'Verified CDSCO Facility'}</Text>
                </View>

                {result.manufacturer?.productionSite && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Facility Location</Text>
                    <Text style={styles.value}>{result.manufacturer.productionSite}</Text>
                  </View>
                )}

                <View style={styles.row}>
                  <Text style={styles.label}>Batch ID</Text>
                  <Text style={styles.value}>{result.pack.batchId}</Text>
                </View>

                {result.pack.dosage && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Dosage / Strength</Text>
                    <Text style={styles.value}>{result.pack.dosage}</Text>
                  </View>
                )}

                {result.pack.composition && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Active Composition</Text>
                    <Text style={[styles.value, { fontSize: 12 }]}>{result.pack.composition}</Text>
                  </View>
                )}

                {result.pack.drugSchedule && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Drug Schedule</Text>
                    <Text style={[styles.value, { color: '#0369a1', fontWeight: '700' }]}>
                      Schedule {result.pack.drugSchedule}
                    </Text>
                  </View>
                )}

                <View style={styles.row}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <Text style={styles.value}>{result.pack.expiryDate}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Manufacturing Date</Text>
                  <Text style={styles.value}>{result.pack.manufacturingDate}</Text>
                </View>

                {result.pack.storageCondition && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Storage</Text>
                    <Text style={[styles.value, { fontSize: 11, color: '#4b5563' }]}>
                      {result.pack.storageCondition}
                    </Text>
                  </View>
                )}

                {result.pack.serial && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Serial Number</Text>
                    <Text style={styles.value}>{result.pack.serial}</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.unverifiedBox}>
                <Text style={styles.unverifiedTitle}>Verification Diagnostic</Text>
                <Text style={styles.unverifiedText}>
                  • The scanned QR code does not contain a valid ECDSA ES256 cryptographic signature issued by a CDSCO-approved manufacturer.
                </Text>
                <Text style={styles.unverifiedText}>
                  • If this medicine was purchased from a registered pharmacy, report it immediately to initiate a quality audit.
                </Text>
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
                {isPositive ? (result.blockchainStatus || 'COMMITTED') : 'COUNTERFEIT / UNVERIFIED'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Signature Protocol</Text>
              <Text style={styles.value}>ECDSA ES256 (P-256)</Text>
            </View>

            {/* Dispensing Pharmacy & Geolocation Provenance Card */}
            {(result.shop?.name || result.dispensingShop?.name || result.transaction?.location) && (
              <View style={styles.provenanceBox}>
                <View style={styles.provenanceHeader}>
                  <Store size={16} color="#0284c7" style={{ marginRight: 6 }} />
                  <Text style={styles.provenanceTitle}>Verified Dispensing Pharmacy</Text>
                </View>

                <View style={styles.provenanceRow}>
                  <Text style={styles.provenanceLabel}>Pharmacy</Text>
                  <Text style={styles.provenanceValue}>
                    {result.shop?.name || result.dispensingShop?.name || 'Registered CDSCO Pharmacy'}
                  </Text>
                </View>

                {(result.shop?.licenseNumber || result.dispensingShop?.licenseNumber) ? (
                  <View style={styles.provenanceRow}>
                    <Text style={styles.provenanceLabel}>Drug License</Text>
                    <Text style={[styles.provenanceValue, { color: '#0369a1', fontWeight: '700' }]}>
                      {result.shop?.licenseNumber || result.dispensingShop?.licenseNumber}
                    </Text>
                  </View>
                ) : null}

                {(result.transaction?.location || result.dispensingShop?.location) ? (
                  <View style={styles.provenanceRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MapPin size={12} color="#059669" style={{ marginRight: 3 }} />
                      <Text style={styles.provenanceLabel}>Dispense GPS</Text>
                    </View>
                    <Text style={[styles.provenanceValue, { fontSize: 11, color: '#047857' }]}>
                      {result.transaction?.location || result.dispensingShop?.location}
                    </Text>
                  </View>
                ) : null}

                {(result.transaction?.saleTime || result.dispensingShop?.sellingDate) ? (
                  <View style={styles.provenanceRow}>
                    <Text style={styles.provenanceLabel}>Dispense Time</Text>
                    <Text style={styles.provenanceValue}>
                      {result.dispensingShop?.formattedSaleTime || result.transaction?.saleTime || result.dispensingShop?.sellingDate}
                    </Text>
                  </View>
                ) : null}

                {/* Contextual Guidance Box */}
                {isRecentlySold ? (
                  <View style={styles.guidanceBoxSuccess}>
                    <Text style={styles.guidanceTitleSuccess}>✓ Recent Purchase Verified</Text>
                    <Text style={styles.guidanceTextSuccess}>
                      This medicine was dispensed from this verified pharmacy within the last 48 hours. If you just bought this pack, it is 100% authentic and registered on the blockchain.
                    </Text>
                  </View>
                ) : isPreviouslySold ? (
                  <View style={styles.guidanceBoxWarning}>
                    <Text style={styles.guidanceTitleWarning}>⚖️ Buyer Verification Advisory</Text>
                    <Text style={styles.guidanceTextWarning}>
                      • Checking Personal Medicine? If you bought this medicine previously from this pharmacy and are checking it at home, it is genuine and matches your purchase history.
                    </Text>
                    <Text style={[styles.guidanceTextWarning, { marginTop: 4 }]}>
                      • Buying New in a Shop Now? If a store is attempting to sell you this pack today as brand-new stock, do not accept it — this pack was already sold on {result.dispensingShop?.formattedSaleTime || 'a prior date'} and could be a refilled duplicate clone.
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
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
  unverifiedBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 12,
    marginBottom: 12,
  },
  unverifiedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 6,
  },
  unverifiedText: {
    fontSize: 12,
    color: "#7f1d1d",
    lineHeight: 18,
    marginBottom: 4,
  },
  provenanceBox: {
    marginTop: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bae6fd",
    padding: 12,
  },
  provenanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f2fe",
  },
  provenanceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0369a1",
  },
  provenanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  provenanceLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  provenanceValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
    flexShrink: 1,
    textAlign: "right",
  },
  guidanceBoxSuccess: {
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    padding: 10,
    marginTop: 8,
  },
  guidanceTitleSuccess: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065f46",
    marginBottom: 2,
  },
  guidanceTextSuccess: {
    fontSize: 11,
    color: "#047857",
    lineHeight: 16,
  },
  guidanceBoxWarning: {
    backgroundColor: "#fffbeb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde68a",
    padding: 10,
    marginTop: 8,
  },
  guidanceTitleWarning: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 2,
  },
  guidanceTextWarning: {
    fontSize: 11,
    color: "#78350f",
    lineHeight: 16,
  },
});
