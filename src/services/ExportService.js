import { Platform, Alert, Share } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { encryptData } from "./CryptoService";

export const exportData = async (secureData, password) => {
  try {
    if (!secureData || secureData.length === 0) {
      Alert.alert("Export Error", "No passwords to export");
      return;
    }

    if (!password) {
      Alert.alert("Export Error", "Password is required for encryption");
      return;
    }

    console.log("Exporting data: ", secureData.length, "items");

    // Encrypt the data
    let fileContent;
    try {
      const encryptedPayload = await encryptData(secureData, password);
      fileContent = JSON.stringify(encryptedPayload, null, 2);
    } catch (encryptError) {
      console.error("Encryption error:", encryptError);
      Alert.alert(
        "Export Error",
        "Failed to encrypt data: " + encryptError.message,
      );
      return;
    }

    const fileName = `localpass_export_${new Date().toISOString().slice(0, 10)}.json`;

    // Create a temporary file first
    const tempFilePath = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      // Write the file to cache
      console.log("Writing to cache: ", tempFilePath);
      await FileSystem.writeAsStringAsync(tempFilePath, fileContent);
      console.log("File written successfully");

      // Check if sharing is available on this device
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        console.log("Using Expo Sharing API");
        // For Android, use the Sharing API with the full file path
        await Sharing.shareAsync(tempFilePath, {
          mimeType: "application/json",
          dialogTitle: "Save your encrypted LocalPass data",
          UTI: "public.json",
        });

        Alert.alert(
          "Export Successful",
          "Your passwords have been encrypted and exported. You will need this file and the password to import the data.",
        );
      } else {
        // Fallback to Share API
        console.log("Sharing not available, using Share API");
        const shareOptions = {
          title: "LocalPass Export",
          message: "Save your encrypted LocalPass data",
          url: Platform.OS === "ios" ? tempFilePath : `file://${tempFilePath}`,
        };

        await Share.share(shareOptions);
        Alert.alert(
          "Export Successful",
          "Your passwords have been encrypted and exported. You will need this file and the password to import the data.",
        );
      }
    } catch (innerError) {
      console.error("Error during export:", innerError);
      Alert.alert(
        "Export Error",
        "Failed to export passwords. Error: " + innerError.message,
      );
    }
  } catch (error) {
    console.error("Export error:", error);
    Alert.alert(
      "Export Error",
      "Failed to export passwords. Error: " + error.message,
    );
  }
};
