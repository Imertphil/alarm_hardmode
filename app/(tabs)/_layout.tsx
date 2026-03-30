import { Tabs } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const TabButton = (label: string) => (props: any) => {
  const selected = props["aria-selected"];
  return (
    <Pressable
      {...props}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: selected ? "#fc7938" : "#03f4fc",
        }}
      >
        <Text
          style={{
            color: selected ? "#ffffff" : "#666666",
            fontSize: 12,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopWidth: 0,
          height: 60,
        },
        tabBarActiveTintColor: "#1fffff",
        tabBarInactiveTintColor: "#00ff00",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Clock",
          headerShown: false,
          tabBarButton: TabButton("Clock"),
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          title: "Alarms",
          headerShown: false,
          tabBarButton: TabButton("Alarms"),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          headerShown: false,
          tabBarButton: TabButton("Tasks"),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
