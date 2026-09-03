import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface PharmaChainLogoProps {
  size?: number;
  colorScheme?: 'cobalt' | 'emerald' | 'white' | 'cyan';
  style?: ViewStyle;
}

export function PharmaChainLogo({
  size = 40,
  colorScheme = 'cobalt',
  style,
}: PharmaChainLogoProps) {
  const getGradients = () => {
    switch (colorScheme) {
      case 'cobalt':
        return {
          start: '#3b82f6',
          mid: '#2563eb',
          end: '#1d4ed8',
        };
      case 'cyan':
        return {
          start: '#38bdf8',
          mid: '#06b6d4',
          end: '#0284c7',
        };
      case 'white':
        return {
          start: '#ffffff',
          mid: '#f1f5f9',
          end: '#e2e8f0',
        };
      case 'emerald':
      default:
        return {
          start: '#10b981',
          mid: '#059669',
          end: '#047857',
        };
    }
  };

  const grads = getGradients();
  const gradId = `pcGrad_${colorScheme}`;

  return (
    <View style={[{ width: size, height: (size * 220) / 200 }, style]}>
      <Svg viewBox="0 0 200 220" width={size} height={(size * 220) / 200} fill="none">
        <Defs>
          <LinearGradient id={gradId} x1="20" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={grads.start} />
            <Stop offset="50%" stopColor={grads.mid} />
            <Stop offset="100%" stopColor={grads.end} />
          </LinearGradient>
        </Defs>

        {/* Upper Right Hexagon */}
        <Path
          d="M130 18 L180 47 L180 105 L130 134 L80 105 L80 47 Z"
          stroke={`url(#${gradId})`}
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Lower Left Hexagon */}
        <Path
          d="M70 86 L120 115 L120 173 L70 202 L20 173 L20 115 Z"
          stroke={`url(#${gradId})`}
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Interlocking 'P' / Chain Link Monogram */}
        <Path
          d="M70 173 L70 65 Q70 42 95 42 L115 42 Q140 42 140 68 Q140 94 115 94 L70 94"
          stroke={`url(#${gradId})`}
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
