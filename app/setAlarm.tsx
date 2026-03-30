import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAlarms, saveAlarms } from "../utils/storage";

export default function SetAlarmScreen() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [label, setLabel] = useState("Alarm");

  const [taskType, setTaskType] = useState("math");
  const [taskCount, setTaskCount] = useState("3");

  const handleSave = async () => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    const parsedCount = parseInt(taskCount, 10);
    const finalCount = isNaN(parsedCount) || parsedCount < 1 ? 1 : parsedCount;

    const alarmId = Date.now().toString();

    let triggerDate = new Date();
    triggerDate.setHours(hours, minutes, 0, 0);

    if (triggerDate <= new Date()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: alarmId,
      content: {
        title: `${label} from Alarm hard mode`,
        body: `Time for your ${taskType} mission!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        interruptionLevel: "timeSensitive",
        data: { alarmId: alarmId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });

    const newAlarm = {
      id: alarmId,
      time: timeString,
      label: label,
      isActive: true,
      task: {
        type: taskType,
        count: finalCount,
      },
    };

    const existingAlarms = await getAlarms();
    const updatedAlarms = [...existingAlarms, newAlarm];
    await saveAlarms(updatedAlarms);

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Alarm</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <DateTimePicker
          value={date}
          mode="time"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
          textColor="#ffffff"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="Alarm name"
            placeholderTextColor="#666666"
            returnKeyType="done"
          />
        </View>

        <View style={styles.taskSelectorContainer}>
          <Text style={styles.sectionTitle}>Wake Up Mission</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                taskType === "math" && styles.toggleBtnActive,
              ]}
              onPress={() => setTaskType("math")}
            >
              <Text
                style={[
                  styles.toggleText,
                  taskType === "math" && styles.toggleTextActive,
                ]}
              >
                Math
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                taskType === "vocab" && styles.toggleBtnActive,
              ]}
              onPress={() => setTaskType("vocab")}
            >
              <Text
                style={[
                  styles.toggleText,
                  taskType === "vocab" && styles.toggleTextActive,
                ]}
              >
                Vocab
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {taskType === "math" ? "Number of Problems" : "Words to Memorize"}
          </Text>
          <TextInput
            style={styles.input}
            value={taskCount}
            onChangeText={setTaskCount}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#2a2a2a",
  },
  cancelText: { color: "#ff9500", fontSize: 18 },
  saveText: { color: "#ff9500", fontSize: 18, fontWeight: "bold" },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "600" },
  formContainer: { padding: 20 },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  label: { color: "#ffffff", fontSize: 16 },
  input: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  sectionTitle: {
    color: "#666666",
    fontSize: 14,
    marginTop: 30,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  taskSelectorContainer: { marginTop: 10 },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    overflow: "hidden",
  },
  toggleBtn: { flex: 1, paddingVertical: 15, alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#ff9500" },
  toggleText: { color: "#a0a0a0", fontSize: 16, fontWeight: "600" },
  toggleTextActive: { color: "#ffffff" },
});
