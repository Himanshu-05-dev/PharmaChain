import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  X,
  ChevronRight,
  Filter,
  Package,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomerStore } from '../../src/store/customerStore';

interface ScanHistoryItem {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  manufacturer: string;
  scannedAt: string;
  location: string;
  status: 'Verified' | 'Suspicious' | 'Counterfeit';
  trustScore: number;
}

const TABS = ['All', 'Verified', 'Suspicious', 'Counterfeit'] as const;

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedMedicines } = useCustomerStore();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const combinedHistory: ScanHistoryItem[] = useMemo(() => {
    return savedMedicines.map((m) => ({
      id: m.id,
      name: m.name,
      genericName: m.genericName || m.name,
      batchNumber: m.batchNumber,
      manufacturer: m.manufacturer,
      scannedAt: m.verifiedAt || 'Recently',
      location: 'Registered Pharmacy',
      status: m.status === 'Suspicious' || m.status === 'Expired' ? 'Suspicious' : 'Verified',
      trustScore: m.safetyScore || 98,
    }));
  }, [savedMedicines]);

  const filteredData = useMemo(() => {
    return combinedHistory.filter((item) => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [combinedHistory, activeTab, searchQuery]);

  const getStatusBadgeConfig = (status: ScanHistoryItem['status']) => {
    switch (status) {
      case 'Verified':
        return {
          icon: <ShieldCheck size={14} color="#059669" />,
          bg: '#ecfdf5',
          text: '#065f46',
          border: '#a7f3d0',
        };
      case 'Suspicious':
        return {
          icon: <AlertTriangle size={14} color="#d97706" />,
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fde68a',
        };
      case 'Counterfeit':
        return {
          icon: <ShieldAlert size={14} color="#dc2626" />,
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fecaca',
        };
    }
  };

  const renderItem = ({ item }: { item: ScanHistoryItem }) => {
    const badge = getStatusBadgeConfig(item.status);
    const isAuthentic = item.status === 'Verified';

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() =>
          router.push({
            pathname: '/scan-result',
            params: { status: isAuthentic ? 'authentic' : 'suspicious' },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.iconContainer,
                item.status === 'Verified'
                  ? styles.iconBgVerified
                  : item.status === 'Suspicious'
                  ? styles.iconBgSuspicious
                  : styles.iconBgCounterfeit,
              ]}
            >
              <Package
                size={18}
                color={
                  item.status === 'Verified'
                    ? '#059669'
                    : item.status === 'Suspicious'
                    ? '#d97706'
                    : '#dc2626'
                }
              />
            </View>
            <View style={styles.medicineTitleGroup}>
              <Text style={styles.medicineName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.genericName} numberOfLines={1}>
                {item.genericName}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: badge.bg, borderColor: badge.border },
            ]}
          >
            {badge.icon}
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardMetaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Batch No.</Text>
            <Text style={styles.metaValueBold}>{item.batchNumber}</Text>
          </View>
          <View style={styles.metaSeparator} />
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Scanned</Text>
            <Text style={styles.metaValue}>{item.scannedAt}</Text>
          </View>
          <View style={styles.metaSeparator} />
          <View style={styles.cardActionBox}>
            <Text style={styles.cardActionText}>Certificate</Text>
            <ChevronRight size={14} color="#3b00b9" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Scan History</Text>
          <Text style={styles.headerSubtitle}>
            {combinedHistory.length} medicine verification {combinedHistory.length === 1 ? 'record' : 'records'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.scanShortcutBtn}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <Text style={styles.scanShortcutText}>+ New Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by medicine or batch number..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === 'All'
              ? combinedHistory.length
              : combinedHistory.filter((i: ScanHistoryItem) => i.status === tab).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              <View
                style={[
                  styles.tabCountPill,
                  isActive && styles.tabCountPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    isActive && styles.tabCountTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: (insets.bottom || 10) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No matching scans found" : "No Medicine Scans Yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try searching with another keyword or change your filter tab."
                : "Scan a medicine 2D DataMatrix or QR code to verify authenticity and build your safety history."}
            </Text>
            {searchQuery !== '' ? (
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchBtnText}>Clear Search</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.clearSearchBtn, { backgroundColor: '#3b00b9', borderColor: '#3b00b9', marginTop: 16 }]}
                onPress={() => router.push('/(tabs)/scan')}
              >
                <Text style={[styles.clearSearchBtnText, { color: '#ffffff' }]}>Scan Medicine QR</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  scanShortcutBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  scanShortcutText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#3b00b9',
    borderColor: '#3b00b9',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabCountPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabCountPillActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  tabCountTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  historyCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBgVerified: {
    backgroundColor: '#ecfdf5',
  },
  iconBgSuspicious: {
    backgroundColor: '#fffbeb',
  },
  iconBgCounterfeit: {
    backgroundColor: '#fef2f2',
  },
  medicineTitleGroup: {
    flex: 1,
  },
  medicineName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  genericName: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaCol: {
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
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  metaValueBold: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '700',
    marginTop: 2,
  },
  metaSeparator: {
    width: 1,
    height: 18,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  cardActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b00b9',
    marginRight: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 14,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  clearSearchBtn: {
    marginTop: 16,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b00b9',
  },
});
