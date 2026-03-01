import * as SQLite from 'expo-sqlite';
import dayjs from 'dayjs';

const dbPromise = SQLite.openDatabaseAsync('stoptracker.db');

type Migration = {
  version: number;
  statements: string[];
};

const migrations: Migration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS stops (
        id TEXT PRIMARY KEY NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        stopType TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accountName TEXT NOT NULL,
        contactName TEXT NOT NULL,
        contactTitle TEXT NOT NULL,
        outcome TEXT NOT NULL,
        notes TEXT NOT NULL,
        nextStep TEXT NOT NULL,
        followUpDueDate TEXT,
        followUpEventId TEXT,
        segmentMilesFromPrevStop REAL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY NOT NULL,
        defaultCalendarId TEXT,
        autoDetectEnabled INTEGER NOT NULL,
        stationaryMinutesThreshold INTEGER NOT NULL,
        stationaryDistanceMetersThreshold INTEGER NOT NULL,
        workdayEndHour INTEGER NOT NULL,
        workdayEndMinute INTEGER NOT NULL,
        summaryEmailTo TEXT
      );`,
    ],
  },
];

const seedStatements = [
  `INSERT OR IGNORE INTO settings (
    id, defaultCalendarId, autoDetectEnabled, stationaryMinutesThreshold,
    stationaryDistanceMetersThreshold, workdayEndHour, workdayEndMinute, summaryEmailTo
  ) VALUES (1, NULL, 0, 8, 80, 17, 0, NULL);`,
  `INSERT OR IGNORE INTO stops (
    id, startTime, endTime, stopType, address, latitude, longitude, accountName,
    contactName, contactTitle, outcome, notes, nextStep, followUpDueDate,
    followUpEventId, segmentMilesFromPrevStop, createdAt, updatedAt
  ) VALUES (
    'seed-1',
    '${dayjs().hour(9).minute(0).second(0).toISOString()}',
    '${dayjs().hour(9).minute(45).second(0).toISOString()}',
    'customer-visit',
    '123 Main St, Springfield',
    39.799,
    -89.644,
    'Acme Manufacturing',
    'Jordan Lee',
    'Plant Manager',
    'Demo completed',
    'Discussed filter replacement schedule',
    'Send quote by Friday',
    '${dayjs().add(3, 'day').toISOString()}',
    NULL,
    0,
    '${dayjs().toISOString()}',
    '${dayjs().toISOString()}'
  );`,
];

export async function getDb() {
  return dbPromise;
}

export async function initializeDatabase() {
  const db = await getDb();
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = result?.user_version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion).sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      for (const statement of migration.statements) {
        await db.execAsync(statement);
      }
      await db.execAsync(`PRAGMA user_version = ${migration.version};`);
    });
  }

  if (__DEV__) {
    for (const statement of seedStatements) {
      await db.execAsync(statement);
    }
  }
}
