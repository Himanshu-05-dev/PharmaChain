import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const { isAuthenticated, verificationStatus, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const segmentList = segments as string[];
    const rootSegment = segmentList[0];
    const secondSegment = segmentList[1];
    
    const inAuthGroup = rootSegment === '(auth)';
    const inShopkeeperGroup = rootSegment === '(shopkeeper)';
    const isPublic = rootSegment === 'public-scan' || rootSegment === 'verification';

    // Allow public scanning without auth
    if (isPublic) return;

    if (!isAuthenticated) {
      // Unauthenticated users trying to access protected shopkeeper tabs
      if (inShopkeeperGroup || rootSegment === 'index') {
        router.replace('/(auth)/login');
      }
    } else {
      // Authenticated users: Check Verification Status
      if (verificationStatus === 'pending') {
        if (secondSegment !== 'verification-pending') {
          router.replace('/(auth)/verification-pending');
        }
      } else if (verificationStatus === 'rejected') {
        if (secondSegment !== 'verification-rejected' && secondSegment !== 'register') {
          router.replace('/(auth)/verification-rejected');
        }
      } else if (verificationStatus === 'suspended') {
        if (secondSegment !== 'account-suspended') {
          router.replace('/(auth)/account-suspended');
        }
      } else {
        // Verified account: redirect away from auth screens to dashboard
        if (inAuthGroup || rootSegment === 'index') {
          router.replace('/(shopkeeper)/dashboard');
        }
      }
    }
  }, [isAuthenticated, verificationStatus, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#4338ca" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(auth)/registration-submitted" />
        <Stack.Screen name="(auth)/verification-pending" />
        <Stack.Screen name="(auth)/verification-rejected" />
        <Stack.Screen name="(auth)/account-suspended" />
        <Stack.Screen name="(auth)/forgot-password" />
        <Stack.Screen name="(auth)/reset-password" />
        <Stack.Screen name="(shopkeeper)" />
        <Stack.Screen name="verification" options={{ presentation: 'modal' }} />
        <Stack.Screen name="public-scan" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
