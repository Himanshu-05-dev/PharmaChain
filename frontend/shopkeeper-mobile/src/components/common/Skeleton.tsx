import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonStatCard() {
  return (
    <View style={styles.statCardSkeleton}>
      <View style={styles.rowBetween}>
        <Skeleton width={36} height={36} borderRadius={12} />
        <Skeleton width={48} height={16} borderRadius={6} />
      </View>
      <Skeleton width={60} height={28} borderRadius={6} style={{ marginTop: 12 }} />
      <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 6 }} />
      <Skeleton width={100} height={10} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
  );
}

export function SkeletonInventoryCard() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.rowTop}>
        <Skeleton width={40} height={40} borderRadius={12} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Skeleton width="70%" height={16} borderRadius={4} />
          <Skeleton width="45%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
        <Skeleton width={65} height={22} borderRadius={8} />
      </View>
      <View style={styles.divider} />
      <View style={styles.rowBetween}>
        <Skeleton width="28%" height={14} borderRadius={4} />
        <Skeleton width="28%" height={14} borderRadius={4} />
        <Skeleton width="28%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

export function SkeletonHistoryCard() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.rowTop}>
        <Skeleton width={42} height={42} borderRadius={12} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.rowBetween}>
            <Skeleton width="60%" height={15} borderRadius={4} />
            <Skeleton width={60} height={18} borderRadius={6} />
          </View>
          <Skeleton width="80%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
          <Skeleton width={70} height={10} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#cbd5e1',
  },
  statCardSkeleton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardSkeleton: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
});
