// // ImagePicker.js
import * as ImagePicker from "expo-image-picker";

export const choosePhoto = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
    quality: 0.5,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    return uri;
  }
};
