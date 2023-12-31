// React Native
import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import MyCamera from "../components/Camera";
import { choosePhoto } from "../utils/ImagePicker";
import axios from "axios";

const CameraScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [imageOrientation, setImageOrientation] = useState(null);
  const [session, setSession] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationInfo.orientation);
    });

    fetch("https://flask-pnj-detect.onrender.com/test")
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.log(error));
  }, []);

  const sendImageToServer = async (uri) => {
    console.log("Sending image. URI:", uri);
    try {
      const formData = new FormData();
      let uriParts = uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      formData.append("image", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await axios({
        method: "POST",
        url: "https://flask-pnj-detect.onrender.com/detect",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        navigation.navigate("Result", {
          imageUri: "data:image/png;base64," + response.data.image,
          counts: response.data.object_counts,
        });
      } else {
        console.log("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      {cameraVisible && (
        <MyCamera
          onTakePhoto={(uri, orientation) => {
            setImage(uri);
            setImageOrientation(orientation);
            setCameraVisible(false);
            sendImageToServer(uri);
          }}
          style={styles.preview}
          orientation={orientation}
        />
      )}
      {!cameraVisible && (
        <View style={styles.imageContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={[
                styles.image,
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                  ? { transform: [{ rotate: "90deg" }] }
                  : {},
              ]}
              resizeMode="contain"
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Mở camera"
              onPress={() => setCameraVisible(true)}
              color="#C0C0C0"
            />
            <Button
              title="Chọn ảnh từ thư viện"
              onPress={async () => {
                const image = await choosePhoto();
                setImage(image);
                sendImageToServer(image);
              }}
              color="#C0C0C0"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3fcc7",
  },
  image: {
    width: "90%", // chiếm 90% chiều rộng của màn hình
    aspectRatio: 4 / 6, // tỷ lệ giữa chiều rộng và chiều cao
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
    backgroundColor: "black",
  },
});

export default CameraScreen;
