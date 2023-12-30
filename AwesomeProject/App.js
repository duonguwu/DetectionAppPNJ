import React, { useState, useRef, useEffect } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as ScreenOrientation from "expo-screen-orientation";

const App = () => {
  const [image, setImage] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );
  const cameraRef = useRef(null);

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationInfo.orientation);
    });
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setImage(data.uri);
      setCameraVisible(false);
    }
  };

  const choosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {cameraVisible && (
        <Camera
          ref={cameraRef}
          style={styles.preview}
          type={Camera.Constants.Type.back}
          captureAudio={false}
          onOrientationChange={setOrientation}
        >
          <Button title="Chụp ảnh" onPress={takePhoto} color="#FFD700" />
        </Camera>
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
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              title="Mở camera"
              onPress={() => setCameraVisible(true)}
              color="#FFD700"
            />
            <Button
              title="Chọn ảnh từ thư viện"
              onPress={choosePhoto}
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

export default App;
