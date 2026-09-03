import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { ShieldCheck, Share2, Sparkles } from 'lucide-react-native';

interface Props {
  medicineName?: string;
  batchId?: string;
}

export default function BrandStrip({
  medicineName = 'Verified Formulation',
  batchId = 'B0260074A',
}: Props) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `PharmaChain Authenticity Certificate: ${medicineName} (Batch ${batchId}) verified genuine on Hyperledger Fabric ledger.`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo & Trust Wordmark */}
      <View style={styles.brandLockup}>
        <View style={styles.brandLogoCircle}>
          <ShieldCheck size={18} color="#ffffff" strokeWidth={2.4} />
        </View>
        <View>
          <Text style={styles.brandName}>PharmaChain</Text>
          <View style={styles.badgePill}>
            <Sparkles size={9} color="#2E6B4C" />
            <Text style={styles.badgePillText}>TRUST PROTOCOL</Text>
          </View>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Share2 size={18} color="#17181A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3D9DB',
    marginBottom: 20,
    shadowColor: '#17181A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#17181A',
    letterSpacing: -0.3,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DFF9E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  badgePillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2E6B4C',
    letterSpacing: 0.4,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
