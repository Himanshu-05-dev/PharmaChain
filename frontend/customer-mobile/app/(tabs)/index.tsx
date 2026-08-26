import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Clock,
  Bell,
  ChevronRight,
  Info,
  Pill,
  X,
  FileText,
  PhoneCall,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomerStore } from '../../src/store/customerStore';
import { useAuthStore } from '../../src/store/authStore';
import {
  SAFETY_METRICS,
  HEALTH_INSIGHTS,
} from '../../src/data/customerData';
import { SavedMedicine, HealthInsight, MedicineItemStatus } from '../../src/types';

export default function HomeDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedMedicines } = useCustomerStore();
  const { user } = useAuthStore();

  const userName = (user as any)?.displayName || 'Himanshu';
  const avatarLetter = userName.charAt(0).toUpperCase();

  const [medicineFilter, setMedicineFilter] = useState<'All' | 'Verified' | 'Expiring'>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<SavedMedicine | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<HealthInsight | null>(null);

  // Filter medicines from live store
  const filteredMedicines = savedMedicines.filter((med) => {
    if (medicineFilter === 'Verified') return med.status === 'Verified';
    if (medicineFilter === 'Expiring') return med.status === 'Expiring Soon' || med.status === 'Needs Attention';
    return true;
  });

  const verifiedCount = savedMedicines.filter((m) => m.status === 'Verified').length;
  const attentionNeededCount = savedMedicines.filter((m) => m.status === 'Needs Attention').length;
  const expiringSoonCount = savedMedicines.filter((m) => m.status === 'Expiring Soon').length;
  const suspiciousAlertsCount = savedMedicines.filter((m) => m.status === 'Suspicious' || m.status === 'Expired').length;
  const overallSafetyScore =
    savedMedicines.length > 0
      ? Math.round(savedMedicines.reduce((sum, m) => sum + (m.safetyScore || 95), 0) / savedMedicines.length)
      : 100;

  const getStatusBadgeConfig = (status: MedicineItemStatus) => {
    switch (status) {
      case 'Verified':
        return {
          bg: '#ecfdf5',
          text: '#065f46',
          border: '#a7f3d0',
          dot: '#10b981',
          icon: <ShieldCheck size={14} color="#059669" />,
        };
      case 'Expiring Soon':
        return {
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fde68a',
          dot: '#f59e0b',
          icon: <Clock size={14} color="#d97706" />,
        };
      case 'Needs Attention':
        return {
          bg: '#fff7ed',
          text: '#9a3412',
          border: '#fed7aa',
          dot: '#ea580c',
          icon: <AlertCircle size={14} color="#ea580c" />,
        };
      case 'Suspicious':
      case 'Expired':
        return {
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fecaca',
          dot: '#ef4444',
          icon: <ShieldAlert size={14} color="#dc2626" />,
        };
      default:
        return {
          bg: '#f3f4f6',
          text: '#374151',
          border: '#e5e7eb',
          dot: '#6b7280',
          icon: <Info size={14} color="#4b5563" />,
        };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (insets.top || 24) + 12,
            paddingBottom: (insets.bottom || 10) + 24,
          },
        ]}
      >
        {/* ========================================================================= */}
        {/* 1. Header & User Context (No 3-dot or hamburger menu)                      */}
        {/* ========================================================================= */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.avatarPill}
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.8}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>{avatarLetter}</Text>
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.headerTextContainer}>
                <View style={styles.userTitleRow}>
                  <Text style={styles.greeting}>Hi, {userName}</Text>
                  <View style={styles.verifiedUserBadge}>
                    <Check size={11} color="#059669" strokeWidth={3} />
                  </View>
                </View>
                <Text style={styles.subGreeting}>PharmaCare Shield Active</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push('/(tabs)/reports')}
            activeOpacity={0.7}
          >
            <Bell size={20} color="#1f2937" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ========================================================================= */}
        {/* 2. Medicine Safety Status                                                 */}
        {/* ========================================================================= */}
        <View style={styles.safetyStatusSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Medicine Safety Status</Text>
              <Text style={styles.sectionSubtitle}>Real-time prescription & authenticity health</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          {/* Safety Score Banner */}
          <View style={styles.safetyScoreBanner}>
            <View style={styles.safetyScoreLeft}>
              <View style={styles.scoreIconContainer}>
                <ShieldCheck size={24} color="#059669" />
              </View>
              <View style={styles.scoreTextWrapper}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreValue}>{overallSafetyScore}%</Text>
                  <Text style={styles.scoreTitle}>Safety Index</Text>
                </View>
                <Text style={styles.scoreSubtitle}>
                  {savedMedicines.length === 0
                    ? '0 Scans • Ready for Verification'
                    : suspiciousAlertsCount > 0
                    ? `${suspiciousAlertsCount} Unverified Issues Detected`
                    : '100% Cryptographically Verified'}
                </Text>
              </View>
            </View>
            <View style={styles.scoreProgressTrack}>
              <View style={[styles.scoreProgressBar, { width: `${overallSafetyScore}%` }]} />
            </View>
          </View>

          {/* 4 Status Metric Cards */}
          <View style={styles.statusGrid}>
            <TouchableOpacity 
              style={[styles.statusCard, styles.statusCardVerified]}
              onPress={() => setMedicineFilter('Verified')}
              activeOpacity={0.8}
            >
              <View style={styles.statusCardHeader}>
                <View style={[styles.statusCardIconBox, { backgroundColor: '#d1fae5' }]}>
                  <ShieldCheck size={18} color="#059669" />
                </View>
                <Text style={[styles.statusCardCount, { color: '#065f46' }]}>
                  {verifiedCount}
                </Text>
              </View>
              <Text style={styles.statusCardLabel}>Verified</Text>
              <Text style={styles.statusCardSub}>Authentic Packs</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusCard, styles.statusCardAttention]}
              onPress={() => setMedicineFilter('Expiring')}
              activeOpacity={0.8}
            >
              <View style={styles.statusCardHeader}>
                <View style={[styles.statusCardIconBox, { backgroundColor: '#ffedd5' }]}>
                  <AlertCircle size={18} color="#ea580c" />
                </View>
                <Text style={[styles.statusCardCount, { color: '#9a3412' }]}>
                  {attentionNeededCount}
                </Text>
              </View>
              <Text style={styles.statusCardLabel}>Attention</Text>
              <Text style={styles.statusCardSub}>Review Required</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusCard, styles.statusCardExpiring]}
              onPress={() => setMedicineFilter('Expiring')}
              activeOpacity={0.8}
            >
              <View style={styles.statusCardHeader}>
                <View style={[styles.statusCardIconBox, { backgroundColor: '#fef3c7' }]}>
                  <Clock size={18} color="#d97706" />
                </View>
                <Text style={[styles.statusCardCount, { color: '#92400e' }]}>
                  {expiringSoonCount}
                </Text>
              </View>
              <Text style={styles.statusCardLabel}>Expiring Soon</Text>
              <Text style={styles.statusCardSub}>Within 30 Days</Text>
            </TouchableOpacity>

            <View style={[styles.statusCard, styles.statusCardSuspicious]}>
              <View style={styles.statusCardHeader}>
                <View style={[styles.statusCardIconBox, { backgroundColor: '#fee2e2' }]}>
                  <ShieldAlert size={18} color="#dc2626" />
                </View>
                <Text style={[styles.statusCardCount, { color: '#991b1b' }]}>
                  {suspiciousAlertsCount}
                </Text>
              </View>
              <Text style={styles.statusCardLabel}>Suspicious</Text>
              <Text style={styles.statusCardSub}>{suspiciousAlertsCount} Detected</Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 3. Scan Medicine (UNMODIFIED & PRESERVED EXACTLY)                         */}
        {/* ========================================================================= */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardContent}>
            <View>
              <Text style={styles.scanCardTitle}>Scan Medicine</Text>
              <Text style={styles.scanCardSubtitle}>
                Scan QR code on medicine pack{'\n'}to verify authenticity
              </Text>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push('/(tabs)/scan')}
              >
                <Text style={styles.scanButtonText}>Scan Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.qrContainer}>
              <QrCode size={56} color="#fff" />
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 4. My Medicines (Saved/Verified Medicines)                                 */}
        {/* ========================================================================= */}
        <View style={styles.myMedicinesSection}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.titleWithBadge}>
                <Text style={styles.sectionTitle}>My Medicines</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{savedMedicines.length}</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>Verified prescriptions & cabinet items</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {(['All', 'Verified', 'Expiring'] as const).map((filter) => {
              const isActive = medicineFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setMedicineFilter(filter)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {filter === 'All' ? 'All Items' : filter === 'Verified' ? '✓ Verified' : '⚠️ Attention / Expiring'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Medicine List */}
          <View style={styles.medicineList}>
            {filteredMedicines.length === 0 ? (
              <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginVertical: 8 }}>
                <Pill size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>No Medicines in Cabinet</Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 18 }}>
                  {medicineFilter !== 'All'
                    ? `No medicines matching the "${medicineFilter}" filter.`
                    : 'Scan your medicine packaging with PharmaChain to verify authenticity and add it to your personal cabinet.'}
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: '#3b00b9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}
                  onPress={() => router.push('/(tabs)/scan')}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>Scan New Medicine</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredMedicines.map((med) => {
                const badge = getStatusBadgeConfig(med.status);
                const isUrgent = med.status === 'Expiring Soon' || med.status === 'Needs Attention';

                return (
                  <TouchableOpacity
                    key={med.id}
                    style={[styles.medicineCard, isUrgent && styles.medicineCardUrgent]}
                    onPress={() => setSelectedMedicine(med)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.medCardTop}>
                      <View style={styles.medIconBox}>
                        <Pill size={20} color="#3b00b9" />
                      </View>
                      <View style={styles.medHeaderInfo}>
                        <View style={styles.medNameRow}>
                          <Text style={styles.medName} numberOfLines={1}>
                            {med.name}
                          </Text>
                        </View>
                        <Text style={styles.medGeneric} numberOfLines={1}>
                          {med.genericName}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusPill,
                          {
                            backgroundColor: badge.bg,
                            borderColor: badge.border,
                          },
                        ]}
                      >
                        {badge.icon}
                        <Text style={[styles.statusPillText, { color: badge.text }]}>
                          {med.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.medCardDivider} />

                    <View style={styles.medCardMeta}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Batch ID</Text>
                        <Text style={styles.metaValue}>{med.batchNumber}</Text>
                      </View>
                      <View style={styles.metaDivider} />
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Expiry Date</Text>
                        <Text
                          style={[
                            styles.metaValue,
                            isUrgent && { color: '#ea580c', fontWeight: '700' },
                          ]}
                        >
                          {med.expiryDate}
                        </Text>
                      </View>
                      <View style={styles.metaDivider} />
                      <View style={styles.metaAction}>
                        <Text style={styles.metaActionText}>Inspect</Text>
                        <ChevronRight size={14} color="#3b00b9" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 5. Health & Safety Insights & Useful Safety Information                   */}
        {/* ========================================================================= */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.titleWithBadge}>
                <Text style={styles.sectionTitle}>Health & Safety Insights</Text>
                <Sparkles size={16} color="#8b5cf6" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.sectionSubtitle}>Pharmacist-verified safety advice & best practices</Text>
            </View>
          </View>

          {HEALTH_INSIGHTS.map((insight) => (
            <TouchableOpacity
              key={insight.id}
              style={styles.insightCard}
              onPress={() => setSelectedInsight(insight)}
              activeOpacity={0.7}
            >
              <View style={styles.insightHeader}>
                <View style={styles.insightCategoryBadge}>
                  <Text style={styles.insightCategoryText}>{insight.category}</Text>
                </View>
                <View style={styles.readTimeRow}>
                  <Clock size={12} color="#6b7280" />
                  <Text style={styles.readTimeText}>{insight.readTime}</Text>
                </View>
              </View>

              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightSummary}>{insight.summary}</Text>

              <View style={styles.insightFooter}>
                <Text style={styles.insightTapToRead}>Read Safety Guide</Text>
                <ChevronRight size={14} color="#3b00b9" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========================================================================= */}
        {/* 6. Pharmacovigilance Safety Hotline Banner                                 */}
        {/* ========================================================================= */}
        <View style={styles.helplineBanner}>
          <View style={styles.helplineIconContainer}>
            <PhoneCall size={24} color="#1d4ed8" />
          </View>
          <View style={styles.helplineContent}>
            <Text style={styles.helplineTitle}>National Drug Safety Helpline</Text>
            <Text style={styles.helplineSubtitle}>
              Toll-free 24/7 report for adverse drug reactions & suspicious sellers.
            </Text>
            <View style={styles.helplineActions}>
              <TouchableOpacity
                style={styles.reportShortcutBtn}
                onPress={() => router.push('/report')}
              >
                <FileText size={14} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.reportShortcutText}>File Complaint</Text>
              </TouchableOpacity>
              <View style={styles.helplinePhonePill}>
                <Text style={styles.helplinePhoneText}>1800-11-4321</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* Detail Modal: Saved Medicine                                              */}
      {/* ========================================================================= */}
      <Modal
        visible={!!selectedMedicine}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMedicine(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { paddingBottom: (insets.bottom || 10) + 16 }]}>
            {selectedMedicine && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleBox}>
                    <Text style={styles.modalSheetTitle}>Medicine Authenticity Record</Text>
                    <Text style={styles.modalSheetSubtitle}>PharmaChain Digital Passport</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedMedicine(null)}
                  >
                    <X size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                  {/* Status Banner */}
                  <View
                    style={[
                      styles.modalStatusBanner,
                      {
                        backgroundColor: getStatusBadgeConfig(selectedMedicine.status).bg,
                        borderColor: getStatusBadgeConfig(selectedMedicine.status).border,
                      },
                    ]}
                  >
                    <View style={styles.modalStatusIconWrapper}>
                      {getStatusBadgeConfig(selectedMedicine.status).icon}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text
                        style={[
                          styles.modalStatusTitle,
                          { color: getStatusBadgeConfig(selectedMedicine.status).text },
                        ]}
                      >
                        Verification Status: {selectedMedicine.status}
                      </Text>
                      <Text style={styles.modalStatusDesc}>
                        Safety Score: {selectedMedicine.safetyScore}/100 • Verified via cryptographic signature
                      </Text>
                    </View>
                  </View>

                  {/* Medicine Details */}
                  <View style={styles.modalDetailsGroup}>
                    <Text style={styles.modalGroupName}>Medicine Specification</Text>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Product Name</Text>
                      <Text style={styles.modalFieldValueBold}>{selectedMedicine.name}</Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Generic Composition</Text>
                      <Text style={styles.modalFieldValue}>{selectedMedicine.genericName}</Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Dosage / Strength</Text>
                      <Text style={styles.modalFieldValue}>{selectedMedicine.dosage}</Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Manufacturer</Text>
                      <Text style={styles.modalFieldValue}>{selectedMedicine.manufacturer}</Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailsGroup}>
                    <Text style={styles.modalGroupName}>Batch & Expiry Trace</Text>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Batch Number</Text>
                      <Text style={[styles.modalFieldValueBold, { color: '#3b00b9' }]}>
                        {selectedMedicine.batchNumber}
                      </Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Pack Serial ID</Text>
                      <Text style={styles.modalFieldValue}>{selectedMedicine.packId}</Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Manufacturing Date</Text>
                      <Text style={styles.modalFieldValue}>{selectedMedicine.mfgDate}</Text>
                    </View>

                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Expiry Date</Text>
                      <Text style={[styles.modalFieldValueBold, { color: '#dc2626' }]}>
                        {selectedMedicine.expiryDate}
                      </Text>
                    </View>
                  </View>

                  {selectedMedicine.instructions && (
                    <View style={styles.modalDetailsGroup}>
                      <Text style={styles.modalGroupName}>Prescription Guidelines</Text>
                      <Text style={styles.modalInstructionText}>
                        {selectedMedicine.instructions}
                      </Text>
                      {selectedMedicine.prescribedBy && (
                        <Text style={styles.modalDoctorText}>
                          Prescribed by: {selectedMedicine.prescribedBy}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Actions */}
                  <View style={styles.modalActionButtons}>
                    <TouchableOpacity
                      style={styles.modalPrimaryBtn}
                      onPress={() => {
                        setSelectedMedicine(null);
                        router.push({
                          pathname: '/scan-result',
                          params: { status: 'authentic' },
                        });
                      }}
                    >
                      <ShieldCheck size={18} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.modalPrimaryBtnText}>View Full Certificate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalSecondaryBtn}
                      onPress={() => {
                        setSelectedMedicine(null);
                        router.push('/report');
                      }}
                    >
                      <AlertTriangle size={18} color="#ea580c" style={{ marginRight: 6 }} />
                      <Text style={styles.modalSecondaryBtnText}>Report Irregularity</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* Detail Modal: Health Insight                                              */}
      {/* ========================================================================= */}
      <Modal
        visible={!!selectedInsight}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedInsight(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { paddingBottom: (insets.bottom || 10) + 16 }]}>
            {selectedInsight && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleBox}>
                    <Text style={styles.modalSheetTitle}>{selectedInsight.category}</Text>
                    <Text style={styles.modalSheetSubtitle}>{selectedInsight.readTime}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedInsight(null)}
                  >
                    <X size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                  <Text style={styles.modalAlertTitle}>{selectedInsight.title}</Text>

                  <View style={styles.insightContentList}>
                    {selectedInsight.content.map((point, idx) => (
                      <View key={idx} style={styles.insightPointRow}>
                        <View style={styles.insightPointBullet} />
                        <Text style={styles.insightPointText}>{point}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.takeawayBox}>
                    <Text style={styles.takeawayLabel}>Key Pharmacist Takeaway</Text>
                    <Text style={styles.takeawayText}>{selectedInsight.keyTakeaway}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    onPress={() => setSelectedInsight(null)}
                  >
                    <Text style={styles.modalPrimaryBtnText}>Got it, thanks!</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // ---------------------------------------------------------
  // 1. Header Styles (Clean, no 3-dot or hamburger)
  // ---------------------------------------------------------
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b00b9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#3b00b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  onlineBadge: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  verifiedUserBadge: {
    marginLeft: 6,
    backgroundColor: '#d1fae5',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subGreeting: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  // ---------------------------------------------------------
  // 2. Medicine Safety Status
  // ---------------------------------------------------------
  safetyStatusSection: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 4,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  safetyScoreBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  safetyScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scoreTextWrapper: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#065f46',
    marginRight: 6,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  scoreSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  scoreProgressTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreProgressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  statusCardVerified: {
    borderColor: '#d1fae5',
  },
  statusCardAttention: {
    borderColor: '#ffedd5',
  },
  statusCardExpiring: {
    borderColor: '#fef3c7',
  },
  statusCardSuspicious: {
    borderColor: '#fee2e2',
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardCount: {
    fontSize: 20,
    fontWeight: '800',
  },
  statusCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusCardSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  // ---------------------------------------------------------
  // 3. Scan Card (PRESERVED EXACTLY AS ORIGINAL)
  // ---------------------------------------------------------
  scanCard: {
    backgroundColor: '#3b00b9',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#3b00b9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  scanCardSubtitle: {
    fontSize: 13,
    color: '#e0e7ff',
    marginBottom: 20,
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  scanButtonText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 14,
  },
  qrContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // ---------------------------------------------------------
  // 4. My Medicines Section
  // ---------------------------------------------------------
  myMedicinesSection: {
    marginBottom: 24,
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5b21b6',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#3b00b9',
    borderColor: '#3b00b9',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  medicineList: {
    gap: 12,
  },
  medicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  medicineCardUrgent: {
    borderColor: '#fde68a',
    backgroundColor: '#fffdfa',
  },
  medCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medHeaderInfo: {
    flex: 1,
    marginRight: 8,
  },
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  medGeneric: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  medCardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  medCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  metaAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  metaActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b00b9',
    marginRight: 2,
  },

  // ---------------------------------------------------------
  // 5. Health & Safety Insights
  // ---------------------------------------------------------
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightCategoryBadge: {
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  insightCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6d28d9',
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
    color: '#64748b',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 6,
  },
  insightSummary: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightTapToRead: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b00b9',
    marginRight: 2,
  },

  // ---------------------------------------------------------
  // 6. Helpline Banner
  // ---------------------------------------------------------
  helplineBanner: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  helplineIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  helplineContent: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  helplineSubtitle: {
    fontSize: 12,
    color: '#3b82f6',
    lineHeight: 16,
    marginBottom: 10,
  },
  helplineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  reportShortcutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  helplinePhonePill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  helplinePhoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  // ---------------------------------------------------------
  // Modal Styles
  // ---------------------------------------------------------
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalHeaderTitleBox: {
    flex: 1,
  },
  modalSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalSheetSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    marginTop: 14,
  },
  modalStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  modalStatusIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalStatusDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  modalDetailsGroup: {
    marginBottom: 18,
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalGroupName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  modalFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalFieldLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  modalFieldValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  modalFieldValueBold: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  modalInstructionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  modalDoctorText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
    fontStyle: 'italic',
  },
  modalActionButtons: {
    gap: 10,
    marginTop: 6,
    marginBottom: 20,
  },
  modalPrimaryBtn: {
    backgroundColor: '#3b00b9',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b00b9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  modalPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  modalSecondaryBtnText: {
    color: '#ea580c',
    fontSize: 14,
    fontWeight: '700',
  },
  modalAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 4,
  },
  insightContentList: {
    gap: 10,
    marginVertical: 14,
  },
  insightPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightPointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b00b9',
    marginTop: 6,
    marginRight: 10,
  },
  insightPointText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    flex: 1,
  },
  takeawayBox: {
    backgroundColor: '#f5f3ff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    marginVertical: 14,
  },
  takeawayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b21b6',
    marginBottom: 4,
  },
  takeawayText: {
    fontSize: 13,
    color: '#4c1d95',
    lineHeight: 18,
    fontWeight: '500',
  },
});
