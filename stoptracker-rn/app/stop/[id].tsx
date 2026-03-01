import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { StopForm } from '@/src/components/StopForm';
import { getStopById, upsertStop } from '@/src/repositories/stopsRepository';
import type { Stop } from '@/src/types/models';

export default function StopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [stop, setStop] = useState<Stop | null>(null);

  useEffect(() => {
    if (!id) return;
    getStopById(id).then(setStop);
  }, [id]);

  if (!stop) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <StopForm
      initial={stop}
      onSubmit={async (values) => {
        await upsertStop(
          {
            ...values,
            endTime: values.endTime || null,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
            followUpDueDate: values.followUpDueDate || null,
            followUpEventId: values.followUpEventId || null,
            segmentMilesFromPrevStop: values.segmentMilesFromPrevStop
              ? Number(values.segmentMilesFromPrevStop)
              : null,
          },
          id,
        );
        Alert.alert('Saved');
        router.back();
      }}
    />
  );
}
