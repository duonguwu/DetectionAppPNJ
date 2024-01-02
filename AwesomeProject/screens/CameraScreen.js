import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import MyCamera from "../components/Camera";
import { choosePhoto } from "../utils/ImagePicker";

const CameraScreen = () => {
  const [image, setImage] = useState(null);
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

  return (
    <View style={styles.container}>
      {cameraVisible && (
        <MyCamera
          onTakePhoto={(uri, orientation) => {
            setImage(uri);
            setImageOrientation(orientation);
            setCameraVisible(false);
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
