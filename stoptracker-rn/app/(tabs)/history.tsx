import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getHistorySummary } from '@/src/repositories/stopsRepository';

export default function HistoryScreen() {
  const [rows, setRows] = useState<Array<{ day: string; stopCount: number; totalMiles: number }>>([]);

  useFocusEffect(
    useCallback(() => {
      getHistorySummary().then(setRows);
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.day}
        ListEmptyComponent={<Text>No history yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{item.day}</Text>
            <Text>Stops: {item.stopCount}</Text>
            <Text>Miles: {Number(item.totalMiles).toFixed(1)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 12 },
  day: { fontWeight: '700' },
});
