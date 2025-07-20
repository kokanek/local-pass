import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import { globalStyles } from "../styles/GlobalStyles";
import { icons, colors } from "../constants/AppConstants";

const IconPickerModal = ({
  isIconPickerVisible,
  setIconPickerVisible,
  selectedColor,
  setSelectedIcon,
  setSelectedColor,
}) => {
  return (
    <Modal
      isVisible={isIconPickerVisible}
      onBackdropPress={() => setIconPickerVisible(false)}
      style={globalStyles.modal}
    >
      <View style={globalStyles.iconPickerModal}>
        <Text style={globalStyles.iconPickerTitle}>Choose an Icon</Text>
        <View style={globalStyles.iconGrid}>
          {icons.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={globalStyles.iconItem}
              onPress={() => {
                setSelectedIcon(icon);
                setIconPickerVisible(false);
              }}
            >
              <Icon name={icon} size={40} color={selectedColor} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={globalStyles.iconPickerTitle}>Choose a Color</Text>
        <View style={globalStyles.colorPicker}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[globalStyles.colorItem, { backgroundColor: color }]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default IconPickerModal;
