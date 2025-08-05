import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/GlobalStyles";

const PasswordModal = ({
  isVisible,
  setIsVisible,
  onSubmit,
  title,
  message,
  confirmButtonText = "Confirm",
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    onSubmit(password);
    setPassword("");
    setIsVisible(false);
  };

  const handleCancel = () => {
    setPassword("");
    setIsVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      onBackButtonPress={handleCancel}
      style={globalStyles.modal}
      backdropTransitionOutTiming={0}
    >
      <View style={globalStyles.modalContent}>
        <View style={globalStyles.modalHeader}>
          <Text style={globalStyles.modalHeaderText}>{title}</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>

        <Text style={styles.messageText}>{message}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[globalStyles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.saveButton, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text
              style={[globalStyles.saveButtonText, styles.cancelButtonText]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.saveButton, styles.confirmButton]}
            onPress={handleSubmit}
          >
            <Text style={globalStyles.saveButtonText}>{confirmButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  messageText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 5,
    paddingRight: 40,
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
  },
  confirmButton: {
    flex: 1,
  },
};

export default PasswordModal;
