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
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldAlert,
  ShieldCheck,
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
    let statusBg = '#fff7ed';
    let statusText = '#c2410c';
    let statusBorder = '#fed7aa';
    let StatusIcon = Clock;

    if (item.status === 'Reviewed' || item.status === 'Resolved') {
      statusBg = '#fff5f5';
      statusText = '#ff5a36';
      statusBorder = '#fed7aa';
      StatusIcon = CheckCircle2;
    } else if (item.status === 'Pending') {
      statusBg = '#fff1f2';
      statusText = '#e11d48';
      statusBorder = '#fecdd3';
      StatusIcon = AlertCircle;
    }

    return (
      <View style={styles.reportCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <ShieldAlert size={20} color="#ff5a36" />
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.medicineName} numberOfLines={1}>
                {item.medicineName}
              </Text>
              <Text style={styles.idText}>Incident Case #{item.id}</Text>
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
          <Text style={styles.dateText}>Filed on {item.date || 'Today'}</Text>
          <View style={styles.trackingStatus}>
            <Text style={styles.trackingText}>CDSCO Incident Logged</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Pharmacovigilance</Text>
          <Text style={styles.headerSubtitle}>
            Adverse drug reactions & counterfeit reports
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newReportBtn}
          onPress={() => router.push('/report')}
          activeOpacity={0.85}
        >
          <Plus size={16} color="#ffffff" strokeWidth={2.5} />
          <Text style={styles.newReportText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards Strip (Warm Sunset) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCount}>{totalReports}</Text>
          <Text style={styles.summaryLabel}>Total Cases</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryCount, { color: '#ea580c' }]}>
            {pendingReports}
          </Text>
          <Text style={styles.summaryLabel}>In Review</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryCount, { color: '#ff5a36' }]}>
            {resolvedReports}
          </Text>
          <Text style={styles.summaryLabel}>Resolved</Text>
        </View>
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
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
              <ShieldCheck size={36} color="#ff5a36" />
            </View>
            <Text style={styles.emptyTitle}>No Incidents Reported</Text>
            <Text style={styles.emptySubtitle}>
              If you detect counterfeit packaging, suspicious quality, or an adverse reaction, file a complaint directly to CDSCO.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/report')}
              activeOpacity={0.85}
            >
              <Plus size={16} color="#ffffff" />
              <Text style={styles.emptyBtnText}>File Incident Report</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3ede8',
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
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ff5a36',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  newReportText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1c1917',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#78716c',
    fontWeight: '600',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    gap: 12,
  },
  reportCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffedd5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1c1917',
  },
  idText: {
    fontSize: 11,
    color: '#78716c',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  description: {
    fontSize: 12,
    color: '#44403c',
    lineHeight: 17,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#fffaf5',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 11,
    color: '#a8a29e',
  },
  trackingStatus: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  trackingText: {
    fontSize: 10,
    color: '#c2410c',
    fontWeight: '800',
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
    maxWidth: 270,
    marginBottom: 20,
  },
  emptyBtn: {
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
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});
