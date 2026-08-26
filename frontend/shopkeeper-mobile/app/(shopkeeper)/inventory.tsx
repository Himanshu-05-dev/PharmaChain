import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Search,
  Package,
  Boxes,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  X,
  ChevronRight,
  ArrowDownLeft,
  RefreshCw,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getInventory } from '../../src/services/api/shopkeeper';
import { InventoryItem, StockStatus } from '../../src/types';

const TABS: Array<'All' | StockStatus> = [
  'All',
  'In Stock',
  'Low Stock',
  'Expiring Soon',
  'Quarantined',
];

export default function InventoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'All' | StockStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveInventory = useCallback(async () => {
    try {
      const res = await getInventory();
      if (res?.data?.inventory) {
        setInventoryList(res.data.inventory);
      } else if (Array.isArray(res?.inventory)) {
        setInventoryList(res.inventory);
      } else if (Array.isArray(res)) {
        setInventoryList(res);
      }
    } catch (err: any) {
      console.warn('[InventoryScreen] Fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLiveInventory();
    }, [fetchLiveInventory])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveInventory();
  };

  const filteredInventory = useMemo(() => {
    return inventoryList.filter((item) => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.batchNumber || '').toLowerCase().includes(q) ||
        (item.genericName || '').toLowerCase().includes(q) ||
        (item.locationRack || '').toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [inventoryList, activeTab, searchQuery]);

  const getStatusBadgeConfig = (status: StockStatus) => {
    switch (status) {
      case 'In Stock':
        return {
          bg: '#f0fdfa',
          text: '#0f766e',
          border: '#ccfbf1',
          icon: <ShieldCheck size={13} color="#0f766e" />,
        };
      case 'Low Stock':
        return {
          bg: '#fff7ed',
          text: '#ea580c',
          border: '#fed7aa',
          icon: <AlertTriangle size={13} color="#ea580c" />,
        };
      case 'Expiring Soon':
        return {
          bg: '#fffbeb',
          text: '#d97706',
          border: '#fef3c7',
          icon: <Clock size={13} color="#d97706" />,
        };
      case 'Quarantined':
        return {
          bg: '#fef2f2',
          text: '#dc2626',
          border: '#fee2e2',
          icon: <ShieldAlert size={13} color="#dc2626" />,
        };
      default:
        return {
          bg: '#f0fdfa',
          text: '#0f766e',
          border: '#ccfbf1',
          icon: <ShieldCheck size={13} color="#0f766e" />,
        };
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const badge = getStatusBadgeConfig(item.status);

    return (
      <TouchableOpacity
        style={styles.inventoryCard}
        onPress={() => setSelectedItem(item)}
        activeOpacity={0.75}
      >
        <View style={styles.cardTop}>
          <View style={styles.iconBox}>
            <Package size={20} color="#0f766e" />
          </View>
          <View style={styles.itemHeaderInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemGeneric} numberOfLines={1}>
              {item.genericName || item.name}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: badge.bg, borderColor: badge.border },
            ]}
          >
            {badge.icon}
            <Text style={[styles.statusPillText, { color: badge.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardMetaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Batch ID</Text>
            <Text style={styles.metaValueBold}>{item.batchNumber}</Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Stock Qty</Text>
            <Text
              style={[
                styles.metaValueBold,
                item.quantity <= 10 && { color: '#ea580c' },
              ]}
            >
              {item.quantity} Units
            </Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Expiry Date</Text>
            <Text
              style={[
                styles.metaValue,
                item.daysToExpiry <= 30 && { color: '#ea580c', fontWeight: '700' },
              ]}
            >
              {item.expiryDate}
            </Text>
          </View>

          <View style={styles.metaAction}>
            <ChevronRight size={16} color="#0f766e" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.headerTitle}>Medicine Inventory</Text>
            <Text style={styles.headerSubtitle}>
              {inventoryList.length} authenticated batch types tracked
            </Text>
          </View>
          <TouchableOpacity
            style={styles.receiveStockBtn}
            onPress={() => router.push({ pathname: '/(shopkeeper)/scan', params: { mode: 'RECEIVE' } })}
            activeOpacity={0.85}
          >
            <ArrowDownLeft size={14} color="#ffffff" />
            <Text style={styles.receiveStockBtnText}>Receive Stock</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by medicine, batch, or rack..."
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

        {/* Horizontal Filters */}
        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === 'All'
                  ? inventoryList.length
                  : inventoryList.filter((i) => i.status === tab).length;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Inventory List */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0f766e" />
            <Text style={styles.loadingText}>Fetching shop inventory...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredInventory}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: (insets.bottom || 10) + 24 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f766e']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Package size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>
                  {searchQuery ? 'No matching stock found' : 'No inventory items yet'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? 'Try adjusting your search query.'
                    : 'Scan your first inbound medicine delivery to register stock.'}
                </Text>
                <TouchableOpacity
                  style={[styles.receiveStockBtn, { marginTop: 14 }]}
                  onPress={() => router.push({ pathname: '/(shopkeeper)/scan', params: { mode: 'RECEIVE' } })}
                  activeOpacity={0.85}
                >
                  <ArrowDownLeft size={14} color="#ffffff" />
                  <Text style={styles.receiveStockBtnText}>Scan Inbound Stock</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        {/* Batch Inspection Modal */}
        <Modal
          visible={!!selectedItem}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalSheet, { paddingBottom: (insets.bottom || 10) + 20 }]}>
              {selectedItem && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalSheetTitle}>Batch Traceability Record</Text>
                      <Text style={styles.modalSheetSubtitle}>
                        PharmaChain Cryptographic Inventory
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setSelectedItem(null)}
                    >
                      <X size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                    <View
                      style={[
                        styles.modalStatusBanner,
                        {
                          backgroundColor: getStatusBadgeConfig(selectedItem.status).bg,
                          borderColor: getStatusBadgeConfig(selectedItem.status).border,
                        },
                      ]}
                    >
                      <View style={styles.modalStatusIconWrapper}>
                        {getStatusBadgeConfig(selectedItem.status).icon}
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={[
                            styles.modalStatusTitle,
                            { color: getStatusBadgeConfig(selectedItem.status).text },
                          ]}
                        >
                          Stock State: {selectedItem.status}
                        </Text>
                        <Text style={styles.modalStatusDesc}>
                          {selectedItem.quantity} units available in shop inventory
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalGroup}>
                      <Text style={styles.modalGroupName}>Product Details</Text>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Brand Name</Text>
                        <Text style={styles.modalValueBold}>{selectedItem.name}</Text>
                      </View>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Generic Formulation</Text>
                        <Text style={styles.modalValue}>{selectedItem.genericName}</Text>
                      </View>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Manufacturer</Text>
                        <Text style={styles.modalValue}>{selectedItem.manufacturer}</Text>
                      </View>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Batch ID</Text>
                        <Text style={[styles.modalValueBold, { color: '#0f766e' }]}>
                          {selectedItem.batchNumber}
                        </Text>
                      </View>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Expiry Date</Text>
                        <Text style={[styles.modalValueBold, { color: '#dc2626' }]}>
                          {selectedItem.expiryDate}
                        </Text>
                      </View>

                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Stock Location</Text>
                        <Text style={styles.modalValue}>{selectedItem.locationRack}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.modalDismissBtn}
                      onPress={() => setSelectedItem(null)}
                    >
                      <Text style={styles.modalDismissBtnText}>Close Record</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  receiveStockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f766e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  receiveStockBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  tabsWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
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
  listContainer: {
    padding: 16,
    gap: 12,
  },
  inventoryCard: {
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemHeaderInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemGeneric: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
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
  },
  metaValueBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  metaValue: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  metaAction: {
    paddingLeft: 4,
  },
  emptyState: {
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSheetSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 8,
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
    padding: 4,
  },
  modalStatusTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalStatusDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  modalGroup: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalGroupName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  modalValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '500',
  },
  modalValueBold: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  modalDismissBtn: {
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalDismissBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
