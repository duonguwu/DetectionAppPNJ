// MyCamera.js
import React, { useRef } from "react";
import { Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

const MyCamera = ({ onTakePhoto, handleImage, style, orientation }) => {
  const cameraRef = useRef(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const uri = data.uri;
      onTakePhoto(uri, orientation);
    }
  };

  return (
    <Camera
      ref={cameraRef}
      style={style}
      type={Camera.Constants.Type.back}
      captureAudio={false}
    >
      <Button title="Chụp ảnh" onPress={takePhoto} color="#FFD700" />
    </Camera>
  );
};

export default MyCamera;
