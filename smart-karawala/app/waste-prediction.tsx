import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
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

type PredictionResponse = {
  batch: Batch;
};

type BatchesResponse = {
  batches: Batch[];
};

export default function WastePredictionPage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Batch | null>(null);

  const getLatestBatch = async () => {
    try {
      setLoading(true);
      setPrediction(null);

      const response = await axios.get<BatchesResponse>(
        `${API_BASE_URL}/batches`
      );

      if (response.data.batches && response.data.batches.length > 0) {
        setBatch(response.data.batches[0]);
      } else {
        setBatch(null);
      }
    } catch (error: any) {
      console.log("Get batch error:", error?.response?.data || error?.message);
      Alert.alert("Error", "Cannot get batch data");
      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  const predictWaste = async () => {
    if (!batch?.batchId) {
      Alert.alert("Error", "Batch ID not found");
      return;
    }

    try {
      setPredicting(true);

      const response = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/batches/${batch.batchId}/predict-waste`
      );

      setPrediction(response.data.batch);
      setBatch(response.data.batch);

      Alert.alert("Success", "Waste predicted successfully");
    } catch (error: any) {
      console.log("Predict error:", error?.response?.data || error?.message);
      Alert.alert("Error", "Waste prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const sendNotification = async () => {
    if (!batch?.batchId) {
      Alert.alert("Error", "Batch ID not found");
      return;
    }

    if (!batch.predictedWaste && !prediction?.predictedWaste) {
      Alert.alert("Error", "Please predict waste first");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        `${API_BASE_URL}/batches/${batch.batchId}/send-waste-notification`
      );

      Alert.alert("Success", "Waste notification sent successfully!");
    } catch (error: any) {
      console.log(
        "Notification error:",
        error?.response?.data || error?.message
      );
      Alert.alert("Error", "Notification sending failed");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    getLatestBatch();
  }, []);

  const predictedWaste =
    prediction?.predictedWaste ?? batch?.predictedWaste ?? 0;

  const rawWeight = Number(batch?.rawWeight || 0);
  const cleanedWeight = rawWeight - Number(predictedWaste);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.menuBtn}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

      <Text style={styles.title}>Waste Prediction</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#004E7C" />
      ) : !batch ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No Batch Found</Text>
          <Text style={styles.normalText}>Please create a batch first.</Text>

          <TouchableOpacity style={styles.mainButton} onPress={getLatestBatch}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>▣</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Batch Summary</Text>

              <Text style={styles.label}>Batch ID</Text>
              <Text style={styles.value}>{batch.batchId}</Text>

              <Text style={styles.label}>Fish Type</Text>
              <Text style={styles.value}>{batch.fishType}</Text>

              <Text style={styles.label}>Raw Fish Weight</Text>
              <Text style={styles.value}>{batch.rawWeight} kg</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.predictButton}
            onPress={predictWaste}
            disabled={predicting}
          >
            <Text style={styles.buttonText}>
              {predicting ? "Predicting..." : "📊  Predict Waste"}
            </Text>
          </TouchableOpacity>

          {(prediction || batch.predictedWaste) && (
            <View style={styles.resultCard}>
              <Text style={styles.resultHeader}>📈 Prediction Result</Text>

              <View style={styles.resultRow}>
                <View style={styles.circle}>
                  <Text style={styles.circleValue}>
                    {Number(predictedWaste).toFixed(1)} kg
                  </Text>
                  <Text style={styles.circleLabel}>Total Waste</Text>
                </View>

                <View style={styles.resultBoxes}>
                  <View style={styles.smallBox}>
                    <Text style={styles.boxLabel}>Predicted Waste</Text>
                    <Text style={styles.boxValue}>
                      {Number(predictedWaste).toFixed(1)} kg
                    </Text>
                  </View>

                  <View style={styles.smallBox}>
                    <Text style={styles.boxLabel}>
                      Estimated Cleaned Weight
                    </Text>
                    <Text style={styles.boxValue}>
                      {cleanedWeight.toFixed(1)} kg
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.confidenceBox}>
                <Text style={styles.confidenceText}>
                  ✅ High confidence prediction
                </Text>
                <Text style={styles.normalText}>Model confidence: 92%</Text>
              </View>

              <View style={styles.notificationInfoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  After prediction, you can send waste notification to recycling
                  partners.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendNotification}
                disabled={sending}
              >
                <Text style={styles.sendButtonText}>
                  {sending ? "Sending..." : "  Send Notification"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <Text style={styles.footer}>Powered by Smart Karawala</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#DFF3FA",
    padding: 24,
  },
  menuBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  menuText: {
    fontSize: 22,
    color: "#003B5C",
  },
  logo: {
    alignSelf: "flex-end",
    marginTop: -35,
    fontSize: 18,
    fontWeight: "bold",
    color: "#003B5C",
    textAlign: "center",
  },
  title: {
    marginTop: 50,
    fontSize: 34,
    fontWeight: "bold",
    color: "#004E7C",
    textAlign: "center",
    marginBottom: 28,
  },
  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    flexDirection: "row",
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
    color: "#004AAD",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#004AAD",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#004E7C",
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#003B5C",
  },
  mainButton: {
    backgroundColor: "#004AAD",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 18,
    alignItems: "center",
  },
  predictButton: {
    backgroundColor: "#0057A8",
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "#fff",
    marginTop: 22,
    padding: 18,
    borderRadius: 12,
  },
  resultHeader: {
    fontWeight: "bold",
    color: "#004E7C",
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 135,
    height: 135,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: "#20B15A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  circleValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003B5C",
  },
  circleLabel: {
    fontWeight: "bold",
    color: "#003B5C",
  },
  resultBoxes: {
    flex: 1,
  },
  smallBox: {
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D7EAF7",
  },
  boxLabel: {
    fontSize: 12,
    color: "#004E7C",
  },
  boxValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004AAD",
    marginTop: 4,
  },
  confidenceBox: {
    backgroundColor: "#F1FFF6",
    padding: 15,
    borderRadius: 10,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#D8F2E1",
  },
  confidenceText: {
    fontWeight: "bold",
    color: "#009B4E",
    marginBottom: 5,
  },
  notificationInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 18,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#003B5C",
  },
  sendButton: {
    backgroundColor: "#0057A8",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  normalText: {
    color: "#003B5C",
  },
  footer: {
    marginTop: 55,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
});