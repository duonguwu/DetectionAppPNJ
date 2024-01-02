// ImagePicker.js
import * as ImagePicker from "expo-image-picker";

export const choosePhoto = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};
