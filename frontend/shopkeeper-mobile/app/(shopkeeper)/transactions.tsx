import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Package,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getHistory } from '../../src/services/api/shopkeeper';

const TABS = ['All', 'Verified', 'Suspicious', 'Counterfeit'] as const;

export default function TransactionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await getHistory({ limit: 50 });
      if (res?.data?.history) {
        setHistoryList(res.data.history);
      } else if (Array.isArray(res?.history)) {
        setHistoryList(res.history);
      } else if (Array.isArray(res)) {
        setHistoryList(res);
      }
    } catch (err: any) {
      console.warn('[TransactionsScreen] fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const filteredData = useMemo(() => {
    return activeTab === 'All'
      ? historyList
      : historyList.filter((item) => item.status === activeTab);
  }, [historyList, activeTab]);

  const renderItem = ({ item }: { item: any }) => {
    const isVerified = item.status === 'Verified' || item.status === 'Stock Received' || item.action === 'RECEIVE';
    const isSuspicious = item.status === 'Suspicious' || item.status === 'Duplicate';

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => {
          if (item.packId) {
            router.push({ pathname: '/verification', params: { qrData: item.packId, mode: 'VERIFY' } });
          }
        }}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.iconWrapper,
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
        <View style={styles.infoWrapper}>
          <Text style={styles.medicineName}>{item.name || item.medicineName || 'Medicine Pack'}</Text>
          <Text style={styles.timeText}>
            Action: {item.action || 'SCAN'} • Batch: {item.batch || item.batchNo || 'N/A'} • {item.time || 'Recently'}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            isVerified
              ? { backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }
              : isSuspicious
              ? { backgroundColor: '#fffbeb', borderColor: '#fef3c7' }
              : { backgroundColor: '#fef2f2', borderColor: '#fee2e2' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(shopkeeper)/dashboard');
          }}
          style={styles.iconButton}
        >
          <ArrowLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History & Audit Trail</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === 'All'
              ? historyList.length
              : historyList.filter((item) => item.status === tab).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0f766e" />
          <Text style={styles.loadingText}>Fetching transaction logs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f766e']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No transaction logs found</Text>
              <Text style={styles.emptySubtitle}>
                Scans and sales recorded in your shop will be logged here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  activeTabButton: {
    backgroundColor: '#0f766e',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  timeText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
