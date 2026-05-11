import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Thermometer, Droplets, Scale, Wind, Wifi } from "lucide-react-native";
import { getLiveSensorData } from "@/services/iotApi";

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    try {
      const res = await getLiveSensorData();
      setData(res);
    } catch (e) {
      console.log("Live data error", e);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView className="flex-1 bg-sky-100 px-5 pt-12">
      <Header title="Drying Dashboard" />

      <View className="bg-white rounded-xl px-4 py-3 mt-5 flex-row justify-between">
        <Text className="text-slate-700 font-semibold">
          <Wifi size={14} color="#22c55e" /> Device Online
        </Text>
        <Text className="text-slate-600 font-semibold">ARDUINO-001</Text>
      </View>

      <View className="flex-row flex-wrap justify-between mt-4">
        <Card icon={<Thermometer color="#2563eb" />} title="Temperature" value={`${data?.temperature ?? "--"} °C`} />
        <Card icon={<Droplets color="#16a34a" />} title="Humidity" value={`${data?.humidity ?? "--"} %`} />
        <Card icon={<Scale color="#7c3aed" />} title="Fish Weight" value={`${data?.weight ?? "--"}`} />
        <Card icon={<Wind color="#f97316" />} title="Gas Level" value={`${data?.gas ?? "--"}`} />
      </View>

      <View className="bg-white rounded-2xl p-5 mt-5">
        <Text className="text-slate-900 text-xl font-bold">Device Status</Text>
        <Status label="Heater + Dry Air" active={data?.heater} />
        <Status label="Exhaust Fan" active={data?.fan} />
        <Status label="Light" active={data?.light} />
      </View>

      <Text className="text-center text-slate-400 my-8">
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
      <Text className="text-4xl font-bold text-center text-slate-800 mt-8">
        {title}
      </Text>
    </View>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 w-[48%]">
      {icon}
      <Text className="text-blue-600 font-bold mt-3">{title}</Text>
      <Text className="text-slate-900 text-2xl font-bold mt-2">{value}</Text>
    </View>
  );
}

function Status({ label, active }: any) {
  return (
    <View className="flex-row justify-between border-b border-slate-100 py-4">
      <Text className="text-slate-700 font-semibold">{label}</Text>
      <Text className={active ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
        {active ? "ON" : "OFF"}
      </Text>
    </View>
  );
}