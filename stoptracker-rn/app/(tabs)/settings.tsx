import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getSettings, updateSettings } from '@/src/repositories/settingsRepository';

export default function SettingsScreen() {
  const [form, setForm] = useState({
    defaultCalendarId: '',
    autoDetectEnabled: '0',
    stationaryMinutesThreshold: '8',
    stationaryDistanceMetersThreshold: '80',
    workdayEndHour: '17',
    workdayEndMinute: '0',
    summaryEmailTo: '',
  });

  useFocusEffect(
    useCallback(() => {
      getSettings().then((settings) => {
        setForm({
          defaultCalendarId: settings.defaultCalendarId ?? '',
          autoDetectEnabled: String(settings.autoDetectEnabled),
          stationaryMinutesThreshold: String(settings.stationaryMinutesThreshold),
          stationaryDistanceMetersThreshold: String(settings.stationaryDistanceMetersThreshold),
          workdayEndHour: String(settings.workdayEndHour),
          workdayEndMinute: String(settings.workdayEndMinute),
          summaryEmailTo: settings.summaryEmailTo ?? '',
        });
      });
    }, []),
  );

  const save = async () => {
    await updateSettings({
      defaultCalendarId: form.defaultCalendarId || null,
      autoDetectEnabled: Number(form.autoDetectEnabled),
      stationaryMinutesThreshold: Number(form.stationaryMinutesThreshold),
      stationaryDistanceMetersThreshold: Number(form.stationaryDistanceMetersThreshold),
      workdayEndHour: Number(form.workdayEndHour),
      workdayEndMinute: Number(form.workdayEndMinute),
      summaryEmailTo: form.summaryEmailTo || null,
    });
    Alert.alert('Saved');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(form).map(([key, value]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => setForm((prev) => ({ ...prev, [key]: text }))}
          />
        </View>
      ))}
      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  field: { gap: 4 },
  label: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#111827', borderRadius: 8, padding: 12, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
