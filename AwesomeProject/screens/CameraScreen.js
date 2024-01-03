// React Native
import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import MyCamera from "../components/Camera";
import { choosePhoto } from "../utils/ImagePicker";
import { Asset } from "expo-asset";
import axios from "axios";

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const [imageOrientation, setImageOrientation] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );

  const [session, setSession] = useState(null);

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationInfo.orientation);
    });

    // const imageAsset = Asset.fromModule(
    //   require("../assets/khai-truong-ttkh-cong-hoa-chao-mung-pnj-tron-30-tuoi-4.jpg")
    // );
    // sendImageToServer(imageAsset.uri);

    fetch("https://flask-pnj-detect.onrender.com/test")
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.log(error));
  }, []);

  // const sendImageToServer = async (uri) => {
  //   console.log("Sending image. URI:", uri);
  //   try {
  //     // let fileExtension = uri.split(".").pop(); // Extract file extension
  //     // console.log("type:", fileExtension);
  //     const formData = new FormData();
  //     formData.append("image", {
  //       name: new Date() + "_predictImage",
  //       type: "image/jpg",
  //       uri: uri,
  //     });

  //     const response = await fetch(
  //       "https://flask-pnj-detect.onrender.com/detect",
  //       {
  //         method: "POST",
  //         body: formData,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //     } else {
  //       console.log("Image upload failed");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };
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
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "90%", // chiếm 90% chiều rộng của màn hình
    aspectRatio: 4 / 6, // tỷ lệ giữa chiều rộng và chiều cao
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFD700",
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
