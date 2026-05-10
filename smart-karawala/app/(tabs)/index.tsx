import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-3xl font-bold">
        Smart Karawala
      </Text>

      <Text className="text-green-400 text-lg mt-4">
        React Native + NativeWind Working
      </Text>
    </View>
  );
}