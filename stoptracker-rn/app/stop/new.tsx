import { router } from 'expo-router';
import { Alert } from 'react-native';

import { StopForm } from '@/src/components/StopForm';
import { upsertStop } from '@/src/repositories/stopsRepository';

export default function NewStopScreen() {
  return (
    <StopForm
      onSubmit={async (values) => {
        await upsertStop({
          ...values,
          endTime: values.endTime || null,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          followUpDueDate: values.followUpDueDate || null,
          followUpEventId: values.followUpEventId || null,
          segmentMilesFromPrevStop: values.segmentMilesFromPrevStop
            ? Number(values.segmentMilesFromPrevStop)
            : null,
        });
        Alert.alert('Saved');
        router.back();
      }}
    />
  );
}
