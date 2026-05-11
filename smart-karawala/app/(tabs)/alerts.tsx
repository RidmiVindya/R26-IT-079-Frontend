import { ScrollView, Text, View } from "react-native";
import { AlertTriangle, Droplets, Thermometer, CheckCircle } from "lucide-react-native";

export default function AlertScreen() {
  return (
    <ScrollView className="flex-1 bg-sky-100 px-5 pt-12">
      <Header title="Alert Management" />

      <View className="flex-row gap-3 mt-8">
        <Summary title="High" value="2" color="text-red-500" />
        <Summary title="Medium" value="1" color="text-orange-500" />
        <Summary title="Low" value="0" color="text-blue-500" />
        <Summary title="Total" value="3" color="text-green-600" />
      </View>

      <Text className="text-slate-900 text-xl font-bold mt-7 mb-3">
        Active Alerts
      </Text>

      <AlertCard
        icon={<Thermometer color="white" />}
        bg="bg-red-500"
        title="High Temperature"
        msg="Temperature is above the safe range"
        value="Value: 55.2 °C"
        badge="High"
        badgeColor="bg-red-500"
      />

      <AlertCard
        icon={<Droplets color="white" />}
        bg="bg-red-500"
        title="High Humidity"
        msg="Humidity is above the safe range"
        value="Value: 72.5 %"
        badge="High"
        badgeColor="bg-red-500"
      />

      <AlertCard
        icon={<AlertTriangle color="white" />}
        bg="bg-orange-500"
        title="Sensor Disconnected"
        msg="Weight sensor connection lost"
        value="Check the device"
        badge="Medium"
        badgeColor="bg-orange-500"
      />

      <Text className="text-slate-900 text-xl font-bold mt-7 mb-3">
        Recent Alerts
      </Text>

      <AlertCard
        icon={<CheckCircle color="white" />}
        bg="bg-green-500"
        title="Drying Completed"
        msg="Drying process completed successfully"
        value="Batch ready"
        badge="Low"
        badgeColor="bg-blue-500"
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

function Summary({ title, value, color }: any) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 items-center">
      <Text className={`${color} font-bold`}>{title}</Text>
      <Text className="text-slate-900 text-2xl font-bold mt-2">{value}</Text>
    </View>
  );
}

function AlertCard({ icon, bg, title, msg, value, badge, badgeColor }: any) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center">
      <View className={`${bg} rounded-full p-3 mr-4`}>
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-slate-900 font-bold">{title}</Text>
        <Text className="text-slate-600 mt-1">{msg}</Text>
        <Text className="text-slate-900 font-bold mt-1">{value}</Text>
      </View>

      <View className={`${badgeColor} px-3 py-1 rounded-lg`}>
        <Text className="text-white font-bold text-xs">{badge}</Text>
      </View>
    </View>
  );
}