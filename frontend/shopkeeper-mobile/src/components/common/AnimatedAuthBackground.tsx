import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import Svg, { Circle, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AnimatedAuthBackground() {
  const orb1Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb2Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb3Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Floating Orb 1
    const floatOrb1 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Anim, {
          toValue: { x: 30, y: 40 },
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: -20, y: -20 },
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: 0, y: 0 },
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Floating Orb 2
    const floatOrb2 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Anim, {
          toValue: { x: -40, y: 30 },
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: 20, y: -40 },
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: 0, y: 0 },
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Floating Orb 3 (Bottom)
    const floatOrb3 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb3Anim, {
          toValue: { x: 25, y: -30 },
          duration: 7500,
          useNativeDriver: true,
        }),
        Animated.timing(orb3Anim, {
          toValue: { x: -30, y: 20 },
          duration: 8500,
          useNativeDriver: true,
        }),
        Animated.timing(orb3Anim, {
          toValue: { x: 0, y: 0 },
          duration: 7500,
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Subtle Pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    // 5. Continuous Network Mesh Rotation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 35000,
        useNativeDriver: true,
      })
    );

    floatOrb1.start();
    floatOrb2.start();
    floatOrb3.start();
    pulse.start();
    rotate.start();

    return () => {
      floatOrb1.stop();
      floatOrb2.stop();
      floatOrb3.stop();
      pulse.stop();
      rotate.stop();
    };
  }, [orb1Anim, orb2Anim, orb3Anim, pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Base Titanium Ice Canvas */}
      <View style={styles.baseBackground} />

      {/* Floating Glowing Aura 1 (Top Left Cobalt Glow) */}
      <Animated.View
        style={[
          styles.glowOrb,
          styles.glowOrb1,
          {
            transform: [
              { translateX: orb1Anim.x },
              { translateY: orb1Anim.y },
              { scale: pulseAnim },
            ],
          },
        ]}
      />

      {/* Floating Glowing Aura 2 (Top Right Electric Cyan Glow) */}
      <Animated.View
        style={[
          styles.glowOrb,
          styles.glowOrb2,
          {
            transform: [
              { translateX: orb2Anim.x },
              { translateY: orb2Anim.y },
            ],
          },
        ]}
      />

      {/* Floating Glowing Aura 3 (Bottom Center Deep Indigo Glow) */}
      <Animated.View
        style={[
          styles.glowOrb,
          styles.glowOrb3,
          {
            transform: [
              { translateX: orb3Anim.x },
              { translateY: orb3Anim.y },
              { scale: pulseAnim },
            ],
          },
        ]}
      />

      {/* Geometric Network Nodes & Mesh Overlay */}
      <Animated.View
        style={[
          styles.meshContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Svg width={SCREEN_WIDTH * 1.5} height={SCREEN_HEIGHT * 1.5} viewBox="0 0 600 800" fill="none">
          {/* Subtle Grid Network Lines */}
          <Line x1="100" y1="150" x2="300" y2="250" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
          <Line x1="300" y1="250" x2="500" y2="180" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
          <Line x1="300" y1="250" x2="250" y2="500" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
          <Line x1="250" y1="500" x2="450" y2="580" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
          <Line x1="100" y1="150" x2="120" y2="420" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1.5" />
          <Line x1="120" y1="420" x2="250" y2="500" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1.5" />

          {/* Glowing Blockchain Nodes */}
          <Circle cx="100" cy="150" r="5" fill="#3b82f6" fillOpacity="0.4" />
          <Circle cx="300" cy="250" r="6" fill="#06b6d4" fillOpacity="0.5" />
          <Circle cx="500" cy="180" r="4.5" fill="#3b82f6" fillOpacity="0.4" />
          <Circle cx="250" cy="500" r="6" fill="#6366f1" fillOpacity="0.45" />
          <Circle cx="450" cy="580" r="5" fill="#06b6d4" fillOpacity="0.4" />
          <Circle cx="120" cy="420" r="4" fill="#3b82f6" fillOpacity="0.3" />
        </Svg>
      </Animated.View>

      {/* Frosted Titanium Vignette */}
      <View style={styles.vignetteOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    top: -40,
    left: -60,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
  },
  glowOrb2: {
    top: SCREEN_HEIGHT * 0.22,
    right: -70,
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  glowOrb3: {
    bottom: -50,
    left: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    backgroundColor: 'rgba(79, 70, 229, 0.14)',
  },
  meshContainer: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.25,
    left: -SCREEN_WIDTH * 0.25,
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.75,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 250, 252, 0.35)',
  },
});
