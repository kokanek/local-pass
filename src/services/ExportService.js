import { Platform, Alert, Share } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportData = async (secureData) => {
  try {
    if (!secureData || secureData.length === 0) {
      Alert.alert("Export Error", "No passwords to export");
      return;
    }

    console.log("Exporting data: ", secureData.length, "items");
    const fileContent = JSON.stringify(secureData, null, 2);
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
          dialogTitle: "Save your LocalPass data",
          UTI: "public.json",
        });

        Alert.alert(
          "Export Successful",
          "File has been exported. Select a location to save it.",
        );
      } else {
        // Fallback to Share API
        console.log("Sharing not available, using Share API");
        const shareOptions = {
          title: "LocalPass Export",
          message: "Save your LocalPass data",
          url: Platform.OS === "ios" ? tempFilePath : `file://${tempFilePath}`,
        };

        await Share.share(shareOptions);

        Alert.alert(
          "Export Successful",
          "File has been exported. Select an app or location to save it.",
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
