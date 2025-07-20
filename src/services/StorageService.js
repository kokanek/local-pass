import * as SecureStore from "expo-secure-store";

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
    return true;
  } catch (error) {
    console.error("Error storing data:", error);
    return false;
  }
};

export const retrieveData = async (key) => {
  try {
    const jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
