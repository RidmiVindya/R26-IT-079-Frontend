import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Menu,
  ClipboardList,
  Fish,
  Weight,
  Calendar,
  MapPin,
  FileText,
  PlusCircle,
  Lightbulb,
  ChevronDown,
  Check,
  X,
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
  "Tuna",
  "Mackerel",
];

const locations = ["Negombo", "Chilaw", "Jaffna", "Mannar", "Trincomalee"];

type Errors = {
  fishType?: string;
  rawWeight?: string;
  location?: string;
  notes?: string;
};

export default function AddBatchScreen() {
  const now = new Date();

  const currentDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [fishType, setFishType] = useState("");
  const [rawWeight, setRawWeight] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const [showFishDropdown, setShowFishDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // SUCCESS ALERT STATE
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Errors = {};
    const weight = Number(rawWeight);

    if (!fishType) {
      newErrors.fishType = "Please select fish type";
    }

    if (!rawWeight.trim()) {
      newErrors.rawWeight = "Please enter raw fish weight";
    } else if (isNaN(weight)) {
      newErrors.rawWeight = "Weight must be a valid number";
    } else if (weight <= 0) {
      newErrors.rawWeight = "Weight must be greater than 0";
    } else if (weight > 10000) {
      newErrors.rawWeight = "Please enter realistic weight";
    }

    if (!location) {
      newErrors.location = "Please select location";
    }

    if (notes.length > 200) {
      newErrors.notes = "Notes cannot exceed 200 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBatch = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        fishType,
        rawWeight: Number(rawWeight),
        date: currentDate,
        time: currentTime,
        location,
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
        Alert.alert("Error", data.message || "Failed to create batch");
        return;
      }

      // SUCCESS ALERT
      setSuccessMessage("Batch created successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // RESET FORM
      setFishType("");
      setRawWeight("");
      setLocation("");
      setNotes("");
      setErrors({});
    } catch (error) {
      Alert.alert("Connection Error", "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#DCEFF7] px-5 pt-10">
      {/* HEADER */}
      <View className="flex-row justify-between items-start">
        <TouchableOpacity className="bg-white w-10 h-10 rounded-md items-center justify-center">
          <Menu size={22} color="#003B5C" />
        </TouchableOpacity>

        <View className="items-center">
          <Fish size={48} color="#004B73" />
          <Text className="text-[#004B73] font-bold text-center">
            Smart{"\n"}කරවල
          </Text>
        </View>
      </View>

      {/* SUCCESS ALERT */}
      {successMessage ? (
        <View className="bg-green-100 border border-green-400 rounded-xl p-4 mt-5 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-green-200 items-center justify-center">
              <Check size={22} color="#008F4C" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-green-800 font-bold text-sm">
                Success
              </Text>

              <Text className="text-green-700 text-xs mt-1">
                {successMessage}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setSuccessMessage("")}>
            <X size={18} color="#008F4C" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* TITLE */}
      <Text className="text-[#004B73] text-4xl font-bold text-center mt-6 mb-6">
        Add New Batch
      </Text>

      {/* MAIN CARD */}
      <View className="bg-white/80 rounded-md p-3">
        {/* TOP INFO CARD */}
        <View className="bg-[#F4FAFF] rounded-xl p-4 flex-row items-center mb-4">
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

        {/* SECTION TITLE */}
        <View className="border-l-4 border-[#0052CC] pl-2 mb-3">
          <Text className="text-[#002B66] font-bold">
            Batch Information
          </Text>
        </View>

        {/* FORM */}
        <View className="bg-white rounded-xl overflow-hidden">
          {/* FISH TYPE */}
          <SelectRow
            icon={<Fish size={20} color="#0052CC" />}
            label="Fish Type"
            value={fishType}
            placeholder="Select fish type"
            error={errors.fishType}
            onPress={() => setShowFishDropdown(true)}
          />

          {/* WEIGHT */}
          <InputRow
            icon={<Weight size={20} color="#00A86B" />}
            label="Raw Fish Weight"
            value={rawWeight}
            placeholder="Enter weight"
            unit="Kg"
            error={errors.rawWeight}
            keyboardType="decimal-pad"
            onChangeText={(text: string) => {
              setRawWeight(text);
              setErrors({ ...errors, rawWeight: "" });
            }}
          />

          {/* DATE */}
          <ReadOnlyRow
            icon={<Calendar size={20} color="#7B2FFF" />}
            label="Date"
            value={currentDate}
            rightIcon={<Calendar size={18} color="#002B66" />}
          />

          {/* LOCATION */}
          <SelectRow
            icon={<MapPin size={20} color="#0052CC" />}
            label="Location"
            value={location}
            placeholder="Select location"
            error={errors.location}
            onPress={() => setShowLocationDropdown(true)}
          />

          {/* NOTES */}
          <View className="flex-row border-b border-gray-100 p-3">
            <IconBox
              icon={<FileText size={20} color="#0047B3" />}
            />

            <View className="w-28 justify-center">
              <Text className="text-[#002B66] font-bold text-xs">
                Notes{" "}
                <Text className="font-normal text-[#002B66]">
                  (Optional)
                </Text>
              </Text>
            </View>

            <View className="flex-1">
              <View className="border border-gray-200 rounded-lg p-2 min-h-[80px]">
                <TextInput
                  placeholder="Add any notes..."
                  placeholderTextColor="#777"
                  multiline
                  maxLength={200}
                  value={notes}
                  onChangeText={(text) => {
                    setNotes(text);
                    setErrors({ ...errors, notes: "" });
                  }}
                  className="text-xs text-[#002B66]"
                />

                <Text className="text-[10px] text-gray-500 text-right mt-4">
                  {notes.length}/200
                </Text>
              </View>

              {errors.notes && (
                <Text className="text-red-500 text-[10px] mt-1">
                  {errors.notes}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* BUTTONS */}
        <View className="flex-row gap-3 mt-5">
          {/* CANCEL */}
          <TouchableOpacity
            onPress={() => {
              setFishType("");
              setRawWeight("");
              setLocation("");
              setNotes("");
              setErrors({});
            }}
            className="flex-1 h-12 rounded-lg border border-red-500 items-center justify-center bg-white"
          >
            <Text className="text-red-600 font-bold">Cancel</Text>
          </TouchableOpacity>

          {/* CREATE */}
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

        {/* INFO BOX */}
        <View className="bg-[#F0FFF4] rounded-xl p-4 flex-row mt-4 border border-[#D5F5DF]">
          <View className="w-12 h-12 rounded-full bg-[#DFF7E8] items-center justify-center mr-3">
            <Lightbulb size={24} color="#008F4C" />
          </View>

          <View className="flex-1">
            <Text className="text-[#003B2F] font-bold text-sm">
              Why accurate details matter?
            </Text>

            <Text className="text-[#003B2F] text-xs mt-1">
              Accurate batch information helps provide better predictions,
              reduce waste and ensure quality.
            </Text>
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <Text className="text-center text-gray-600 mt-6 mb-6">
        Powered by Smart Karawala
      </Text>

      {/* FISH DROPDOWN */}
      <DropdownModal
        visible={showFishDropdown}
        title="Select Fish Type"
        data={fishTypes}
        onClose={() => setShowFishDropdown(false)}
        onSelect={(item: string) => {
          setFishType(item);
          setErrors({ ...errors, fishType: "" });
          setShowFishDropdown(false);
        }}
      />

      {/* LOCATION DROPDOWN */}
      <DropdownModal
        visible={showLocationDropdown}
        title="Select Location"
        data={locations}
        onClose={() => setShowLocationDropdown(false)}
        onSelect={(item: string) => {
          setLocation(item);
          setErrors({ ...errors, location: "" });
          setShowLocationDropdown(false);
        }}
      />
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

function SelectRow({
  icon,
  label,
  value,
  placeholder,
  error,
  onPress,
}: any) {
  return (
    <View className="border-b border-gray-100 p-3">
      <View className="flex-row items-center">
        <IconBox icon={icon} />

        <View className="w-28">
          <Text className="text-[#002B66] font-bold text-xs">
            {label} <Text className="text-red-500">*</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPress}
          className={`flex-1 h-11 border rounded-lg flex-row items-center px-3 bg-white ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <Text className="flex-1 text-xs text-[#002B66]">
            {value || placeholder}
          </Text>

          <ChevronDown size={16} color="#002B66" />
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="text-red-500 text-[10px] ml-[155px] mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

function InputRow({
  icon,
  label,
  value,
  placeholder,
  unit,
  error,
  keyboardType,
  onChangeText,
}: any) {
  return (
    <View className="border-b border-gray-100 p-3">
      <View className="flex-row items-center">
        <IconBox icon={icon} />

        <View className="w-28">
          <Text className="text-[#002B66] font-bold text-xs">
            {label} <Text className="text-red-500">*</Text>
          </Text>
        </View>

        <View
          className={`flex-1 h-11 border rounded-lg flex-row items-center px-3 bg-white ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#777"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            className="flex-1 text-xs text-[#002B66]"
          />

          {unit && (
            <Text className="text-xs text-[#002B66]">
              {unit}
            </Text>
          )}
        </View>
      </View>

      {error && (
        <Text className="text-red-500 text-[10px] ml-[155px] mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

function ReadOnlyRow({
  icon,
  label,
  value,
  rightIcon,
}: any) {
  return (
    <View className="flex-row items-center border-b border-gray-100 p-3">
      <IconBox icon={icon} />

      <View className="w-28">
        <Text className="text-[#002B66] font-bold text-xs">
          {label} <Text className="text-red-500">*</Text>
        </Text>
      </View>

      <View className="flex-1 h-11 border border-gray-200 rounded-lg flex-row items-center px-3 bg-white">
        <Text className="flex-1 text-xs text-[#002B66]">
          {value}
        </Text>

        {rightIcon}
      </View>
    </View>
  );
}

function DropdownModal({
  visible,
  title,
  data,
  onClose,
  onSelect,
}: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 justify-center px-8"
      >
        <View className="bg-white rounded-xl p-4">
          <Text className="text-[#002B66] font-bold text-lg mb-3">
            {title}
          </Text>

          {data.map((item: string) => (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              className="py-3 border-b border-gray-100 flex-row items-center justify-between"
            >
              <Text className="text-[#002B66] font-semibold">
                {item}
              </Text>

              <Check size={18} color="#0052CC" />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}