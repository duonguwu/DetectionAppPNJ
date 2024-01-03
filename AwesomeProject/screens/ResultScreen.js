import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const ResultScreen = ({ route }) => {
  // Lấy dữ liệu từ màn hình trước
  const { imageUri, counts } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        {Object.entries(counts).map(([classId, count]) => (
          <Text key={classId} style={styles.infoText}>
            Class {classId}: {count} objects
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "50%",
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ResultScreen;
