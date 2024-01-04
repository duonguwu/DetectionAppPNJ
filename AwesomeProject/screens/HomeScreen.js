import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với Jewellery Detection!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Camera")}
        >
          <Icon name="camera" type="font-awesome" color="#517fa4" />
          <Text style={styles.buttonText}>Kiểm kê</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Statistics")}
        >
          <Icon name="bar-chart" type="font-awesome" color="#517fa4" />
          <Text style={styles.buttonText}>Thống kê</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#f8f8ff",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  buttonText: {
    color: "#000",
    marginTop: 10,
  },
});

export default HomeScreen;
