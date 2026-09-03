import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ScanLine } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onPress?: () => void;
  title?: string;
}

export default function StickyCTA({
  onPress,
  title = 'Scan more medicines',
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.stickyContainer, { bottom: Math.max(insets.bottom, 14) + 8 }]}>
      <TouchableOpacity
        style={styles.pillButton}
        onPress={onPress || (() => router.push('/(tabs)/scan'))}
        activeOpacity={0.88}
      >
        <ScanLine size={18} color="#ffffff" strokeWidth={2.4} />
        <Text style={styles.pillText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF5342', // Brand accent from spec
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    shadowColor: '#FF5342',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
});
