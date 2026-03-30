import MathTask from "@/components/MathTask";
import { Alarm, getAlarms } from "@/utils/storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function RingingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [isRinging, setIsRinging] = useState(true);
  const [currentAlarm, setCurrentAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    const fetchAlarmData = async () => {
      if (id) {
        const alarms = await getAlarms();
        const activeAlarm = alarms.find((a: Alarm) => a.id === id);
        if (activeAlarm) {
          setCurrentAlarm(activeAlarm);
        }
      }
    };
    fetchAlarmData();
  }, [id]);

  useEffect(() => {
    if (isRinging) {
      const ONE_SECOND_IN_MS = 1000;
      const PATTERN = [0, ONE_SECOND_IN_MS, ONE_SECOND_IN_MS];
      Vibration.vibrate(PATTERN, true);
    } else {
      Vibration.cancel();
    }
    return () => Vibration.cancel();
  }, [isRinging]);

  const handleFullyAwake = () => {
    router.replace("/");
  };

  if (!id || !currentAlarm) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading alarm data...</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!isRinging) {
    return (
      <View style={styles.solvingContainer}>
        {currentAlarm.task.type === "math" ? (
          <MathTask
            requiredCount={currentAlarm.task.count}
            onComplete={handleFullyAwake}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.errorText}>Vocab task coming soon...</Text>
            <TouchableOpacity style={styles.button} onPress={handleFullyAwake}>
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.alarmText}>Alarm hard mode</Text>
      <Text style={styles.subtitle}>{currentAlarm.label}</Text>
      <TouchableOpacity
        style={styles.stopButton}
        onPress={() => setIsRinging(false)}
      >
        <Text style={styles.buttonText}>Stop & Solve</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  solvingContainer: { flex: 1, backgroundColor: "#1a1a1a", width: "100%" },
  alarmText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ff9500",
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: { fontSize: 20, color: "#a0a0a0", marginBottom: 60 },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#ff9500",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#1a1a1a", fontSize: 20, fontWeight: "bold" },
  errorText: { color: "#ff9500", fontSize: 18, marginBottom: 20 },
});
