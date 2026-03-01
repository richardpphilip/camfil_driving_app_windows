import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Stop } from '@/src/types/models';

type StopFormValues = {
  startTime: string;
  endTime: string;
  stopType: string;
  address: string;
  latitude: string;
  longitude: string;
  accountName: string;
  contactName: string;
  contactTitle: string;
  outcome: string;
  notes: string;
  nextStep: string;
  followUpDueDate: string;
  followUpEventId: string;
  segmentMilesFromPrevStop: string;
};

export function StopForm({
  initial,
  onSubmit,
}: {
  initial?: Stop | null;
  onSubmit: (values: StopFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<StopFormValues>({
    startTime: initial?.startTime ?? new Date().toISOString(),
    endTime: initial?.endTime ?? '',
    stopType: initial?.stopType ?? 'customer-visit',
    address: initial?.address ?? '',
    latitude: String(initial?.latitude ?? 0),
    longitude: String(initial?.longitude ?? 0),
    accountName: initial?.accountName ?? '',
    contactName: initial?.contactName ?? '',
    contactTitle: initial?.contactTitle ?? '',
    outcome: initial?.outcome ?? '',
    notes: initial?.notes ?? '',
    nextStep: initial?.nextStep ?? '',
    followUpDueDate: initial?.followUpDueDate ?? '',
    followUpEventId: initial?.followUpEventId ?? '',
    segmentMilesFromPrevStop: String(initial?.segmentMilesFromPrevStop ?? ''),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(values).map(([key, value]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [key]: text }))}
          />
        </View>
      ))}
      <Pressable style={styles.button} onPress={() => onSubmit(values)}>
        <Text style={styles.buttonText}>Save Stop</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  field: { gap: 4 },
  label: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#111827', borderRadius: 8, padding: 12, marginTop: 8, marginBottom: 24 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
