import { ScrollView, Text, View } from "react-native";
import { Cpu, Thermometer, Droplets, Scale, CheckCircle } from "lucide-react-native";

export default function DeviceStatusScreen() {
  return (
    <ScrollView className="flex-1 bg-sky-100 px-5 pt-12">
      <Header title="IOT Device Status" />

      <View className="flex-row gap-2 mt-8">
        <MiniCard icon={<Cpu color="#16a34a" />} title="Arduino Nano" status="Online" sub="COM6" />
        <MiniCard icon={<Thermometer color="#2563eb" />} title="Temp Sensor" status="Online" sub="DS18B20" />
        <MiniCard icon={<Droplets color="#16a34a" />} title="Humidity Sensor" status="Online" sub="SHT30" />
      </View>

      <View className="bg-white rounded-2xl p-5 mt-4">
        <MiniRow icon={<Scale color="#7c3aed" />} title="Weight Sensor" status="Online" sub="HX711 + Load Cell" />
      </View>

      <InfoCard
        title="Device Information"
        rows={[
          ["Device ID", "ARDUINO-001"],
          ["Firmware Version", "v1.0.0"],
          ["Serial Port", "COM6"],
          ["Last Updated", "Live"],
        ]}
      />

      <InfoCard
        title="Connection Status"
        rows={[
          ["FastAPI Server", "Connected"],
          ["MongoDB Atlas", "Connected"],
          ["Serial Bridge", "Connected"],
          ["React Native App", "Connected"],
        ]}
      />

      <Text className="text-center text-slate-400 my-10">
        Powered by Smart Karawala
      </Text>
    </ScrollView>
  );
}

function Header({ title }: any) {
  return (
    <View>
      <Text className="text-right text-slate-700 font-bold">Smart</Text>
      <Text className="text-right text-slate-700 font-bold">කරවල</Text>
      <Text className="text-4xl font-bold text-center text-slate-800 mt-8">{title}</Text>
    </View>
  );
}

function MiniCard({ icon, title, status, sub }: any) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4">
      {icon}
      <Text className="text-blue-700 font-bold mt-2 text-xs">{title}</Text>
      <Text className="text-green-600 font-bold mt-1">{status}</Text>
      <Text className="text-slate-500 text-xs mt-1">{sub}</Text>
    </View>
  );
}

function MiniRow({ icon, title, status, sub }: any) {
  return (
    <View className="flex-row items-center">
      {icon}
      <View className="ml-3">
        <Text className="text-blue-700 font-bold">{title}</Text>
        <Text className="text-green-600 font-bold">{status}</Text>
        <Text className="text-slate-500 text-xs">{sub}</Text>
      </View>
    </View>
  );
}

function InfoCard({ title, rows }: any) {
  return (
    <View className="bg-white rounded-2xl p-5 mt-5">
      <Text className="text-slate-900 text-xl font-bold mb-3">{title}</Text>
      {rows.map((row: any, index: number) => (
        <View key={index} className="flex-row justify-between border-b border-slate-100 py-3">
          <Text className="text-slate-600">{row[0]}</Text>
          <Text className="text-slate-900 font-bold">{row[1]}</Text>
        </View>
      ))}
    </View>
  );
}