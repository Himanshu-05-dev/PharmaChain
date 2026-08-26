import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ShieldCheck,
  Zap,
  ZapOff,
  ScanLine,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Info,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type ScanMode = 'VERIFY' | 'RECEIVE' | 'DISPENSE';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: ScanMode }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>(params.mode || 'DISPENSE');


  useEffect(() => {
    if (params.mode && (params.mode === 'RECEIVE' || params.mode === 'DISPENSE' || params.mode === 'VERIFY')) {
      setScanMode(params.mode);
    }
  }, [params.mode]);


  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <View style={styles.permissionIconCircle}>
          <ScanLine size={48} color="#0284c7" />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          PharmaChain needs camera permission to scan 2D DataMatrix security codes on pharmaceutical shipments.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {}

    setTimeout(() => {
      setLoading(false);
      setScanned(false);
      router.push({ pathname: '/verification', params: { qrData: data, mode: scanMode } });
    }, 600);
  };

  const simulateScan = (id: string) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScanned(false);
      router.push({ pathname: '/verification', params: { id, mode: scanMode } });
    }, 400);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        onBarcodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'datamatrix', 'code128'],
        }}
      />

      {/* Sibling Overlay */}
      <View style={[styles.overlay, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        {/* Top Controls Bar */}
        <View style={styles.topBar}>
          <View style={styles.scannerBadge}>
            <ShieldCheck size={16} color="#10b981" />
            <Text style={styles.scannerBadgeText}>PharmaChain Node</Text>
          </View>

          <TouchableOpacity
            style={[styles.torchBtn, torchOn && styles.torchBtnActive]}
            onPress={() => setTorchOn(!torchOn)}
            activeOpacity={0.8}
          >
            {torchOn ? <Zap size={20} color="#f59e0b" /> : <ZapOff size={20} color="#ffffff" />}
          </TouchableOpacity>
        </View>

        {/* Scan Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[styles.modeBtn, scanMode === 'VERIFY' && styles.modeBtnActive]}
            onPress={() => setScanMode('VERIFY')}
          >
            <ShieldCheck size={14} color={scanMode === 'VERIFY' ? '#ffffff' : '#cbd5e1'} />
            <Text style={[styles.modeBtnText, scanMode === 'VERIFY' && styles.modeBtnTextActive]}>
              Verify
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, scanMode === 'RECEIVE' && styles.modeBtnActive]}
            onPress={() => setScanMode('RECEIVE')}
          >
            <ArrowDownLeft size={14} color={scanMode === 'RECEIVE' ? '#ffffff' : '#cbd5e1'} />
            <Text style={[styles.modeBtnText, scanMode === 'RECEIVE' && styles.modeBtnTextActive]}>
              Inbound
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, scanMode === 'DISPENSE' && styles.modeBtnActive]}
            onPress={() => setScanMode('DISPENSE')}
          >
            <ArrowUpRight size={14} color={scanMode === 'DISPENSE' ? '#ffffff' : '#cbd5e1'} />
            <Text style={[styles.modeBtnText, scanMode === 'DISPENSE' && styles.modeBtnTextActive]}>
              Dispense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Viewfinder Target Frame */}
        <View style={styles.viewFinderContainer}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={styles.laserLine} />
          </View>

          <Text style={styles.instructionTitle}>
            {scanMode === 'VERIFY'
              ? 'Scan to Inspect Pack'
              : scanMode === 'RECEIVE'
              ? 'Scan Inbound Delivery'
              : 'Scan to Dispense Pack'}
          </Text>
          <Text style={styles.instructionSub}>
            Align the 2D DataMatrix or QR code within the illuminated corners
          </Text>
        </View>

        {/* Bottom Simulation Helpers */}
        <View style={[styles.bottomControls, { paddingBottom: (insets.bottom || 10) + 16 }]}>
          <View style={styles.simLabelRow}>
            <Info size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.simLabelText}>Interactive Triggers</Text>
          </View>
          <View style={styles.simButtonsRow}>
            <TouchableOpacity
              style={styles.simAuthenticBtn}
              onPress={() => simulateScan('1')}
              activeOpacity={0.8}
            >
              <Text style={styles.simAuthenticText}>✓ Authentic Pack</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simSuspiciousBtn}
              onPress={() => simulateScan('4')}
              activeOpacity={0.8}
            >
              <Text style={styles.simSuspiciousText}>⚠️ Counterfeit Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Verifying Blockchain Genesis...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
  },
  scannerBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  torchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  torchBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: '#f59e0b',
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 4,
    alignSelf: 'center',
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: '#0284c7',
  },
  modeBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  viewFinderContainer: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#10b981',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 18,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 18,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 18,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 18,
  },
  laserLine: {
    width: '85%',
    height: 2,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  instructionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  instructionSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 16,
  },
  bottomControls: {
    alignItems: 'center',
  },
  simLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  simLabelText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  simAuthenticBtn: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    alignItems: 'center',
  },
  simAuthenticText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  simSuspiciousBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  simSuspiciousText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 15,
    fontWeight: '700',
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  permissionIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: '#3b00b9',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
