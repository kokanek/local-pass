import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicon from "react-native-vector-icons/Octicons";
import { globalStyles } from "../styles/GlobalStyles";

const PassItem = ({ item, visibleIds, onClickPreview }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onClickPreview(item)}
      style={globalStyles.passwordItem}
      key={item.id}
    >
      <View style={globalStyles.passwordRow}>
        <Icon
          name={item.icon}
          size={32}
          color={item.color}
          style={globalStyles.appIcon}
        />
        <View style={globalStyles.passwordDetails}>
          <Text style={globalStyles.passwordTitle}>{item.title}</Text>
          <Text style={globalStyles.passwordEmail}>{item.description}</Text>
        </View>
        <Octicon
          name={visibleIds.includes(item.id) ? "eye" : "eye-closed"}
          size={32}
          color="#000"
        />
      </View>
      {visibleIds.includes(item.id) && (
        <View
          style={[
            globalStyles.passwordDisplay,
            { backgroundColor: item.color },
          ]}
        >
          <Text style={globalStyles.passwordHint}>{item.passwordHint}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PassItem;
