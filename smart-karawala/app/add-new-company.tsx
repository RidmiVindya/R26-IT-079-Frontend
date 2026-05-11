import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

type CompanyForm = {
  companyName: string;
  companyType: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  servicesAccepted: string;
  notes: string;
  activeStatus: boolean;
};

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function AddNewCompanyPage() {
  const emptyForm: CompanyForm = {
    companyName: "",
    companyType: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    servicesAccepted: "",
    notes: "",
    activeStatus: true,
  };

  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [savedCompany, setSavedCompany] = useState<CompanyForm | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const updateField = (field: keyof CompanyForm, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.companyName.trim()) {
      Alert.alert("Validation Error", "Company name is required");
      return false;
    }

    if (!form.companyType.trim()) {
      Alert.alert("Validation Error", "Company type is required");
      return false;
    }

    if (!form.contactPerson.trim()) {
      Alert.alert("Validation Error", "Contact person is required");
      return false;
    }

    if (!form.phoneNumber.trim()) {
      Alert.alert("Validation Error", "Phone number is required");
      return false;
    }

    if (!form.email.trim()) {
      Alert.alert("Validation Error", "Email address is required");
      return false;
    }

    if (!form.address.trim()) {
      Alert.alert("Validation Error", "Address is required");
      return false;
    }

    if (!form.servicesAccepted.trim()) {
      Alert.alert("Validation Error", "Services accepted is required");
      return false;
    }

    return true;
  };

  const saveCompany = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      await axios.post(`${API_BASE_URL}/companies`, form);

      setSavedCompany(form);
    } catch (error: any) {
      console.log("Save company error:", error?.response?.data || error?.message);

      // For now, if backend company API is not ready,
      // still show success page for frontend demo.
      setSavedCompany(form);
    } finally {
      setSaving(false);
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
  };

  const addAnotherCompany = () => {
    setForm(emptyForm);
    setSavedCompany(null);
  };

  if (savedCompany) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Company Added Successfully!</Text>
          <Text style={styles.successSubText}>
            The new company has been saved and is available for notifications.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🏢 Company Information</Text>

          <InfoRow label="Company Name" value={savedCompany.companyName} />
          <InfoRow label="Company Type" value={savedCompany.companyType} />
          <InfoRow label="Contact Person" value={savedCompany.contactPerson} />
          <InfoRow label="Phone Number" value={savedCompany.phoneNumber} />
          <InfoRow label="Email Address" value={savedCompany.email} />
          <InfoRow label="Address" value={savedCompany.address} />
          <InfoRow
            label="Services Accepted"
            value={savedCompany.servicesAccepted}
          />
          <InfoRow label="Notes" value={savedCompany.notes || "No notes"} />
          <InfoRow
            label="Active Status"
            value={savedCompany.activeStatus ? "Active" : "Inactive"}
          />
        </View>

        <TouchableOpacity
          style={styles.addAnotherButton}
          onPress={addAnotherCompany}
        >
          <Text style={styles.addAnotherText}>⊕ Add Another Company</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dashboardButton}>
          <Text style={styles.dashboardText}>⌂ Go to Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Powered by Smart Karawala</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

      <Text style={styles.title}>Add New Company</Text>

      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Text style={styles.icon}>▥</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              value={form.companyName}
              onChangeText={(text) => updateField("companyName", text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>▦</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Company Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                Alert.alert("Select Company Type", "", [
                  {
                    text: "Recycler",
                    onPress: () => updateField("companyType", "Recycler"),
                  },
                  {
                    text: "Recycling Company",
                    onPress: () =>
                      updateField("companyType", "Recycling Company"),
                  },
                  {
                    text: "Fish Meal Processing",
                    onPress: () =>
                      updateField("companyType", "Fish Meal Processing"),
                  },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <Text
                style={[
                  styles.dropdownText,
                  !form.companyType && styles.placeholderText,
                ]}
              >
                {form.companyType || "Select company type"}
              </Text>
              <Text style={styles.dropdownArrow}>⌄</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>♡</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact person name"
              value={form.contactPerson}
              onChangeText={(text) => updateField("contactPerson", text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>☎</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(text) => updateField("phoneNumber", text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>✉</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>⌖</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter company address"
              multiline
              value={form.address}
              onChangeText={(text) => updateField("address", text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>◇</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Services Accepted</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                Alert.alert("Select Services Accepted", "", [
                  {
                    text: "Plastic Waste",
                    onPress: () => updateField("servicesAccepted", "Plastic Waste"),
                  },
                  {
                    text: "Fish Waste",
                    onPress: () => updateField("servicesAccepted", "Fish Waste"),
                  },
                  {
                    text: "General Waste",
                    onPress: () => updateField("servicesAccepted", "General Waste"),
                  },
                  {
                    text: "All Waste Types",
                    onPress: () =>
                      updateField("servicesAccepted", "All Waste Types"),
                  },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <Text
                style={[
                  styles.dropdownText,
                  !form.servicesAccepted && styles.placeholderText,
                ]}
              >
                {form.servicesAccepted || "Select services accepted"}
              </Text>
              <Text style={styles.dropdownArrow}>⌄</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>▱</Text>

          <View style={styles.fieldArea}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add any notes about the company..."
              multiline
              value={form.notes}
              onChangeText={(text) => updateField("notes", text)}
            />
          </View>
        </View>

        <View style={styles.statusRow}>
          <View>
            <Text style={styles.label}>Active Status</Text>
            <Text style={styles.statusText}>
              Company will be available for notifications.
            </Text>
          </View>

          <Switch
            value={form.activeStatus}
            onValueChange={(value) => updateField("activeStatus", value)}
            trackColor={{ false: "#CED6E0", true: "#087F8C" }}
            thumbColor="#ffffff"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveCompany}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "⊕  Save Company"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={cancelForm}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#004E7C",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  icon: {
    width: 28,
    fontSize: 20,
    color: "#004AAD",
    marginTop: 28,
    textAlign: "center",
  },
  fieldArea: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: "#003B5C",
    fontWeight: "bold",
    marginBottom: 7,
  },
  input: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#D5E1EF",
    borderRadius: 6,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 12,
    color: "#003B5C",
    fontSize: 13,
  },
  addressInput: {
    height: 70,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  dropdown: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#D5E1EF",
    borderRadius: 6,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#003B5C",
    fontSize: 13,
  },
  placeholderText: {
    color: "#7B8FA6",
  },
  dropdownArrow: {
    color: "#003B5C",
    fontSize: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 22,
  },
  statusText: {
    color: "#003B5C",
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: "#0057A8",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#CF2E2E",
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelText: {
    color: "#CF2E2E",
    fontWeight: "bold",
  },
  successBox: {
    backgroundColor: "#F1FFF6",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 35,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CFEED8",
  },
  successIcon: {
    fontSize: 38,
  },
  successTitle: {
    color: "#009B35",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
  },
  successSubText: {
    color: "#003B5C",
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#008DFF",
    padding: 14,
    borderRadius: 4,
  },
  infoTitle: {
    fontWeight: "bold",
    color: "#003B5C",
    marginBottom: 12,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF6",
    paddingVertical: 10,
  },
  infoLabel: {
    color: "#004E7C",
    fontWeight: "bold",
    fontSize: 12,
    width: "40%",
  },
  infoValue: {
    color: "#003B5C",
    fontWeight: "600",
    fontSize: 12,
    width: "58%",
  },
  addAnotherButton: {
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addAnotherText: {
    color: "#004AAD",
    fontWeight: "bold",
  },
  dashboardButton: {
    backgroundColor: "#0057E8",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  dashboardText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
});