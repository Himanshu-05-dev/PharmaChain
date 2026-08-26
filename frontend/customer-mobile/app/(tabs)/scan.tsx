import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ShieldCheck,
  Zap,
  ZapOff,
  ScanLine,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <View style={styles.permissionIconCircle}>
          <ScanLine size={48} color="#3b00b9" />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          PharmaChain needs camera permission to scan security QR codes and barcodes on medicine packaging.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: any) => {
    if (scanned) return;
    setScanned(true);

    // Navigate to scan-result with live qrData for real backend verification
    router.push({ pathname: '/scan-result', params: { qrData: data } });

    setTimeout(() => setScanned(false), 2000);
  };

  const simulateScan = (status: 'authentic' | 'suspicious') => {
    if (scanned) return;
    setScanned(true);
    router.push({ pathname: '/scan-result', params: { status } });
    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <View style={[styles.overlay, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.scannerBadge}>
              <ShieldCheck size={16} color="#10b981" />
              <Text style={styles.scannerBadgeText}>PharmaChain Scanner</Text>
            </View>
            <TouchableOpacity
              style={[styles.torchBtn, torchOn && styles.torchBtnActive]}
              onPress={() => setTorchOn(!torchOn)}
              activeOpacity={0.8}
            >
              {torchOn ? <Zap size={20} color="#f59e0b" /> : <ZapOff size={20} color="#ffffff" />}
            </TouchableOpacity>
          </View>

          {/* Scanner Viewfinder Box */}
          <View style={styles.viewFinderContainer}>
            <View style={styles.scanFrame}>
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              <View style={styles.laserLine} />
            </View>

            <Text style={styles.instructionTitle}>Align QR or Barcode</Text>
            <Text style={styles.instructionSub}>
              Position the 2D DataMatrix or barcode within the illuminated frame
            </Text>
          </View>

          {/* Live Scanner Info Footer */}
          <View style={[styles.bottomControls, { paddingBottom: (insets.bottom || 10) + 20 }]}>
            <View style={styles.simLabelRow}>
              <ShieldCheck size={14} color="#10b981" />
              <Text style={[styles.simLabelText, { color: '#10b981', fontWeight: '700' }]}>
                Live Cryptographic Verification
              </Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center' }}>
              ES256 Signature Verification • Hyperledger Fabric Consensus
            </Text>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
  viewFinderContainer: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    backgroundColor: 'transparent',
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
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
    marginBottom: 6,
    textAlign: 'center',
  },
  instructionSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 17,
  },
  bottomControls: {
    alignItems: 'center',
  },
  simLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  simLabelText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  simAuthenticBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 6,
  },
  simAuthenticText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  simSuspiciousBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f97316',
    gap: 6,
  },
  simSuspiciousText: {
    color: '#f97316',
    fontSize: 13,
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
    backgroundColor: '#f3e8ff',
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
