import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Menu,
  ClipboardList,
  Fish,
  Weight,
  Calendar,
  Clock,
  MapPin,
  FileText,
  PlusCircle,
  Lightbulb,
  ChevronDown,
  Check,
  Home,
} from "lucide-react-native";
import { API_BASE_URL } from "../services/api";

const fishTypes = [
  "Sprats",
  "Salaya",
  "Hurulla",
  "Kumbalawa",
  "Kelawalla",
  "Balaya",
  "Mora",
  "Linna",
  "Paraw",
  "Thalapath",
  "Tuna",
  "Mackerel",
];

type CreatedBatch = {
  batchId: string;
  fishType: string;
  rawWeight: number;
  date: string;
  location: string;
  notes?: string;
};

export default function AddBatchScreen() {
  const now = new Date();

  const currentDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

 
  const [fishType, setFishType] = useState("");
  const [rawWeight, setRawWeight] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [showFishDropdown, setShowFishDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdBatch, setCreatedBatch] = useState<CreatedBatch | null>(null);

  const validateForm = () => {
    if (!fishType) {
      Alert.alert("Validation Error", "Please select a fish type.");
      return false;
    }

    if (!rawWeight.trim()) {
      Alert.alert("Validation Error", "Please enter raw fish weight.");
      return false;
    }

    const weightValue = Number(rawWeight);

    if (isNaN(weightValue)) {
      Alert.alert("Validation Error", "Weight must be a valid number.");
      return false;
    }

    if (weightValue <= 0) {
      Alert.alert("Validation Error", "Weight must be greater than 0.");
      return false;
    }

    if (weightValue > 10000) {
      Alert.alert("Validation Error", "Please enter a realistic fish weight.");
      return false;
    }

    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter location.");
      return false;
    }

    if (location.trim().length < 3) {
      Alert.alert(
        "Validation Error",
        "Location must contain at least 3 characters."
      );
      return false;
    }

    if (notes.length > 200) {
      Alert.alert("Validation Error", "Notes cannot exceed 200 characters.");
      return false;
    }

    return true;
  };

  const handleCreateBatch = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        fishType,
        rawWeight: Number(rawWeight),
        date: currentDate,
        location: location.trim(),
        notes: notes.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.message || "Failed to create batch. Please try again."
        );
        return;
      }

      const batch = data.batch || data;

      setCreatedBatch({
        batchId: batch.batchId,
        fishType: batch.fishType,
        rawWeight: batch.rawWeight,
        date: batch.date,
        location: batch.location,
        notes: batch.notes,
      });
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Cannot connect to backend. Check your server and API URL."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFishType("");
    setRawWeight("");
    setLocation("");
    setNotes("");
    setCreatedBatch(null);
  };

  if (createdBatch) {
    return (
      <ScrollView className="flex-1 bg-[#DCEFF7] px-6 pt-10">
        <View className="flex-row justify-between items-start">
          <TouchableOpacity className="bg-white w-10 h-10 rounded-md items-center justify-center">
            <Menu size={22} color="#003B5C" />
          </TouchableOpacity>

          <View className="items-center">
            <Fish size={46} color="#004B73" />
            <Text className="text-[#004B73] font-bold text-center leading-4">
              Smart{"\n"}කරවල
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-5 mt-10 items-center">
          <View className="w-14 h-14 rounded-full bg-green-600 items-center justify-center">
            <Check size={32} color="white" />
          </View>

          <Text className="text-green-700 text-xl font-bold mt-4">
            Batch Created Successfully!
          </Text>

          <Text className="text-[#002B66] text-xs mt-1">
            Your new batch has been created and saved.
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 mt-4">
          <View className="border-l-4 border-[#0052CC] pl-2 mb-4">
            <Text className="text-[#002B66] font-bold text-lg">
              Batch Summary
            </Text>
          </View>

          <SummaryRow
            icon={<ClipboardList size={18} color="#0052CC" />}
            label="Batch ID"
            value={createdBatch.batchId}
          />

          <SummaryRow
            icon={<Fish size={18} color="#0052CC" />}
            label="Fish Type"
            value={createdBatch.fishType}
          />

          <SummaryRow
            icon={<Weight size={18} color="#00A86B" />}
            label="Raw Fish Weight"
            value={`${createdBatch.rawWeight} kg`}
          />

          <SummaryRow
            icon={<Calendar size={18} color="#7B2FFF" />}
            label="Date"
            value={createdBatch.date}
          />

          

          <SummaryRow
            icon={<MapPin size={18} color="#0052CC" />}
            label="Location"
            value={createdBatch.location}
          />

          <SummaryRow
            icon={<FileText size={18} color="#0047B3" />}
            label="Notes"
            value={createdBatch.notes || "No notes"}
          />
        </View>

        <View className="bg-[#F0FFF4] rounded-xl p-4 flex-row mt-4 border border-[#D5F5DF]">
          <View className="w-12 h-12 rounded-full bg-[#DFF7E8] items-center justify-center mr-3">
            <Lightbulb size={24} color="#008F4C" />
          </View>

          <View className="flex-1">
            <Text className="text-[#003B2F] font-bold text-sm">
              What’s Next?
            </Text>
            <Text className="text-[#003B2F] text-xs mt-1">
              You can now monitor this batch, track progress, and get
              predictions.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={resetForm}
          className="h-12 rounded-lg border border-[#003D99] items-center justify-center flex-row mt-4 bg-white"
        >
          <PlusCircle size={20} color="#003D99" />
          <Text className="text-[#003D99] font-bold ml-2">
            Create Another Batch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="h-12 rounded-lg bg-[#003D99] items-center justify-center flex-row mt-3">
          <Home size={20} color="white" />
          <Text className="text-white font-bold ml-2">Go to Dashboard</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 mt-8 mb-6">
          Powered by Smart Karawala
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#DCEFF7] px-6 pt-10">
      <View className="flex-row justify-between items-start">
        <TouchableOpacity className="bg-white w-10 h-10 rounded-md items-center justify-center">
          <Menu size={22} color="#003B5C" />
        </TouchableOpacity>

        <View className="items-center">
          <Fish size={46} color="#004B73" />
          <Text className="text-[#004B73] font-bold text-center leading-4">
            Smart{"\n"}කරවල
          </Text>
        </View>
      </View>

      <Text className="text-[#004B73] text-4xl font-bold text-center mt-6 mb-6">
        Add New Batch
      </Text>

      <View className="bg-white/80 rounded-md p-3 mb-10">
        <View className="bg-[#F4FAFF] rounded-xl p-4 flex-row items-center shadow-sm mb-4">
          <View className="w-14 h-14 rounded-full bg-[#EAF4FF] items-center justify-center mr-4">
            <ClipboardList size={30} color="#0047B3" />
          </View>

          <View className="flex-1">
            <Text className="text-[#002B66] font-bold text-base">
              Start a new batch
            </Text>
            <Text className="text-[#002B66] text-xs mt-1">
              Provide accurate details for better prediction and tracking.
            </Text>
          </View>
        </View>

        <View className="border-l-4 border-[#0052CC] pl-2 mb-3">
          <Text className="text-[#002B66] font-bold">Batch Information</Text>
        </View>

        <View className="bg-white rounded-xl overflow-hidden">
          <View className="flex-row items-center border-b border-gray-100 p-3">
            <IconBox icon={<Fish size={20} color="#0052CC" />} />

            <View className="w-24">
              <Text className="text-[#002B66] font-bold text-xs">
                Fish Type <Text className="text-red-500">*</Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowFishDropdown(true)}
              className="flex-1 h-11 border border-gray-200 rounded-lg flex-row items-center px-3 bg-white"
            >
              <Text className="flex-1 text-xs text-[#002B66]">
                {fishType || "Select fish type"}
              </Text>
              <ChevronDown size={16} color="#002B66" />
            </TouchableOpacity>
          </View>

          <InputRow
            icon={<Weight size={20} color="#00A86B" />}
            label="Raw Fish Weight"
            required
            placeholder="Enter weight"
            value={rawWeight}
            onChangeText={setRawWeight}
            keyboardType="decimal-pad"
            unit="kg"
          />

          <ReadOnlyRow
            icon={<Calendar size={20} color="#7B2FFF" />}
            label="Date"
            value={currentDate}
            rightIcon={<Calendar size={18} color="#002B66" />}
          />

          

          <InputRow
            icon={<MapPin size={20} color="#0052CC" />}
            label="Location"
            required
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          <View className="flex-row border-b border-gray-100 p-3">
            <IconBox icon={<FileText size={20} color="#0047B3" />} />

            <View className="w-24 justify-center">
              <Text className="text-[#002B66] font-bold text-xs">
                Notes{" "}
                <Text className="font-normal text-[#002B66]">(Optional)</Text>
              </Text>
            </View>

            <View className="flex-1 bg-white border border-gray-200 rounded-lg p-2 min-h-[80px]">
              <TextInput
                placeholder="Add any notes..."
                placeholderTextColor="#666"
                multiline
                maxLength={200}
                value={notes}
                onChangeText={setNotes}
                className="text-xs text-[#002B66]"
              />
              <Text className="text-[10px] text-gray-500 text-right mt-4">
                {notes.length}/200
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mt-5">
          <TouchableOpacity
            onPress={resetForm}
            className="flex-1 h-12 rounded-lg border border-red-500 items-center justify-center bg-white"
          >
            <Text className="text-red-600 font-bold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreateBatch}
            disabled={loading}
            className="flex-1 h-12 rounded-lg bg-[#003D99] items-center justify-center flex-row"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <PlusCircle size={20} color="white" />
                <Text className="text-white font-bold ml-2">
                  Create Batch
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-[#F0FFF4] rounded-xl p-4 flex-row mt-4 border border-[#D5F5DF]">
          <View className="w-12 h-12 rounded-full bg-[#DFF7E8] items-center justify-center mr-3">
            <Lightbulb size={24} color="#008F4C" />
          </View>

          <View className="flex-1">
            <Text className="text-[#003B2F] font-bold text-sm">
              Why accurate details matter?
            </Text>
            <Text className="text-[#003B2F] text-xs mt-1">
              Accurate batch information helps us provide better predictions,
              reduce waste and ensure quality.
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-center text-gray-600 mb-6">
        Powered by Smart Karawala
      </Text>

      <Modal visible={showFishDropdown} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center px-8"
          onPress={() => setShowFishDropdown(false)}
        >
          <View className="bg-white rounded-xl p-4">
            <Text className="text-[#002B66] font-bold text-lg mb-3">
              Select Fish Type
            </Text>

            {fishTypes.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setFishType(item);
                  setShowFishDropdown(false);
                }}
                className="py-3 border-b border-gray-100"
              >
                <Text className="text-[#002B66] font-semibold">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

function IconBox({ icon }: any) {
  return (
    <View className="w-10 h-10 bg-[#EAF4FF] rounded-md items-center justify-center mr-3">
      {icon}
    </View>
  );
}

function InputRow({
  icon,
  label,
  placeholder,
  required,
  unit,
  value,
  onChangeText,
  keyboardType = "default",
}: any) {
  return (
    <View className="flex-row items-center border-b border-gray-100 p-3">
      <IconBox icon={icon} />

      <View className="w-24">
        <Text className="text-[#002B66] font-bold text-xs">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      </View>

      <View className="flex-1 h-11 border border-gray-200 rounded-lg flex-row items-center px-3 bg-white">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 text-xs text-[#002B66]"
        />

        {unit && <Text className="text-xs text-[#002B66]">{unit}</Text>}
      </View>
    </View>
  );
}

function ReadOnlyRow({ icon, label, value, rightIcon }: any) {
  return (
    <View className="flex-row items-center border-b border-gray-100 p-3">
      <IconBox icon={icon} />

      <View className="w-24">
        <Text className="text-[#002B66] font-bold text-xs">
          {label} <Text className="text-red-500">*</Text>
        </Text>
      </View>

      <View className="flex-1 h-11 border border-gray-200 rounded-lg flex-row items-center px-3 bg-white">
        <Text className="flex-1 text-xs text-[#002B66]">{value}</Text>
        {rightIcon}
      </View>
    </View>
  );
}

function SummaryRow({ icon, label, value }: any) {
  return (
    <View className="flex-row items-center border-b border-gray-100 py-3">
      <View className="w-9 h-9 bg-[#EAF4FF] rounded-md items-center justify-center mr-3">
        {icon}
      </View>

      <Text className="w-28 text-[#002B66] font-bold text-xs">{label}</Text>

      <Text className="flex-1 text-[#001B44] text-xs">{value}</Text>
    </View>
  );
}