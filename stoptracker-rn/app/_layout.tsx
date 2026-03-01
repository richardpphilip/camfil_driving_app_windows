import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { initializeDatabase } from '@/src/db/database';

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase().catch((error) => {
      console.error('DB initialization failed', error);
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="stop/[id]" options={{ title: 'Stop Detail' }} />
      <Stack.Screen name="stop/new" options={{ title: 'New Stop' }} />
    </Stack>
  );
}
