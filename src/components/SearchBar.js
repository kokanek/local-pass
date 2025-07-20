import React from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/GlobalStyles";

const SearchBar = ({ onTextFiltered }) => {
  return (
    <View style={globalStyles.searchContainer}>
      <Icon
        name="search"
        size={20}
        color="#888"
        style={globalStyles.searchIcon}
      />
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search"
        placeholderTextColor="#888"
        onChangeText={(str) => onTextFiltered(str)}
      />
    </View>
  );
};

export default SearchBar;
