import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { storeData } from "./StorageService";

export const importData = async (secureData, setSecureData) => {
  try {
    console.log("Starting import process");
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true, // Important for accessing the file
    });

    console.log("Document picker result:", result.type);
    if (result.type === "success") {
      try {
        console.log("Reading file from URI:", result.uri);
        const fileContent = await FileSystem.readAsStringAsync(result.uri);
        console.log("File content length:", fileContent.length);
        const importedData = JSON.parse(fileContent);
        console.log("Parsed data items:", importedData?.length || 0);

        if (Array.isArray(importedData)) {
          // Add IDs to imported data if they don't have them
          const dataWithIds = importedData.map((item) => {
            if (!item.id) {
              return { ...item, id: uuid.v4() };
            }
            return item;
          });

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
                      ...dataWithIds.filter(
                        (item) => !existingIds.has(item.id),
                      ),
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
          Alert.alert(
            "Import Error",
            "Invalid data format. Expected an array of password items.",
          );
        }
      } catch (error) {
        console.error("Error reading file:", error);
        Alert.alert("Import Error", "Failed to read the selected file");
      }
    }
  } catch (error) {
    console.error("Import error:", error);
    Alert.alert("Import Error", "Failed to import passwords");
  }
};
