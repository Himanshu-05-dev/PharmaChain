import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, Sparkles, Building2, Eye } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VideoTeaser() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>
          Check out the journey of your medicines 👉
        </Text>
      </View>

      {/* 16:9 Video Teaser Card */}
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.9}
      >
        {/* Background Visual Simulator (Simulating warehouse shelves / cold chain footage) */}
        <View style={styles.videoStage}>
          {/* Blue Bin Warehouse Racks Mock Graphic */}
          <View style={styles.rackRow}>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-A1</Text></View>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-A2</Text></View>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-A3</Text></View>
          </View>
          <View style={styles.rackRow}>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-B1</Text></View>
            <View style={[styles.blueBin, styles.activeBin]}><Text style={styles.binText}>25°C - 30°C</Text></View>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-B3</Text></View>
          </View>
          <View style={styles.rackRow}>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-C1</Text></View>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-C2</Text></View>
            <View style={styles.blueBin}><Text style={styles.binText}>BATCH-C3</Text></View>
          </View>

          {/* Dark Overlay with Play Icon */}
          <View style={styles.playOverlay}>
            <View style={styles.playButtonCircle}>
              {isPlaying ? (
                <Pause size={28} color="#ffffff" fill="#ffffff" />
              ) : (
                <Play size={28} color="#ffffff" fill="#ffffff" style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>

          {/* Lower Third Caption Burned In */}
          <View style={styles.lowerThirdCaption}>
            <View style={styles.liveTag}>
              <View style={styles.liveRedDot} />
              <Text style={styles.liveTagText}>FACILITY AUDIT FOOTAGE</Text>
            </View>
            <Text style={styles.captionText}>
              description: your medicines are stored in 25 to 30°C with active cold chain temperature sensors
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headerRow: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17181A',
    letterSpacing: -0.3,
  },
  videoCard: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3D9DB',
    shadowColor: '#17181A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  videoStage: {
    flex: 1,
    backgroundColor: '#0c4a6e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 14,
  },
  rackRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    opacity: 0.85,
  },
  blueBin: {
    width: 90,
    height: 38,
    backgroundColor: '#0284c7',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  activeBin: {
    backgroundColor: '#0369a1',
    borderColor: '#7dd3fc',
  },
  binText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 83, 66, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  lowerThirdCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  liveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5342',
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FF5342',
    letterSpacing: 0.6,
  },
  captionText: {
    fontSize: 11,
    color: '#ffffff',
    lineHeight: 15,
    fontWeight: '500',
  },
});
