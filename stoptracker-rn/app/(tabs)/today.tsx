import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { deleteStop, getTodayStops } from '@/src/repositories/stopsRepository';
import type { Stop } from '@/src/types/models';

export default function TodayScreen() {
  const [stops, setStops] = useState<Stop[]>([]);

  const load = useCallback(async () => {
    setStops(await getTodayStops());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onDelete = (id: string) => {
    Alert.alert('Delete stop?', 'This cannot be undone.', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteStop(id);
          await load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Link href="/stop/new" asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>+ Create Stop</Text>
        </Pressable>
      </Link>

      <FlatList
        data={stops}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No stops for today yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Link href={{ pathname: '/stop/[id]', params: { id: item.id } }} style={styles.rowMain}>
              <Text style={styles.title}>{item.accountName || 'Untitled stop'}</Text>
              <Text>{item.address}</Text>
              <Text>{new Date(item.startTime).toLocaleTimeString()}</Text>
            </Link>
            <Pressable onPress={() => onDelete(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  cta: { backgroundColor: '#111827', borderRadius: 8, padding: 12 },
  ctaText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  row: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowMain: { flex: 1 },
  title: { fontWeight: '700' },
  delete: { color: '#b91c1c', fontWeight: '600' },
});
