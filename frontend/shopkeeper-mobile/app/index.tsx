import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Redirect href="/(shopkeeper)/dashboard" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
