import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { checkBackendHealth } from '../src/api/health';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkBackendHealth()
      .then((health) => {
        console.info(`AurumPay backend: ${health.status}`);
      })
      .catch(() => {
        console.info('AurumPay backend is unavailable during startup.');
      });

    const timer = setTimeout(() => {
      router.replace('/auth/welcome');
    }, 2400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Image
        source={require('../assets/images/aurumpay-splash.png')}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F7F1EA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
