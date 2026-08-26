import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { getStats, getHistory } from '../../src/services/api/shopkeeper';
import {
  Bell,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Store,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Camera,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
} from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { shopkeeper, user } = useAuthStore();

  const [statsData, setStatsData] = useState<any>({
    totalScans: 0,
    verifiedCount: 0,
    suspiciousCount: 0,
    counterfeitCount: 0,
    todaySalesCount: 0,
    lowStockCount: 0,
    verifiedPacksInStock: 0,
    blockchainIntegrityScore: 99.4,
  });

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.allSettled([
        getStats(),
        getHistory({ limit: 5 }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStatsData(statsRes.value.data);
      }
      if (historyRes.status === 'fulfilled' && historyRes.value?.data?.history) {
        setRecentScans(historyRes.value.data.history);
      }
    } catch (err: any) {
      console.warn('[DashboardScreen] fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const shopName = shopkeeper?.shopName || user?.displayName || 'Pharmacy Store';
  const shopId = shopkeeper?.shopId || user?.shopId || 'SHOP-NODE';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f766e']} />
        }
      >
        {/* 1. Top Professional Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.storeBadge}>
              <Store size={22} color="#0f766e" />
              <View style={styles.onlinePulse} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting} numberOfLines={1}>
                {shopName}
              </Text>
              <View style={styles.shopIdRow}>
                <View style={styles.shopIdChip}>
                  <Text style={styles.shopIdText}>ID: #{shopId}</Text>
                </View>
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={11} color="#0f766e" style={{ marginRight: 3 }} />
                  <Text style={styles.verifiedTagText}>CDSCO VERIFIED</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(shopkeeper)/transactions')}
            activeOpacity={0.8}
          >
            <Bell color="#0f172a" size={20} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* 2. Hero Scan Medicine Card */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardContent}>
            <View style={styles.scanTagRow}>
              <Sparkles size={12} color="#ccfbf1" />
              <Text style={styles.scanTagText}>AUTHENTICATION SCANNER</Text>
            </View>

            <Text style={styles.scanCardTitle}>Scan Medicine Pack</Text>
            <Text style={styles.scanCardDesc}>
              Instant cryptographic verification, batch traceability, and intake/dispense lifecycle.
            </Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push({ pathname: '/(shopkeeper)/scan', params: { mode: 'DISPENSE' } })}
              activeOpacity={0.85}
            >
              <Camera size={16} color="#0f766e" style={{ marginRight: 6 }} />
              <Text style={styles.scanButtonText}>Launch POS Scanner</Text>
              <ChevronRight size={16} color="#0f766e" style={{ marginLeft: 2 }} />
            </TouchableOpacity>

            <View style={styles.quickModeRow}>
              <TouchableOpacity
                style={styles.quickModeBtn}
                onPress={() => router.push({ pathname: '/(shopkeeper)/scan', params: { mode: 'RECEIVE' } })}
                activeOpacity={0.8}
              >
                <ArrowDownLeft size={12} color="#ccfbf1" />
                <Text style={styles.quickModeText}>Inbound</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickModeBtn}
                onPress={() => router.push({ pathname: '/(shopkeeper)/scan', params: { mode: 'DISPENSE' } })}
                activeOpacity={0.8}
              >
                <ArrowUpRight size={12} color="#ccfbf1" />
                <Text style={styles.quickModeText}>Dispense</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.scanGraphic}>
            <QrCode color="#ffffff" size={64} strokeWidth={1.2} />
          </View>
        </View>

        {/* 3. Quick Overview (3 Metrics Cards) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Quick Overview</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Node Stats</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(shopkeeper)/transactions')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {/* Verified In Stock Card */}
          <View style={[styles.statCard, { borderColor: '#ccfbf1' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#f0fdfa' }]}>
              <ShieldCheck color="#0f766e" size={20} />
            </View>
            <Text style={[styles.statNumber, { color: '#0f766e' }]}>
              {statsData.verifiedCount || statsData.verifiedPacksInStock || 0}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
            <View style={styles.statTrendGreen}>
              <Text style={styles.statTrendGreenText}>
                {statsData.todaySalesCount ? `+${statsData.todaySalesCount} Today` : 'In Stock'}
              </Text>
            </View>
          </View>

          {/* Suspicious Card */}
          <View style={[styles.statCard, { borderColor: '#fef3c7' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#fffbeb' }]}>
              <AlertTriangle color="#d97706" size={20} />
            </View>
            <Text style={[styles.statNumber, { color: '#d97706' }]}>
              {statsData.suspiciousCount || 0}
            </Text>
            <Text style={styles.statLabel}>Duplicates</Text>
            <View style={styles.statTrendAmber}>
              <Text style={styles.statTrendAmberText}>
                {statsData.suspiciousCount > 0 ? 'Review' : 'Clear'}
              </Text>
            </View>
          </View>

          {/* Counterfeit Card */}
          <View style={[styles.statCard, { borderColor: '#fee2e2' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#fef2f2' }]}>
              <ShieldAlert color="#dc2626" size={20} />
            </View>
            <Text style={[styles.statNumber, { color: '#dc2626' }]}>
              {statsData.counterfeitCount || 0}
            </Text>
            <Text style={styles.statLabel}>Counterfeit</Text>
            <View style={styles.statTrendRed}>
              <Text style={styles.statTrendRedText}>
                {statsData.counterfeitCount > 0 ? 'Flagged' : 'Zero Risk'}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Recent Scans & Transactions List */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Recent Scans & Activity</Text>
        </View>

        <View style={styles.recentList}>
          {recentScans.length > 0 ? (
            recentScans.map((item, index) => {
              const isVerified = item.status === 'Verified' || item.status === 'Stock Received' || item.action === 'RECEIVE';
              const isSuspicious = item.status === 'Suspicious' || item.status === 'Duplicate';
              const isLast = index === recentScans.length - 1;

              return (
                <TouchableOpacity
                  key={item.id || index}
                  style={[styles.recentItem, isLast && { borderBottomWidth: 0 }]}
                  onPress={() => router.push('/(shopkeeper)/transactions')}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.recentIcon,
                      isVerified
                        ? { backgroundColor: '#f0fdfa' }
                        : isSuspicious
                        ? { backgroundColor: '#fffbeb' }
                        : { backgroundColor: '#fef2f2' },
                    ]}
                  >
                    {isVerified ? (
                      <ShieldCheck color="#0f766e" size={20} />
                    ) : isSuspicious ? (
                      <AlertTriangle color="#d97706" size={20} />
                    ) : (
                      <ShieldAlert color="#dc2626" size={20} />
                    )}
                  </View>

                  <View style={styles.recentInfo}>
                    <Text style={styles.medicineName} numberOfLines={1}>
                      {item.name || item.medicineName || 'Medicine Pack'}
                    </Text>
                    <Text style={styles.medicineMfg} numberOfLines={1}>
                      Action: {item.action || 'SCAN'} • Batch: {item.batch || item.batchNo || 'N/A'}
                    </Text>
                    <View style={styles.timeRow}>
                      <Clock size={11} color="#94a3b8" style={{ marginRight: 4 }} />
                      <Text style={styles.timeText}>{item.time || 'Recently'}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isVerified
                        ? { backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }
                        : isSuspicious
                        ? { backgroundColor: '#fffbeb', borderColor: '#fef3c7' }
                        : { backgroundColor: '#fef2f2', borderColor: '#fee2e2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isVerified
                          ? { color: '#0f766e' }
                          : isSuspicious
                          ? { color: '#d97706' }
                          : { color: '#dc2626' },
                      ]}
                    >
                      {item.status || 'Verified'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyRecentBox}>
              <Package size={36} color="#cbd5e1" />
              <Text style={styles.emptyRecentText}>No scan activity recorded yet</Text>
              <Text style={styles.emptyRecentSub}>
                Use Inbound or Dispense mode above to scan medicine packages.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  onlinePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    position: 'absolute',
    top: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  shopIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  shopIdChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shopIdText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#475569',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0f766e',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f766e',
    position: 'absolute',
    top: 9,
    right: 9,
  },
  scanCard: {
    backgroundColor: '#0f766e',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  scanCardContent: {
    flex: 1,
    marginRight: 10,
  },
  scanTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  scanTagText: {
    color: '#ccfbf1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  scanCardDesc: {
    fontSize: 12,
    color: '#ccfbf1',
    lineHeight: 16,
    marginBottom: 14,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  scanButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  quickModeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  quickModeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  scanGraphic: {
    opacity: 0.85,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 10,
    color: '#0f766e',
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f766e',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  statTrendGreen: {
    marginTop: 6,
  },
  statTrendGreenText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
  },
  statTrendAmber: {
    marginTop: 6,
  },
  statTrendAmberText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '700',
  },
  statTrendRed: {
    marginTop: 6,
  },
  statTrendRedText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '700',
  },
  recentList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  medicineMfg: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyRecentBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyRecentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
  },
  emptyRecentSub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});
