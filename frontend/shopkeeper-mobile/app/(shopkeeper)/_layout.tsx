import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import {
  LayoutDashboard,
  Boxes,
  ScanLine,
  History,
  Store,
  Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PharmaTheme } from '../../src/constants/theme';

export default function ShopkeeperLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PharmaTheme.colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 14) : 16,
          left: 16,
          right: 16,
          elevation: 10,
          backgroundColor: '#ffffff',
          borderRadius: 28,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderWidth: 1,
          borderColor: 'rgba(226, 232, 240, 0.95)',
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 22,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Overview */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <LayoutDashboard size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />

      {/* 2. Stock Vault */}
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Stock Vault',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Boxes size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />

      {/* 3. Center Elevated Scan Button */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan POS',
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '800',
                color: focused ? PharmaTheme.colors.primary : '#64748b',
                marginTop: 18,
              }}
            >
              Scan POS
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerScanOuterRing}>
              <View style={[styles.centerScanBtn, focused && styles.centerScanBtnActive]}>
                <ScanLine size={24} color="#ffffff" strokeWidth={2.4} />
              </View>
            </View>
          ),
        }}
      />

      {/* 4. Ledger */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <History size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />

      {/* 5. Terminal Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Store ID',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Store size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapperActive: {
    backgroundColor: '#eff6ff',
  },
  centerScanOuterRing: {
    position: 'absolute',
    top: -24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#dbeafe',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  centerScanBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerScanBtnActive: {
    backgroundColor: '#1d4ed8',
  },
});
