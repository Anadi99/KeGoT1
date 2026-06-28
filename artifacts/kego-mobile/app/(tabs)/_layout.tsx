import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const liquidGlass = isLiquidGlassAvailable();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#5a5d63",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: liquidGlass || isIOS ? "transparent" : colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          elevation: 0,
          height: isWeb ? 60 : 82,
          paddingBottom: isWeb ? 8 : 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
        },
        tabBarBackground: () =>
          isIOS || liquidGlass ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="square.grid.2x2.fill" tintColor={color} size={22} />
            ) : (
              <Ionicons name="grid" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="memory"
        options={{
          title: "Memory",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="externaldrive.fill" tintColor={color} size={22} />
            ) : (
              <Ionicons name="server" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="recover"
        options={{
          title: "Recovery",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="arrow.clockwise.circle.fill" tintColor={color} size={22} />
            ) : (
              <Ionicons name="refresh-circle" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gearshape.fill" tintColor={color} size={22} />
            ) : (
              <Ionicons name="settings" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="projects" options={{ href: null }} />
      <Tabs.Screen name="capture" options={{ href: null }} />
    </Tabs>
  );
}
