import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";
// Expo Go phone නම් laptop IP එක දාන්න:
// const API_BASE_URL = "http://192.168.1.5:8000/api";

type Batch = {
  batchId: string;
  fishType: string;
  rawWeight: number;
  predictedWaste?: number;
  cleanedWeight?: number;
  saltAmount?: number;
  saltingDurationHours?: number;
};

type BatchesResponse = {
  batches: Batch[];
};

type SaltPredictionResponse = {
  batchId: string;
  fishType: string;
  cleanedWeight: number;
  saltAmount: number;
  saltingDurationHours?: number;
};

export default function SaltPredictionPage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [saltResult, setSaltResult] = useState<SaltPredictionResponse | null>(
    null
  );

  const getLatestBatch = async () => {
    try {
      setLoading(true);

      const res = await axios.get<BatchesResponse>(`${API_BASE_URL}/batches`);

      if (res.data.batches && res.data.batches.length > 0) {
        const latestBatch = res.data.batches[0];
        setBatch(latestBatch);

        if (latestBatch.saltAmount) {
          setSaltResult({
            batchId: latestBatch.batchId,
            fishType: latestBatch.fishType,
            cleanedWeight: latestBatch.cleanedWeight || 0,
            saltAmount: latestBatch.saltAmount,
            saltingDurationHours: latestBatch.saltingDurationHours || 12,
          });
        }
      } else {
        setBatch(null);
      }
    } catch (error: any) {
      console.log("Get batch error:", error?.response?.data || error?.message);
      Alert.alert("Error", "Cannot get batch data");
    } finally {
      setLoading(false);
    }
  };

  const getCleanedWeight = () => {
    if (batch?.cleanedWeight) return Number(batch.cleanedWeight);

    const rawWeight = Number(batch?.rawWeight || 0);
    const predictedWaste = Number(batch?.predictedWaste || 0);

    if (rawWeight > 0 && predictedWaste > 0) {
      return rawWeight - predictedWaste;
    }

    return 0;
  };

  const predictSalt = async () => {
    if (!batch?.batchId) {
      Alert.alert("Error", "Batch ID not found");
      return;
    }

    const cleanedWeight = getCleanedWeight();

    if (!cleanedWeight || cleanedWeight <= 0) {
      Alert.alert(
        "Error",
        "Cleaned weight not found. Please complete waste prediction first."
      );
      return;
    }

    try {
      setPredicting(true);

      const res = await axios.post<SaltPredictionResponse>(
        `${API_BASE_URL}/batches/${batch.batchId}/predict-salt`,
        {
          cleanedWeight,
        }
      );

      setSaltResult({
        ...res.data,
        saltingDurationHours: res.data.saltingDurationHours || 12,
      });

      Alert.alert("Success", "Salt predicted successfully");
    } catch (error: any) {
      console.log("Salt error:", error?.response?.data || error?.message);
      Alert.alert("Error", "Salt prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const resetResult = () => {
    setSaltResult(null);
  };

  useEffect(() => {
    getLatestBatch();
  }, []);

  const cleanedWeight = getCleanedWeight();
  const saltAmount = saltResult?.saltAmount || 0;
  const duration = saltResult?.saltingDurationHours || 12;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.menuBtn}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

      <Text style={styles.title}>Salt Prediction</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#004E7C" />
      ) : !batch ? (
        <View style={styles.card}>
          <Text style={styles.errorTitle}>No Batch Found</Text>
          <Text style={styles.normalText}>Please create a batch first.</Text>

          <TouchableOpacity style={styles.resetButton} onPress={getLatestBatch}>
            <Text style={styles.resetText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.cleanedCard}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkText}>✓</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Cleaned Weight</Text>
              <Text style={styles.cleanedValue}>
                {cleanedWeight.toFixed(1)} kg
              </Text>
              <Text style={styles.smallText}>From Waste Prediction</Text>
            </View>

            <View style={styles.batchBox}>
              <Text style={styles.batchSmall}>Batch ID</Text>
              <Text style={styles.batchText}>{batch.batchId}</Text>
            </View>

            <View style={styles.batchBox}>
              <Text style={styles.batchSmall}>Fish Type</Text>
              <Text style={styles.batchText}>{batch.fishType}</Text>
            </View>
          </View>

          {!saltResult && (
            <TouchableOpacity
              style={styles.predictButton}
              onPress={predictSalt}
              disabled={predicting}
            >
              <Text style={styles.predictText}>
                {predicting ? "Predicting..." : "Predict Salt"}
              </Text>
            </TouchableOpacity>
          )}

          {saltResult && (
            <View style={styles.resultCard}>
              <Text style={styles.resultHeader}>⚗️ Prediction Result</Text>

              <View style={styles.resultBox}>
                <View style={styles.resultIconBox}>
                  <Text style={styles.resultIcon}>🧂</Text>
                </View>

                <View>
                  <Text style={styles.resultLabel}>
                    Recommended Salt Amount
                  </Text>
                  <Text style={styles.resultValue}>
                    {Number(saltAmount).toFixed(2)} kg
                  </Text>
                  <Text style={styles.greenText}>6.0% of cleaned weight</Text>
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.resultIconBox}>
                  <Text style={styles.resultIcon}>⌛</Text>
                </View>

                <View>
                  <Text style={styles.resultLabel}>
                    Recommended Salting Duration
                  </Text>
                  <Text style={styles.resultValue}>{duration} Hours</Text>
                  <Text style={styles.greenText}>
                    Duration for optimal salting
                  </Text>
                </View>
              </View>

              <View style={styles.noteBox}>
                <Text style={styles.noteIcon}>💡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteTitle}>Recommendation Notes</Text>
                  <Text style={styles.noteText}>
                    These values are based on industry best practices and
                    historical data analysis.
                  </Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.resetButton} onPress={resetResult}>
                  <Text style={styles.resetText}>↻ Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.proceedButton}>
                  <Text style={styles.proceedText}>Proceed to Salting →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoText}>
              Follow the recommended values for best quality and preservation.
            </Text>
          </View>
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
    padding: 20,
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
    marginTop: 55,
    fontSize: 32,
    fontWeight: "bold",
    color: "#004E7C",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  cleanedCard: {
    backgroundColor: "#F2FFF7",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#D9F2E3",
  },
  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1BAE5A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  checkText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  label: {
    fontSize: 12,
    color: "#003B5C",
    fontWeight: "bold",
  },
  cleanedValue: {
    fontSize: 20,
    color: "#00853E",
    fontWeight: "bold",
    marginTop: 3,
  },
  smallText: {
    fontSize: 11,
    color: "#003B5C",
    marginTop: 3,
  },
  batchBox: {
    backgroundColor: "#EEF6FF",
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
    maxWidth: 72,
  },
  batchSmall: {
    fontSize: 8,
    color: "#004E7C",
    fontWeight: "bold",
  },
  batchText: {
    fontSize: 8,
    color: "#003B5C",
    fontWeight: "bold",
  },
  predictButton: {
    backgroundColor: "#0057A8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 18,
  },
  predictText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  resultHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#003B5C",
    marginBottom: 18,
  },
  resultBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DCE7F5",
  },
  resultIconBox: {
    width: 55,
    height: 55,
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  resultIcon: {
    fontSize: 28,
  },
  resultLabel: {
    color: "#003B5C",
    fontWeight: "bold",
    fontSize: 13,
  },
  resultValue: {
    color: "#004AAD",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 3,
  },
  greenText: {
    color: "#00853E",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 3,
  },
  noteBox: {
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  noteIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  noteTitle: {
    fontWeight: "bold",
    color: "#003B5C",
    marginBottom: 4,
  },
  noteText: {
    color: "#003B5C",
    fontSize: 12,
    lineHeight: 17,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 22,
    justifyContent: "space-between",
  },
  resetButton: {
    width: "34%",
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  resetText: {
    color: "#004AAD",
    fontWeight: "bold",
  },
  proceedButton: {
    width: "60%",
    backgroundColor: "#004AAD",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  proceedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#EEF6FF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: "#003B5C",
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 18,
  },
  errorTitle: {
    color: "#004E7C",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  normalText: {
    color: "#003B5C",
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
});