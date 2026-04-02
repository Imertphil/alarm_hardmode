import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskType = "math" | "vocab";

export interface Word {
  id: string;
  word: string;
  meaning: string;
}

export interface UserSettings {
  defaultMathCount: number;
  defaultVocabCount: number;
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  task: {
    type: TaskType;
    count: number;
  };
}

const ALARMS_KEY = "@alarms_data";
const WORDS_KEY = "@vocab_words";
const SETTINGS_KEY = "@user_settings";

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

export const getWords = async (): Promise<Word[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WORDS_KEY);
    return jsonValue != null
      ? JSON.parse(jsonValue)
      : [{ id: "1", word: "focus", meaning: "Pay close attention to" }];
  } catch (e) {
    console.error("Failed to fetch words", e);
    return [];
  }
};

export const saveWords = async (words: Word[]) => {
  try {
    const jsonValue = JSON.stringify(words);
    await AsyncStorage.setItem(WORDS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save words", e);
  }
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null
      ? JSON.parse(jsonValue)
      : { defaultMathCount: 3, defaultVocabCount: 3 };
  } catch (e) {
    console.error("Failed to fetch settings", e);
    return { defaultMathCount: 3, defaultVocabCount: 3 };
  }
};

export const saveSettings = async (settings: UserSettings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};
