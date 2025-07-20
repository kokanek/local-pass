import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/GlobalStyles";
import { Mode } from "../constants/AppConstants";

const HiddenItemActions = ({ data, deleteItem, setMode, editItem }) => {
  return (
    <View style={globalStyles.hiddenRow} key={data.item.id}>
      <TouchableOpacity
        style={[globalStyles.hiddenButton, globalStyles.deleteButton]}
        onPress={() => deleteItem(data.item)}
      >
        <Icon name="delete" size={48} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.hiddenButton, globalStyles.editButton]}
        onPress={() => {
          setMode(Mode.EDIT);
          editItem(data.item);
        }}
      >
        <Icon name="edit" size={48} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HiddenItemActions;
