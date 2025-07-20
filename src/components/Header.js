import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/GlobalStyles";

const Header = ({ onImportExportPress }) => {
  return (
    <View style={[globalStyles.header, styles.headerContainer]}>
      <View style={styles.titleContainer}>
        <Text style={globalStyles.headerTitle}>Local Pass</Text>
        <Text style={globalStyles.headerSubtitle}>
          Save your password hints locally
        </Text>
      </View>
      <TouchableOpacity
        style={styles.importExportButton}
        onPress={onImportExportPress}
      >
        <Icon name="import-export" size={24} color="#232323" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  importExportButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
