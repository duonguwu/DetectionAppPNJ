// // ImagePicker.js
import * as ImagePicker from "expo-image-picker";

// export const choosePhoto = async () => {
//   let result = await ImagePicker.launchImageLibraryAsync({
//     savePhotos: true,
//     mediaType: "photo",
//   });

// if (!result.canceled) {
//   const uri = result.assets[0].uri;
//   return uri;
// }
// };

export const choosePhoto = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    return uri;
  }
};
