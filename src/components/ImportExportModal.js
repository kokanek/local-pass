import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/GlobalStyles";

const ImportExportModal = ({ isVisible, setIsVisible, onImport, onExport }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      style={globalStyles.modal}
      backdropTransitionOutTiming={0}
    >
      <View style={globalStyles.modalContent}>
        <View style={globalStyles.modalHeader}>
          <Text style={globalStyles.modalHeaderText}>Import/Export</Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            onImport();
            setIsVisible(false);
          }}
        >
          <Icon
            name="upload"
            size={24}
            color="#232323"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Import passwords</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            onExport();
            setIsVisible(false);
          }}
        >
          <Icon
            name="download"
            size={24}
            color="#232323"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Export passwords</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ImportExportModal;
