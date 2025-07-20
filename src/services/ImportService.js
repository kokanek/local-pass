import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { storeData } from "./StorageService";

export const importData = async (secureData, setSecureData) => {
  try {
    console.log("Starting import process");

    // In newer versions of Expo, the result structure is different
    let result;
    try {
      result = await DocumentPicker.getDocumentAsync({
        type: ["application/json"],
        copyToCacheDirectory: true, // Important for accessing the file
      });
      console.log("Document picker complete result:", JSON.stringify(result));
    } catch (pickError) {
      console.error("Error in document picker:", pickError);
      Alert.alert("Import Error", "Failed to pick file: " + pickError.message);
      return;
    }

    // Check if operation was canceled (new API)
    if (result.canceled) {
      console.log("User canceled document picking");
      return;
    }

    // Check if operation was successful (old API)
    if (result.type === "cancel") {
      console.log("User canceled document picking (old API)");
      return;
    }

    // Handle both old and new DocumentPicker API formats
    let fileUri;
    let fileName;

    if (result.assets && result.assets.length > 0) {
      // New API format
      fileUri = result.assets[0].uri;
      fileName = result.assets[0].name;
      console.log("Using new DocumentPicker API format");
    } else {
      // Old API format
      fileUri = result.uri;
      fileName = result.name;
      console.log("Using old DocumentPicker API format");
    }

    if (!fileUri) {
      console.error("No valid file URI found");
      Alert.alert("Import Error", "Could not access the selected file");
      return;
    }

    console.log("Selected file:", fileName, "URI:", fileUri);

    try {
      console.log("Reading file from URI:", fileUri);
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      console.log("File content length:", fileContent.length);

      if (!fileContent || fileContent.trim() === "") {
        console.error("File is empty");
        Alert.alert("Import Error", "The selected file is empty");
        return;
      }

      let importedData;
      try {
        importedData = JSON.parse(fileContent);
        console.log("Parsed data items:", importedData?.length || 0);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        Alert.alert("Import Error", "Invalid JSON format in the selected file");
        return;
      }

      if (Array.isArray(importedData)) {
        // Add IDs to imported data if they don't have them
        const dataWithIds = importedData.map((item) => {
          if (!item.id) {
            return { ...item, id: uuid.v4() };
          }
          return item;
        });

        console.log(
          "Showing confirmation dialog for",
          dataWithIds.length,
          "passwords",
        );

        Alert.alert(
          "Import Confirmation",
          `Import ${dataWithIds.length} passwords?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Replace All",
              onPress: async () => {
                try {
                  await storeData("secure_data", dataWithIds);
                  setSecureData(dataWithIds);
                  Alert.alert(
                    "Import Successful",
                    `${dataWithIds.length} passwords imported`,
                  );
                } catch (error) {
                  console.error("Error replacing data:", error);
                  Alert.alert("Import Error", "Failed to import passwords");
                }
              },
            },
            {
              text: "Merge",
              onPress: async () => {
                try {
                  // Create a map of existing IDs to avoid duplicates
                  const existingIds = new Set(
                    secureData.map((item) => item.id),
                  );
                  const newData = [
                    ...secureData,
                    ...dataWithIds.filter((item) => !existingIds.has(item.id)),
                  ];
                  await storeData("secure_data", newData);
                  setSecureData(newData);
                  Alert.alert(
                    "Import Successful",
                    `${newData.length - secureData.length} passwords imported`,
                  );
                } catch (error) {
                  console.error("Error merging data:", error);
                  Alert.alert("Import Error", "Failed to merge passwords");
                }
              },
            },
          ],
        );
      } else {
        console.error("Invalid data format");
        Alert.alert(
          "Import Error",
          "Invalid data format. Expected an array of password items.",
        );
      }
    } catch (readError) {
      console.error("Error reading or processing file:", readError);
      Alert.alert(
        "Import Error",
        "Failed to read the selected file: " + readError.message,
      );
    }
  } catch (error) {
    console.error("Import error:", error);
    Alert.alert("Import Error", "Failed to import passwords: " + error.message);
  }
};
