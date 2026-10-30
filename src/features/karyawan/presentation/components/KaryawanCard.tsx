import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Karyawan } from "../../domain/entities/Karyawan";

interface KaryawanCardProps {
  karyawan: Karyawan;
}

export const KaryawanCard: React.FC<KaryawanCardProps> = ({ karyawan }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{karyawan.fullName}</Text>
      <Text style={styles.role}>{karyawan.role}</Text>
      <Text style={styles.date}>
        Bergabung: {karyawan.joinDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
});