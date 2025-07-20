import React from "react";
import { View, Text } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { globalStyles } from "../styles/GlobalStyles";
import PassItem from "./PassItem";
import HiddenItemActions from "./HiddenItemActions";

const PassList = ({
  secureData,
  filteredList,
  visibleIds,
  onClickPreview,
  deleteItem,
  setMode,
  editItem,
}) => {
  const renderItem = ({ item }) => (
    <PassItem
      item={item}
      visibleIds={visibleIds}
      onClickPreview={onClickPreview}
    />
  );

  const renderHiddenItem = (data, rowMap) => (
    <HiddenItemActions
      data={data}
      deleteItem={deleteItem}
      setMode={setMode}
      editItem={editItem}
    />
  );

  return (
    <View style={globalStyles.savedPasswordsSection}>
      {secureData?.length > 0 ? (
        <SwipeListView
          data={filteredList}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          disableRightSwipe
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={globalStyles.instructionSubtitle}>
          Add password hints so that they show up here
        </Text>
      )}
    </View>
  );
};

export default PassList;
