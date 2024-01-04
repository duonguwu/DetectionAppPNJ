// React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import MyCamera from "../components/Camera";
import { choosePhoto } from "../utils/ImagePicker";
import axios from "axios";
import { Icon } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import dfimg from "../assets/img/pnj-defaut.png";

const CameraScreen2 = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageOrientation, setImageOrientation] = useState(null);
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
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent={"Predicting..."}
        textStyle={styles.spinnerTextStyle}
      />
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
          <View style={styles.imageView}>
            <Image
              source={image ? { uri: image } : dfimg}
              style={[
                styles.image,
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                  ? { transform: [{ rotate: "90deg" }] }
                  : {},
              ]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCameraVisible(true)}
            >
              <Icon name="camera" type="font-awesome" color="#517fa4" />
              <Text style={styles.buttonText}>Mở camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const image = await choosePhoto();
                setImage(image);
                sendImageToServer(image);
              }}
            >
              <Icon name="photo" type="font-awesome" color="#517fa4" />
              <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>
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
    backgroundColor: "#f8f8ff",
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
    backgroundColor: "#f1f0fc",
  },
  imageView: {
    height: "80%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f1f0fc",
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
    color: "#020e3b",
    marginTop: 10,
  },
});

export default CameraScreen2;
