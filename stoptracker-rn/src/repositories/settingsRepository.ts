import { z } from 'zod';

import { getDb } from '@/src/db/database';
import type { Settings } from '@/src/types/models';

const settingsSchema = z.object({
  defaultCalendarId: z.string().nullable(),
  autoDetectEnabled: z.coerce.number(),
  stationaryMinutesThreshold: z.coerce.number(),
  stationaryDistanceMetersThreshold: z.coerce.number(),
  workdayEndHour: z.coerce.number(),
  workdayEndMinute: z.coerce.number(),
  summaryEmailTo: z.string().nullable(),
});

export type SettingsInput = z.input<typeof settingsSchema>;

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const row = await db.getFirstAsync<Settings>('SELECT * FROM settings WHERE id = 1;');
  if (!row) {
    await db.runAsync(
      `INSERT INTO settings (
        id, defaultCalendarId, autoDetectEnabled, stationaryMinutesThreshold,
        stationaryDistanceMetersThreshold, workdayEndHour, workdayEndMinute, summaryEmailTo
      ) VALUES (1, NULL, 0, 8, 80, 17, 0, NULL);`,
    );
    return (await getSettings()) as Settings;
  }
  return row;
}

export async function updateSettings(input: SettingsInput): Promise<void> {
  const parsed = settingsSchema.parse(input);
  const db = await getDb();
  await db.runAsync(
    `UPDATE settings SET
      defaultCalendarId = ?,
      autoDetectEnabled = ?,
      stationaryMinutesThreshold = ?,
      stationaryDistanceMetersThreshold = ?,
      workdayEndHour = ?,
      workdayEndMinute = ?,
      summaryEmailTo = ?
     WHERE id = 1;`,
    [
      parsed.defaultCalendarId,
      parsed.autoDetectEnabled,
      parsed.stationaryMinutesThreshold,
      parsed.stationaryDistanceMetersThreshold,
      parsed.workdayEndHour,
      parsed.workdayEndMinute,
      parsed.summaryEmailTo,
    ],
  );
}
