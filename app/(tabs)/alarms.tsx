import {
  Alarm,
  deleteAlarm,
  getAlarms,
  toggleAlarmState,
} from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export default function AlarmsScreen() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadAlarms = async () => {
        const storedAlarms = await getAlarms();
        setAlarms(storedAlarms);
      };
      loadAlarms();
    }, []),
  );

  const handleDelete = async (id: string) => {
    const updatedAlarms = await deleteAlarm(id);
    setAlarms(updatedAlarms);
  };

  const handleToggle = async (id: string) => {
    const updatedAlarms = await toggleAlarmState(id);
    setAlarms(updatedAlarms);
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItems = ({ item }: { item: Alarm }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.alarmItem}>
        <View>
          <Text
            style={[styles.timeText, !item.isActive && styles.inactiveText]}
          >
            {item.time}
          </Text>
          <Text style={styles.labelText}>{item.label}</Text>
          <Text style={styles.labelText}>
            {item.task?.type === "math" ? "Math" : "Vocab"} (
            {item.task?.count ?? 1}{" "}
            {item.task?.type === "math" ? "problems" : "words"})
          </Text>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: "#3e3e3e", true: "#81b0ff" }}
          thumbColor={item.isActive ? "#ffffff" : "#f4f3f4"}
        />
      </View>
    </Swipeable>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarms</Text>
        <TouchableOpacity onPress={() => router.push("/setAlarm")}>
          <Ionicons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={renderItems}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No alarms set. Tap + to add one.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
  },
  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  timeText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  inactiveText: {
    color: "#666666",
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 15,
    marginLeft: 10,
  },
  deleteText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666666",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
