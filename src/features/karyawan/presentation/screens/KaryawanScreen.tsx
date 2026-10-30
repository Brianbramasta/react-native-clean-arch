import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useKaryawanQuery } from "../hooks/useKaryawanQuery";
import { KaryawanCard } from "../components/KaryawanCard";

export const KaryawanScreen: React.FC = () => {
  const { data: karyawanList, isLoading, error } = useKaryawanQuery();

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Terjadi kesalahan sistem.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Karyawann</Text>
      <FlatList
        data={karyawanList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <KaryawanCard karyawan={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});