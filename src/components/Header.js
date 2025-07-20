import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";

const Header = () => {
  return (
    <View style={globalStyles.header}>
      <Text style={globalStyles.headerTitle}>Local Pass</Text>
      <Text style={globalStyles.headerSubtitle}>
        Save your password hints locally
      </Text>
    </View>
  );
};

export default Header;
