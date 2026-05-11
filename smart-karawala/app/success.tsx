import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function CompanyAddedSuccessPage() {
  const company = {
    name: "Green Ocean Recyclers (Pvt) Ltd",
    type: "Recycling Company",
    contactPerson: "Nimal Perera",
    phone: "+94 77 258 9632",
    email: "info@greenocean.lk",
    address: "No. 45, Fisheries Road, Negombo, Sri Lanka",
    services: "Plastic Waste, Fish Waste, General Waste",
    notes: "Available for regular collection.",
    active: true,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Smart{"\n"}කරවල</Text>

      <View style={styles.successCard}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkText}>✓</Text>
        </View>

        <Text style={styles.successTitle}>Company Added Successfully!</Text>
        <Text style={styles.successSubText}>
          The new company has been saved and is available for notifications.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>🏢 Company Information</Text>

        <InfoRow icon="🏢" label="Company Name" value={company.name} />
        <InfoRow icon="💼" label="Company Type" value={company.type} />
        <InfoRow icon="👤" label="Contact Person" value={company.contactPerson} />
        <InfoRow icon="📞" label="Phone Number" value={company.phone} />
        <InfoRow icon="✉️" label="Email Address" value={company.email} />
        <InfoRow icon="📍" label="Address" value={company.address} />
        <InfoRow icon="🏷️" label="Services Accepted" value={company.services} />
        <InfoRow icon="💬" label="Notes" value={company.notes} />

        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Text style={styles.rowIcon}>✅</Text>
          </View>

          <Text style={styles.rowLabel}>Active Status</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>⊕  Add Another Company</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>🏠  Go to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Powered by Smart Karawala</Text>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Text style={styles.rowIcon}>{icon}</Text>
      </View>

      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
    marginTop: 18,
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
  successCard: {
    backgroundColor: "#F7FFF7",
    borderColor: "#BCE8C8",
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 75,
    marginBottom: 14,
  },
  checkCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2EAD4B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  checkText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  successTitle: {
    color: "#0A9A29",
    fontSize: 18,
    fontWeight: "bold",
  },
  successSubText: {
    color: "#003B5C",
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#008CFF",
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#003B5C",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF6",
  },
  iconBox: {
    width: 30,
    alignItems: "center",
  },
  rowIcon: {
    fontSize: 15,
  },
  rowLabel: {
    width: 100,
    fontSize: 11,
    fontWeight: "bold",
    color: "#003B5C",
  },
  rowValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: "#001D3D",
  },
  statusBadge: {
    backgroundColor: "#DFF9DF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: "#168C25",
    fontSize: 10,
    fontWeight: "bold",
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#0057E7",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 22,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  outlineButtonText: {
    color: "#004AAD",
    fontWeight: "bold",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#0057E7",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  footer: {
    marginTop: 70,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
});