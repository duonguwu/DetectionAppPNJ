import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const ResultScreen = ({ route }) => {
  // Lấy dữ liệu từ màn hình trước
  const { imageUri, counts } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        {counts.map((item, index) => (
          <Text key={index} style={styles.infoText}>
            Class {item.class}: {item.count} objects
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
