import { Tabs } from "expo-router";
import { House, Settings, Cpu, Bell } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="control"
        options={{
          title: "Control",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="device"
        options={{
          title: "Device",
          tabBarIcon: ({ color, size }) => <Cpu color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />

      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}