import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="setAlarm"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
