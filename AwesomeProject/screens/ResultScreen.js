import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const ResultScreen = ({ route }) => {
  // Lấy dữ liệu từ màn hình trước
  const { imageUri, counts } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.infoContainer}>
        {counts.map((item, index) => (
          <View style={styles.infoBox} key={index}>
            <Text style={styles.infoText}>
              Số lượng {item.class}: {item.count}
            </Text>
          </View>
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
    backgroundColor: "#f1f0fc",
  },
  image: {
    width: "70%",
    height: "60%",
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
    width: "100%",
    height: "auto",
  },
  infoBox: {
    alignItems: "flex-start",
    paddingLeft: 40,
    backgroundColor: "#f8f8ff",
    padding: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#020e3b",
  },
});

export default ResultScreen;
