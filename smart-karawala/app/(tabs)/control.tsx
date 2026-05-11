import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Droplets, Fan, Flame, Play, RotateCcw, Square, Thermometer } from "lucide-react-native";
import { heaterOn, heaterOff, exhaustOn, exhaustOff, lightOn, lightOff } from "@/services/iotApi";

export default function ControlScreen() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [heater, setHeater] = useState(false);
  const [fan, setFan] = useState(false);
  const [light, setLight] = useState(false);
  const [temp, setTemp] = useState(50);
  const [humidity, setHumidity] = useState(40);

  const toggleHeater = async () => {
    heater ? await heaterOff() : await heaterOn();
    setHeater(!heater);
  };

  const toggleFan = async () => {
    fan ? await exhaustOff() : await exhaustOn();
    setFan(!fan);
  };

  const toggleLight = async () => {
    light ? await lightOff() : await lightOn();
    setLight(!light);
  };

  return (
    <ScrollView className="flex-1 bg-sky-100 px-5 pt-10">
      <Text className="text-right text-slate-700 font-bold">Smart</Text>
      <Text className="text-right text-slate-700 font-bold">කරවල</Text>

      <Text className="text-4xl font-bold text-center text-slate-800 mt-4">
        Drying Control{"\n"}Panel
      </Text>

      <View className="bg-white rounded-2xl p-5 mt-6 mb-10">
        <Text className="text-slate-900 font-bold mb-3">Operation Mode</Text>

        <View className="flex-row gap-3">
          <ModeCard
            active={mode === "auto"}
            title="AUTO MODE"
            subtitle="System controls automatically"
            onPress={() => setMode("auto")}
          />
          <ModeCard
            active={mode === "manual"}
            title="MANUAL MODE"
            subtitle="Manual control of devices"
            onPress={() => setMode("manual")}
          />
        </View>

        <Text className="text-slate-900 font-bold mt-6 mb-3">
          Set Target Conditions
        </Text>

        <View className="flex-row gap-3">
          <TargetBox
            icon={<Thermometer color="#ef4444" size={30} />}
            title="Temperature"
            value={temp}
            unit="°C"
            onUp={() => setTemp(temp + 1)}
            onDown={() => setTemp(temp - 1)}
          />
          <TargetBox
            icon={<Droplets color="#2563eb" size={30} />}
            title="Humidity"
            value={humidity}
            unit="%"
            onUp={() => setHumidity(humidity + 1)}
            onDown={() => setHumidity(humidity - 1)}
          />
        </View>

        <TouchableOpacity className="bg-blue-600 rounded-xl py-4 mt-4">
          <Text className="text-white text-center font-bold">Save Settings</Text>
        </TouchableOpacity>

        <Text className="text-slate-900 font-bold mt-6 mb-3">
          Manual Controls
        </Text>

        <ControlRow
          icon={<Flame color="#ef4444" size={24} />}
          label="Heater + Dry Air"
          active={heater}
          onPress={toggleHeater}
        />

        <ControlRow
          icon={<Fan color="#1d4ed8" size={24} />}
          label="Exhaust Fan"
          active={fan}
          onPress={toggleFan}
        />

        <ControlRow
          icon={<Droplets color="#f59e0b" size={24} />}
          label="Light"
          active={light}
          onPress={toggleLight}
        />

        <Text className="text-slate-900 font-bold mt-6 mb-3">
          Drying Controls
        </Text>

        <View className="flex-row gap-3">
          <ActionButton title="Start Drying" color="bg-green-500" icon={<Play color="white" size={16} />} />
          <ActionButton title="Stop Drying" color="bg-red-500" icon={<Square color="white" size={16} />} />
          <ActionButton title="Reset" color="bg-white border border-slate-200" textColor="text-slate-700" icon={<RotateCcw color="#334155" size={16} />} />
        </View>
      </View>

      <Text className="text-center text-slate-400 mb-8">
        Powered by Smart Karawala
      </Text>
    </ScrollView>
  );
}

function ModeCard({ active, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={
        active
          ? "flex-1 bg-blue-600 rounded-xl p-4"
          : "flex-1 bg-white border border-slate-200 rounded-xl p-4"
      }
    >
      <Text className={active ? "text-white font-bold" : "text-slate-800 font-bold"}>
        {title}
      </Text>
      <Text className={active ? "text-white text-xs mt-2" : "text-slate-500 text-xs mt-2"}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

function TargetBox({ icon, title, value, unit, onUp, onDown }: any) {
  return (
    <View className="flex-1 bg-white border border-slate-100 rounded-xl p-4 flex-row items-center">
      {icon}
      <View className="ml-3 flex-1">
        <Text className="text-slate-600 font-bold text-xs">{title}</Text>
        <Text className="text-slate-900 text-xl font-bold mt-2">
          {value} {unit}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={onUp}>
          <Text className="text-xl">⌃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDown}>
          <Text className="text-xl">⌄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ControlRow({ icon, label, active, onPress }: any) {
  return (
    <View className="bg-white border border-slate-100 rounded-xl px-4 py-4 mb-3 flex-row justify-between items-center">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-slate-800 font-semibold ml-3">{label}</Text>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className={active ? "bg-green-500 px-3 py-1 rounded-full" : "bg-slate-300 px-3 py-1 rounded-full"}
      >
        <Text className="text-white font-bold text-xs">
          {active ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ActionButton({ title, color, icon, textColor = "text-white" }: any) {
  return (
    <TouchableOpacity className={`flex-1 rounded-xl py-3 ${color}`}>
      <View className="flex-row items-center justify-center">
        {icon}
        <Text className={`${textColor} font-bold ml-1 text-xs`}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}