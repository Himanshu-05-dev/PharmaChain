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
  ShieldAlert,
  X,
  ChevronRight,
  ScanLine,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomerStore } from '../../src/store/customerStore';

const TABS = ['All', 'Verified', 'Suspicious'] as const;

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedMedicines, scanHistory, clearHistory } = useCustomerStore();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const combinedList = useMemo(() => {
    const list = [...scanHistory];
    savedMedicines.forEach((med) => {
      if (!list.some((item) => item.packId === med.packId || item.id === med.id)) {
        list.push({
          id: med.id,
          name: med.name,
          genericName: med.genericName || med.name,
          batchNumber: med.batchNumber,
          manufacturer: med.manufacturer,
          scannedAt: med.verifiedAt || 'Saved in Cabinet',
          location: 'Registered Pharmacy',
          status:
            med.status === 'Suspicious' || med.status === 'Expired'
              ? 'Suspicious'
              : 'Verified',
          trustScore: med.safetyScore || 98,
          packId: med.packId,
        });
      }
    });
    return list;
  }, [savedMedicines, scanHistory]);

  const filteredData = useMemo(() => {
    return combinedList.filter((item) => {
      const matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Verified' && item.status === 'Verified') ||
        (activeTab === 'Suspicious' &&
          (item.status === 'Suspicious' || item.status === 'Counterfeit'));

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [combinedList, activeTab, searchQuery]);

  const renderItem = ({ item }: { item: any }) => {
    const isAuthentic = item.status === 'Verified';

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() =>
          router.push({
            pathname: '/scan-result',
            params: {
              qrData: item.packId,
              status: isAuthentic ? 'authentic' : 'suspicious',
            },
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.iconBox,
                isAuthentic ? styles.iconBoxSuccess : styles.iconBoxWarning,
              ]}
            >
              {isAuthentic ? (
                <ShieldCheck size={20} color="#ea580c" />
              ) : (
                <ShieldAlert size={20} color="#dc2626" />
              )}
            </View>
            <View style={styles.cardTitleInfo}>
              <Text style={styles.medicineName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.genericText} numberOfLines={1}>
                {item.genericName}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.badge,
              isAuthentic ? styles.badgeSuccess : styles.badgeWarning,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isAuthentic ? styles.badgeTextSuccess : styles.badgeTextWarning,
              ]}
            >
              {isAuthentic ? '100% Genuine' : 'Flagged'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardMetaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Batch No.</Text>
            <Text style={styles.metaValue}>{item.batchNumber}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Manufacturer</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {item.manufacturer}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Trust Score</Text>
            <Text
              style={[
                styles.metaValue,
                { color: isAuthentic ? '#ea580c' : '#dc2626', fontWeight: '800' },
              ]}
            >
              {item.trustScore}/100
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.scannedTimeText}>{item.scannedAt}</Text>
          <View style={styles.viewCertificateAction}>
            <Text style={styles.viewCertText}>View Certificate</Text>
            <ChevronRight size={14} color="#ea580c" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 24) + 8 },
        ]}
      >
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>Scan History</Text>
            <Text style={styles.headerSubtitle}>
              Cryptographic verification ledger records
            </Text>
          </View>
          {combinedList.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={clearHistory}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color="#78716c" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#a8a29e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by medicine, batch, or brand..."
            placeholderTextColor="#a8a29e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#a8a29e" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabChip,
                  isActive && styles.tabChipActive,
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    isActive && styles.tabChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: (insets.bottom || 10) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <ScanLine size={36} color="#ff5a36" />
            </View>
            <Text style={styles.emptyTitle}>No Verification Records Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'No matching scan results found for your query.'
                : 'Your scanned medicines and cryptographic verification certificates will be stored here.'}
            </Text>
            <TouchableOpacity
              style={styles.scanNowBtn}
              onPress={() => router.push('/(tabs)/scan')}
              activeOpacity={0.85}
            >
              <ScanLine size={16} color="#ffffff" />
              <Text style={styles.scanNowBtnText}>Scan Medicine Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf7', // Warm ivory
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3ede8',
    paddingBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1c1917',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#78716c',
    marginTop: 2,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffaf5',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1c1917',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tabChipActive: {
    backgroundColor: '#ff5a36',
    borderColor: '#ff5a36',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#78716c',
  },
  tabChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 18,
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxSuccess: {
    backgroundColor: '#ffedd5',
  },
  iconBoxWarning: {
    backgroundColor: '#fff1f2',
  },
  cardTitleInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1c1917',
    marginBottom: 2,
  },
  genericText: {
    fontSize: 11,
    color: '#78716c',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeSuccess: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  badgeWarning: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  badgeTextSuccess: {
    color: '#c2410c',
  },
  badgeTextWarning: {
    color: '#9f1239',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff7ed',
    marginVertical: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: '#a8a29e',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    color: '#1c1917',
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#fffaf5',
    paddingTop: 10,
  },
  scannedTimeText: {
    fontSize: 10,
    color: '#a8a29e',
  },
  viewCertificateAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewCertText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffedd5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fed7aa',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1c1917',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
    marginBottom: 20,
  },
  scanNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ff5a36',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  scanNowBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});
