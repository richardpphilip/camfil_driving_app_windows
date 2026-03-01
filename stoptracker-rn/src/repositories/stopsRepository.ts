import dayjs from 'dayjs';
import { z } from 'zod';

import { getDb } from '@/src/db/database';
import type { Stop } from '@/src/types/models';
import { createId } from '@/src/utils/uuid';

const stopSchema = z.object({
  startTime: z.string(),
  endTime: z.string().nullable(),
  stopType: z.string().min(1),
  address: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  accountName: z.string(),
  contactName: z.string(),
  contactTitle: z.string(),
  outcome: z.string(),
  notes: z.string(),
  nextStep: z.string(),
  followUpDueDate: z.string().nullable(),
  followUpEventId: z.string().nullable(),
  segmentMilesFromPrevStop: z.coerce.number().nullable(),
});

export type StopInput = z.input<typeof stopSchema>;

export async function getTodayStops(): Promise<Stop[]> {
  const db = await getDb();
  const start = dayjs().startOf('day').toISOString();
  const end = dayjs().endOf('day').toISOString();
  return db.getAllAsync<Stop>(
    'SELECT * FROM stops WHERE startTime BETWEEN ? AND ? ORDER BY startTime ASC;',
    [start, end],
  );
}

export async function getStopById(id: string): Promise<Stop | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Stop>('SELECT * FROM stops WHERE id = ?;', [id]);
  return row ?? null;
}

export async function upsertStop(input: StopInput, id?: string): Promise<string> {
  const parsed = stopSchema.parse(input);
  const db = await getDb();
  const now = new Date().toISOString();
  const stopId = id ?? createId();

  await db.runAsync(
    `INSERT INTO stops (
      id, startTime, endTime, stopType, address, latitude, longitude,
      accountName, contactName, contactTitle, outcome, notes, nextStep,
      followUpDueDate, followUpEventId, segmentMilesFromPrevStop, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      startTime=excluded.startTime,
      endTime=excluded.endTime,
      stopType=excluded.stopType,
      address=excluded.address,
      latitude=excluded.latitude,
      longitude=excluded.longitude,
      accountName=excluded.accountName,
      contactName=excluded.contactName,
      contactTitle=excluded.contactTitle,
      outcome=excluded.outcome,
      notes=excluded.notes,
      nextStep=excluded.nextStep,
      followUpDueDate=excluded.followUpDueDate,
      followUpEventId=excluded.followUpEventId,
      segmentMilesFromPrevStop=excluded.segmentMilesFromPrevStop,
      updatedAt=excluded.updatedAt;`,
    [
      stopId,
      parsed.startTime,
      parsed.endTime,
      parsed.stopType,
      parsed.address,
      parsed.latitude,
      parsed.longitude,
      parsed.accountName,
      parsed.contactName,
      parsed.contactTitle,
      parsed.outcome,
      parsed.notes,
      parsed.nextStep,
      parsed.followUpDueDate,
      parsed.followUpEventId,
      parsed.segmentMilesFromPrevStop,
      now,
      now,
    ],
  );

  return stopId;
}

export async function deleteStop(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM stops WHERE id = ?;', [id]);
}

export async function getHistorySummary(): Promise<Array<{ day: string; stopCount: number; totalMiles: number }>> {
  const db = await getDb();
  return db.getAllAsync<{ day: string; stopCount: number; totalMiles: number }>(
    `SELECT substr(startTime, 1, 10) AS day,
        COUNT(*) AS stopCount,
        COALESCE(SUM(segmentMilesFromPrevStop), 0) AS totalMiles
     FROM stops
     GROUP BY day
     ORDER BY day DESC;`,
  );
}
