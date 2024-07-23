import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicon from "react-native-vector-icons/Octicons";
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import uuid from "react-native-uuid";

const icons = [
  "lock",
  "cloud",
  "account-balance",
  "mail",
  "event",
  "credit-card",
  "local-grocery-store",
  "restaurant",
];
const colors = ["#232323", "#4CC27E", "#6654C3", "#46B4CD", "#D0314F"];

const HomePage = () => {
  const titleInputRef = React.useRef(null);
  const descriptionInputRef = React.useRef(null);
  const passwordHintInputRef = React.useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("lock");
  const [selectedColor, setSelectedColor] = useState("#232323");
  const [isIconPickerVisible, setIconPickerVisible] = useState(false);
  const [secureData, setSecureData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [visibleIds, setVisibleIds] = useState([]);

  useEffect(() => {
    const newFilteredList = [...secureData];
    setFilteredList(newFilteredList);
  }, [secureData]);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        let jsonValue = await SecureStore.getItemAsync("secure_data");
        jsonValue =
          jsonValue !== undefined || null ? JSON.parse(jsonValue) : [];
        setSecureData(jsonValue);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    retrieveData();
  }, []);

  const storeData = async () => {
    const id = await uuid.v4();

    try {
      const data = {
        title: title,
        description: description,
        passwordHint: passwordHint,
        icon: selectedIcon,
        color: selectedColor,
        id: id,
      };

      const tempData = [...secureData, data];
      const jsonValue = JSON.stringify(tempData);
      await SecureStore.setItemAsync("secure_data", jsonValue);
      setSecureData(tempData);

      // clear the fields
      setTitle("");
      setDescription("");
      setPasswordHint("");
      setSelectedIcon("lock");
      setSelectedColor("#232323");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const onTextFiltered = (str) => {
    if (str.trim() == "") {
      setFilteredList(secureData);
      return;
    }
    const newFilteredList = filteredList.filter(
      (item) =>
        item.title.toLowerCase().includes(str.toLowerCase()) ||
        item.description.toLowerCase().includes(str.toLowercase),
    );
    setFilteredList(newFilteredList);
  };

  const onClickPreview = (item) => {
    const newVisibleIds = [...visibleIds];
    if (visibleIds.includes(item.id)) {
      const index = visibleIds.indexOf(item.id);
      newVisibleIds.splice(index, 1);
    } else {
      newVisibleIds.push(item.id);
    }

    setVisibleIds(newVisibleIds);
  };

  useEffect(() => {
    if (isModalVisible && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
    }
  }, [isModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Local Pass</Text>
          <Text style={styles.headerSubtitle}>
            Save your password hints locally
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            onChangeText={(str) => onTextFiltered(str)}
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved hints 👇🏾</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.savedPasswordsSection}>
          {filteredList.map((item) => {
            const dynamicStyles = StyleSheet.create({
              passwordDisplay: {
                backgroundColor: item.color,
                padding: 12,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: "center",
                width: "100%",
              },
            });

            return (
              <View
                key={item.title + item.description}
                style={styles.passwordItem}
              >
                <View style={styles.passwordRow}>
                  <Icon
                    name={item.icon}
                    size={32}
                    color={item.color}
                    style={styles.appIcon}
                  />
                  <View style={styles.passwordDetails}>
                    <Text style={styles.passwordTitle}>{item.title}</Text>
                    <Text style={styles.passwordEmail}>{item.description}</Text>
                  </View>
                  {visibleIds.includes(item.id) && (
                    <View>
                      <TouchableOpacity onPress={() => onClickPreview(item)}>
                        <Icon name="delete" size={24} color="#000" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onClickPreview(item)}>
                        <Icon name="edit" size={24} color="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => onClickPreview(item)}>
                    <Octicon
                      name={visibleIds.includes(item.id) ? "eye" : "eye-closed"}
                      size={32}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
                {visibleIds.includes(item.id) && (
                  <View style={dynamicStyles.passwordDisplay}>
                    <Text style={styles.passwordHint}>{item.passwordHint}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Add New Password</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.iconPicker}>
              <TouchableOpacity onPress={() => setIconPickerVisible(true)}>
                <View style={styles.iconWrapper}>
                  <Icon name={selectedIcon} size={48} color={selectedColor} />
                  <View style={styles.editIconWrapper}>
                    <Icon name="edit" size={16} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={titleInputRef}
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
                onSubmitEditing={() => descriptionInputRef.current.focus()}
              />
              <TextInput
                ref={descriptionInputRef}
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                returnKeyType="next"
                onSubmitEditing={() => passwordHintInputRef.current.focus()}
              />
              <TextInput
                ref={passwordHintInputRef}
                style={styles.input}
                placeholder="Password Hint"
                value={passwordHint}
                onChangeText={setPasswordHint}
                returnKeyType="done"
                onSubmitEditing={() => {
                  storeData();
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              storeData();
              setModalVisible(false);
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isIconPickerVisible}
        onBackdropPress={() => setIconPickerVisible(false)}
        style={styles.modal}
      >
        <View style={styles.iconPickerModal}>
          <Text style={styles.iconPickerTitle}>Choose an Icon</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconItem}
                onPress={() => {
                  setSelectedIcon(icon);
                  setIconPickerVisible(false);
                }}
              >
                <Icon name={icon} size={40} color={selectedColor} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.iconPickerTitle}>Choose a Color</Text>
          <View style={styles.colorPicker}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorItem, { backgroundColor: color }]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  chartIcon: {
    position: "absolute",
    top: 32,
    right: 20,
  },
  savedPasswordsSection: {
    padding: 20,
  },
  sectionHeader: {
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  passwordItem: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  //const colors = ["#4CC27E", "#6654C3", "#46B4CD", "#D0314F"];
  passwordDisplay: {
    padding: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  passwordHint: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  appIcon: {
    marginRight: 15,
  },
  passwordDetails: {
    flex: 1,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordEmail: {
    fontSize: 14,
    color: "#666",
  },
  floatingButton: {
    position: "absolute",
    right: 32,
    bottom: 32,
    backgroundColor: "#232323",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  iconPicker: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: "#232323",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconPickerModal: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
  },
  iconPickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconItem: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  iconWrapper: {
    position: "relative",
    width: 48,
    height: 48,
  },
  editIconWrapper: {
    position: "absolute",
    right: -5,
    bottom: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    padding: 2,
  },
});

export default HomePage;
