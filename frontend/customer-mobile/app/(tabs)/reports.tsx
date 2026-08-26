import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useReportStore } from '../../src/store/reportStore';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportsScreen() {
  const router = useRouter();
  const { reports } = useReportStore();
  const insets = useSafeAreaInsets();

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'Pending').length;
  const resolvedReports = reports.filter(
    (r) => r.status === 'Reviewed' || r.status === 'Resolved'
  ).length;

  const renderItem = ({ item }: { item: any }) => {
    let statusBg = '#fffbeb';
    let statusText = '#92400e';
    let statusBorder = '#fde68a';
    let StatusIcon = Clock;

    if (item.status === 'Reviewed' || item.status === 'Resolved') {
      statusBg = '#ecfdf5';
      statusText = '#065f46';
      statusBorder = '#a7f3d0';
      StatusIcon = CheckCircle2;
    } else if (item.status === 'Pending') {
      statusBg = '#fff7ed';
      statusText = '#9a3412';
      statusBorder = '#fed7aa';
      StatusIcon = AlertCircle;
    }

    return (
      <View style={styles.reportCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <ShieldAlert size={20} color="#3b00b9" />
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.medicineName} numberOfLines={1}>
                {item.medicineName}
              </Text>
              <Text style={styles.idText}>Investigation Case #{item.id}</Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusBg, borderColor: statusBorder },
            ]}
          >
            <StatusIcon size={12} color={statusText} style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: statusText }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Filed on {item.date}</Text>
          <View style={styles.trackingStatus}>
            <Text style={styles.trackingText}>CDSCO Dispatch Active</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Pharmacovigilance</Text>
          <Text style={styles.headerSubtitle}>
            Adverse drug reactions & counterfeit reports
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newReportBtn}
          onPress={() => router.push('/report')}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#ffffff" style={{ marginRight: 4 }} />
          <Text style={styles.newReportBtnText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{totalReports}</Text>
          <Text style={styles.metricLabel}>Total Filed</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Text style={[styles.metricValue, { color: '#ea580c' }]}>
            {pendingReports}
          </Text>
          <Text style={styles.metricLabel}>Under Review</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Text style={[styles.metricValue, { color: '#059669' }]}>
            {resolvedReports}
          </Text>
          <Text style={styles.metricLabel}>Verified / Done</Text>
        </View>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <FileText size={44} color="#3b00b9" />
          </View>
          <Text style={styles.emptyTitle}>No Safety Reports Filed</Text>
          <Text style={styles.emptySubtitle}>
            Notice any tampered blister packaging or suspicious medication? File a report directly to CDSCO.
          </Text>
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => router.push('/report')}
          >
            <Text style={styles.emptyActionBtnText}>File Your First Report</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: (insets.bottom || 10) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b00b9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#3b00b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  newReportBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  reportCard: {
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
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  idText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  trackingStatus: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trackingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 36,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyActionBtn: {
    backgroundColor: '#3b00b9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
