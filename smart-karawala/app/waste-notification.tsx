import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

type Batch = {
  batchId: string;
  fishType: string;
  rawWeight: number;
  predictedWaste?: number;
};

type BatchesResponse = {
  batches: Batch[];
};

type Company = {
  id: number;
  name: string;
  phone: string;
};

export default function WasteNotificationPage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const companies: Company[] = [
    {
      id: 1,
      name: "Ocean Recyclers (Pvt) Ltd",
      phone: "+94 77 123 4567",
    },
    {
      id: 2,
      name: "Ceylon Fish Meal (Pvt) Ltd",
      phone: "+94 71 987 6543",
    },
    {
      id: 3,
      name: "BlueWave Eco Solutions",
      phone: "+94 70 555 8899",
    },
  ];

  const getLatestBatch = async () => {
    try {
      const res = await axios.get<BatchesResponse>(`${API_BASE_URL}/batches`);

      if (res.data.batches && res.data.batches.length > 0) {
        setBatch(res.data.batches[0]);
      } else {
        setBatch(null);
      }
    } catch (error: any) {
      console.log("Load batch error:", error?.response?.data || error?.message);
      Alert.alert("Error", "Cannot load batch data");
    }
  };

  useEffect(() => {
    getLatestBatch();
  }, []);

  const sendNotification = async () => {
    if (!batch?.batchId) {
      Alert.alert("Error", "Batch not found");
      return;
    }

    if (!batch.predictedWaste || batch.predictedWaste <= 0) {
      Alert.alert("Error", "Please predict waste first");
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(
        `${API_BASE_URL}/batches/${batch.batchId}/send-waste-notification`,
        {
          selectedCompanies: companies.map((company) => company.name),
          additionalMessage: message,
        }
      );

      Alert.alert("Success", "Waste notification sent successfully!");
      console.log("Notification saved:", res.data);
    } catch (error: any) {
      console.log(
        "Notification error:",
        error?.response?.data || error?.message
      );

      Alert.alert("Error", "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const predictedWaste = batch?.predictedWaste
    ? Number(batch.predictedWaste).toFixed(1)
    : "0.0";

  const backendMessage = batch
    ? `${batch.fishType} Type (${batch.batchId}) is expected to generate ${predictedWaste} kg of fish waste. Prepare collection for reuse or fish meal processing.`
    : "No batch data available.";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

      <Text style={styles.title}>Waste notification</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👥 1. Select Company</Text>
        <Text style={styles.subText}>
          Choose one or more companies to notify.
        </Text>

        {companies.map((company) => (
          <View key={company.id} style={styles.companyCard}>
            <Text style={styles.checkbox}>✓</Text>

            <View style={styles.companyTextArea}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyPhone}>{company.phone}</Text>
            </View>

            <Text style={styles.selectedBadge}>Selected</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          🗂️ 2. Waste Details
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Estimated Waste Quantity</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputText}>{predictedWaste}</Text>
              <Text style={styles.kgText}>kg</Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Batch ID</Text>

            <View style={styles.inputBox}>
              <Text style={styles.batchIdText}>
                {batch?.batchId || "No batch"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.previewTitle}>Backend Notification Message</Text>

        <View style={styles.previewBox}>
          <Text style={styles.previewText}>{backendMessage}</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          💬 3. Additional Message (Optional)
        </Text>

        <TextInput
          style={styles.textArea}
          placeholder="Add any additional information..."
          multiline
          value={message}
          onChangeText={setMessage}
          maxLength={200}
        />

        <Text style={styles.charCount}>{message.length}/200</Text>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendNotification}
          disabled={sending}
        >
          <Text style={styles.sendButtonText}>
            {sending ? "Sending..." : "Send Notification"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Companies will receive your waste details and estimated quantity for
          better planning and collection.
        </Text>
      </View>

      <Text style={styles.footer}>Powered by Smart Karawala</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#DFF3FA",
    padding: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  backText: {
    fontSize: 26,
    color: "#003B5C",
    fontWeight: "bold",
  },
  logo: {
    alignSelf: "flex-end",
    marginTop: -40,
    fontSize: 18,
    fontWeight: "bold",
    color: "#003B5C",
    textAlign: "center",
  },
  title: {
    marginTop: 45,
    fontSize: 32,
    fontWeight: "bold",
    color: "#004E7C",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#003B5C",
  },
  subText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    marginBottom: 14,
  },
  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3EAF5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  checkbox: {
    color: "#0057A8",
    fontWeight: "bold",
    marginRight: 12,
    fontSize: 16,
  },
  companyTextArea: {
    flex: 1,
  },
  companyName: {
    fontWeight: "bold",
    color: "#003B5C",
    fontSize: 13,
  },
  companyPhone: {
    color: "#003B5C",
    marginTop: 3,
    fontSize: 12,
  },
  selectedBadge: {
    backgroundColor: "#E7F9E9",
    color: "#3E9A44",
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "bold",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  detailBox: {
    width: "48%",
  },
  detailLabel: {
    fontSize: 11,
    color: "#003B5C",
    marginBottom: 7,
  },
  inputBox: {
    minHeight: 45,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#DCE7F5",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    color: "#003B5C",
    fontWeight: "bold",
    fontSize: 13,
  },
  batchIdText: {
    color: "#003B5C",
    fontWeight: "bold",
    fontSize: 9,
  },
  kgText: {
    color: "#777",
    fontSize: 12,
  },
  previewTitle: {
    marginTop: 18,
    fontWeight: "bold",
    color: "#003B5C",
  },
  previewBox: {
    marginTop: 8,
    backgroundColor: "#F1F8FF",
    padding: 12,
    borderRadius: 8,
  },
  previewText: {
    color: "#003B5C",
    fontSize: 12,
    lineHeight: 18,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#DCE7F5",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#FAFCFF",
  },
  charCount: {
    textAlign: "right",
    color: "#888",
    fontSize: 11,
    marginTop: 6,
  },
  sendButton: {
    backgroundColor: "#0057A8",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  infoBox: {
    backgroundColor: "#EAF4FF",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    color: "#003B5C",
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
});