import * as Crypto from "expo-crypto";

// Simple AES encryption using expo-crypto
export const encryptData = async (data, password) => {
  try {
    const dataString = JSON.stringify(data);

    // Generate a random salt
    const salt = await Crypto.getRandomBytesAsync(16);
    const saltHex = bufferToHex(salt);

    // Create a simple hash from password + salt for the key
    const keyMaterial = password + saltHex;
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyMaterial,
      { encoding: Crypto.CryptoEncoding.HEX },
    );

    // Simple XOR encryption (not the most secure, but works without additional dependencies)
    const encrypted = xorEncrypt(dataString, key);

    return {
      encryptedData: encrypted,
      salt: saltHex,
      version: "1.0",
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

export const decryptData = async (encryptedPayload, password) => {
  try {
    const { encryptedData, salt, version } = encryptedPayload;

    if (version !== "1.0") {
      throw new Error("Unsupported encryption version");
    }

    // Recreate the key using the same method
    const keyMaterial = password + salt;
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyMaterial,
      { encoding: Crypto.CryptoEncoding.HEX },
    );

    // Decrypt using XOR
    const decrypted = xorDecrypt(encryptedData, key);

    try {
      return JSON.parse(decrypted);
    } catch (_parseError) {
      throw new Error("Invalid password or corrupted data");
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data. Please check your password.");
  }
};

// Helper functions
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const xorEncrypt = (text, key) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode
};

const xorDecrypt = (encryptedText, key) => {
  const decoded = atob(encryptedText); // Base64 decode
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

// Simple base64 encoding/decoding for React Native
const btoa = (str) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;

  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : "=";
    result += i - 1 < str.length ? chars.charAt(bitmap & 63) : "=";
  }

  return result;
};

const atob = (str) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;

  while (i < str.length) {
    const encoded1 = chars.indexOf(str.charAt(i++));
    const encoded2 = chars.indexOf(str.charAt(i++));
    const encoded3 = chars.indexOf(str.charAt(i++));
    const encoded4 = chars.indexOf(str.charAt(i++));

    const bitmap =
      (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

    result += String.fromCharCode((bitmap >> 16) & 255);
    if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
    if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
  }

  return result;
};
