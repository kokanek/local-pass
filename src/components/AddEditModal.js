import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import { globalStyles } from "../styles/GlobalStyles";

const AddEditModal = ({
  isModalVisible,
  setModalVisible,
  titleInputRef,
  descriptionInputRef,
  passwordHintInputRef,
  title,
  setTitle,
  description,
  setDescription,
  passwordHint,
  setPasswordHint,
  selectedIcon,
  selectedColor,
  setIconPickerVisible,
  onClickAddEditItem,
  clearFields,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onSwipeComplete={() => {
        clearFields();
        setModalVisible(false);
      }}
      swipeDirection={["down"]}
      style={globalStyles.modal}
    >
      <View style={globalStyles.modalContent}>
        <View style={globalStyles.modalHeader}>
          <Text style={globalStyles.modalHeaderText}>Add new hint</Text>
          <TouchableOpacity
            onPress={() => {
              clearFields();
              setModalVisible(false);
            }}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.formContainer}>
          <View style={globalStyles.iconPicker}>
            <TouchableOpacity onPress={() => setIconPickerVisible(true)}>
              <View style={globalStyles.iconWrapper}>
                <Icon name={selectedIcon} size={48} color={selectedColor} />
                <View style={globalStyles.editIconWrapper}>
                  <Icon name="edit" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={globalStyles.inputContainer}>
            <TextInput
              ref={titleInputRef}
              style={globalStyles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              onSubmitEditing={() => descriptionInputRef.current.focus()}
            />
            <TextInput
              ref={descriptionInputRef}
              style={globalStyles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              returnKeyType="next"
              onSubmitEditing={() => passwordHintInputRef.current.focus()}
            />
            <TextInput
              ref={passwordHintInputRef}
              style={globalStyles.input}
              placeholder="Password Hint"
              value={passwordHint}
              onChangeText={setPasswordHint}
              returnKeyType="done"
              onSubmitEditing={() => {
                onClickAddEditItem();
                setModalVisible(false);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={!title || !description || !passwordHint}
          style={[
            globalStyles.saveButton,
            { opacity: !title || !description || !passwordHint ? 0.4 : 1 },
          ]}
          onPress={() => {
            onClickAddEditItem();
            setModalVisible(false);
          }}
        >
          <Text style={globalStyles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddEditModal;
