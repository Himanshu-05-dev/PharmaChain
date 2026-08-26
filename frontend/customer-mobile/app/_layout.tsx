import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../src/store/authStore";

export default function Layout() {
  const { isAuthenticated, isLoading, setAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inPublicGroup = segments[0] === '(public)';
    
    if (isAuthenticated && inPublicGroup) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      router.replace('/(public)/home');
    }
  }, [isAuthenticated, isLoading, segments, navigationState?.key]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b00b9" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan-result" />
        <Stack.Screen name="report" />
      </Stack>
    </SafeAreaProvider>
  );
}
