import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function ClockScreen() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <View style={[styles.clockBox, { width: width * 0.7 }]}>
        <Text style={[styles.timeText, { fontSize: width * 0.1 }]}>
          {hours}:{minutes}:{seconds}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  clockBox: {
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: width * 0.06,
    paddingVertical: 20,
    alignItems: "center",
  },
  timeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    letterSpacing: 4,
  },
});
