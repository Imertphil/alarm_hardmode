// utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskType = "math" | "vocab";

export type Alarm = {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  task: {
    type: TaskType;
    count: number;
  };
};

const ALARMS_KEY = "@alarms_data";

export const getAlarms = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch alarms", e);
    return [];
  }
};

export const saveAlarms = async (alarms: Alarm[]) => {
  try {
    const jsonValue = JSON.stringify(alarms);
    await AsyncStorage.setItem(ALARMS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save alarms", e);
  }
};

export const deleteAlarm = async (id: string): Promise<Alarm[]> => {
  const alarms = await getAlarms();
  const updatedAlarms = alarms.filter((alarm: Alarm) => alarm.id !== id);
  await saveAlarms(updatedAlarms);
  return updatedAlarms;
};

export const toggleAlarmState = async (id: string) => {
  const alarms = await getAlarms();
  const updatedAlarms = alarms.map((alarm: Alarm) =>
    alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm,
  );
  await saveAlarms(updatedAlarms);
  return updatedAlarms;
};
