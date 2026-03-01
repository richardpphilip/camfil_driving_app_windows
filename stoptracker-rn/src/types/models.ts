export type Stop = {
  id: string;
  startTime: string;
  endTime: string | null;
  stopType: string;
  address: string;
  latitude: number;
  longitude: number;
  accountName: string;
  contactName: string;
  contactTitle: string;
  outcome: string;
  notes: string;
  nextStep: string;
  followUpDueDate: string | null;
  followUpEventId: string | null;
  segmentMilesFromPrevStop: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  id: number;
  defaultCalendarId: string | null;
  autoDetectEnabled: number;
  stationaryMinutesThreshold: number;
  stationaryDistanceMetersThreshold: number;
  workdayEndHour: number;
  workdayEndMinute: number;
  summaryEmailTo: string | null;
};

export const defaultSettings: Omit<Settings, 'id'> = {
  defaultCalendarId: null,
  autoDetectEnabled: 0,
  stationaryMinutesThreshold: 8,
  stationaryDistanceMetersThreshold: 80,
  workdayEndHour: 17,
  workdayEndMinute: 0,
  summaryEmailTo: null,
};
