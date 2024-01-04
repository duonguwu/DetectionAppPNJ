// React Native
import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, Platform, ActivityIndicator } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import MyCamera from "../components/Camera";
import { choosePhoto } from "../utils/ImagePicker";
import { Asset } from "expo-asset";
import axios from "axios";

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [imageOrientation, setImageOrientation] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );


  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationInfo.orientation);
    });
  }, []);

  const sendImageToServer = async (uri) => {
    setLoading(true)
    setImage(null)
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
        url: "https://flask-elkj.onrender.com/detect",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setImage(response.data.image)
        setLoading(false)
      } else {
        setLoading(false)
        console.log("Image upload failed");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      {cameraVisible && (
        <MyCamera
          onTakePhoto={(uri, orientation) => {
            setImageOrientation(orientation);
            setCameraVisible(false);
            sendImageToServer(uri);
          }}
          style={styles.preview}
          orientation={orientation}
        />
      )}
      {!cameraVisible && (
        <View style={styles.detectContainer}>
          <View style={styles.imageContainer}>
            {loading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {image && (
              <Image
                source={{ uri: `data:image/png;base64,${image}` }}
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
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Mở camera"
              onPress={() => setCameraVisible(true)}
              color="#C0C0C0"
            />
            <Button
              title="Chọn ảnh"
              onPress={async () => {
                const image = await choosePhoto();
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
  detectContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "90%", // chiếm 90% chiều rộng của màn hình
    aspectRatio: 4 / 6, // tỷ lệ giữa chiều rộng và chiều cao
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFD700",
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
});

export default CameraScreen;
