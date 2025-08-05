import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import uuid from "react-native-uuid";
import { globalStyles } from "../styles/GlobalStyles";
import { Mode } from "../constants/AppConstants";
import { storeData, retrieveData } from "../services/StorageService";
import { exportData } from "../services/ExportService";
import { importData } from "../services/ImportService";

// Components
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PassList from "../components/PassList";
import AddEditModal from "../components/AddEditModal";
import IconPickerModal from "../components/IconPickerModal";
import ImportExportModal from "../components/ImportExportModal";
import PasswordModal from "../components/PasswordModal";

const HomePage = () => {
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const passwordHintInputRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImportExportModalVisible, setImportExportModalVisible] =
    useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordModalType, setPasswordModalType] = useState(""); // "export" or "import"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("lock");
  const [selectedColor, setSelectedColor] = useState("#232323");
  const [isIconPickerVisible, setIconPickerVisible] = useState(false);
  const [secureData, setSecureData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [visibleIds, setVisibleIds] = useState([]);
  const [mode, setMode] = useState(Mode.ADD);
  const [idBeingEdited, setIdBeingEdited] = useState(null);

  useEffect(() => {
    const newFilteredList = [...secureData];
    setFilteredList(newFilteredList);
  }, [secureData]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveData("secure_data");
      if (data !== null) {
        setSecureData(data);
      } else {
        setSecureData([]);
      }
    };

    fetchData();
  }, []);

  const onClickAddEditItem = async () => {
    let id;
    if (mode === Mode.EDIT) {
      id = idBeingEdited;
    } else {
      id = await uuid.v4();
    }

    try {
      const data = {
        title: title,
        description: description,
        passwordHint: passwordHint,
        icon: selectedIcon,
        color: selectedColor,
        id: id,
      };

      if (mode === Mode.EDIT) {
        const updatedData = secureData.map((item) => {
          if (item.id === id) {
            return data;
          }
          return item;
        });

        await storeData("secure_data", updatedData);
        setSecureData(updatedData);
      } else {
        const tempData = [...secureData, data];
        await storeData("secure_data", tempData);
        setSecureData(tempData);
      }

      // clear the fields
      clearFields();
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setPasswordHint("");
    setSelectedIcon("lock");
    setSelectedColor("#232323");
  };

  const onTextFiltered = (str) => {
    if (str.trim() === "") {
      setFilteredList(secureData);
      return;
    }
    const newFilteredList = secureData.filter(
      (item) =>
        item.title.toLowerCase().includes(str.toLowerCase()) ||
        item.description.toLowerCase().includes(str.toLowerCase()),
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

  const deleteItem = (item) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const updatedData = secureData.filter(
                (dataItem) => dataItem.id !== item.id,
              );
              await storeData("secure_data", updatedData);
              setSecureData(updatedData);
              setFilteredList(updatedData);
            } catch (error) {
              console.error("Error deleting data:", error);
            }
          },
        },
      ],
    );
  };

  const editItem = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setPasswordHint(item.passwordHint);
    setSelectedIcon(item.icon);
    setSelectedColor(item.color);
    setIdBeingEdited(item.id);
    setModalVisible(true);
  };

  const handleImport = async () => {
    setPasswordModalType("import");
    setPasswordModalVisible(true);
  };

  const handleExport = async () => {
    setPasswordModalType("export");
    setPasswordModalVisible(true);
  };

  const handlePasswordSubmit = async (password) => {
    if (passwordModalType === "export") {
      await exportData(secureData, password);
    } else if (passwordModalType === "import") {
      await importData(secureData, setSecureData, password);
    }
  };

  useEffect(() => {
    if (isModalVisible && titleInputRef.current) {
      // Use a small delay to ensure the modal is fully rendered
      const timer = global.setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
      return () => global.clearTimeout(timer);
    }
  }, [isModalVisible]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Header onImportExportPress={() => setImportExportModalVisible(true)} />
        <SearchBar onTextFiltered={onTextFiltered} />
        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Saved hints 👇🏾</Text>
        </View>
      </View>

      <PassList
        secureData={secureData}
        filteredList={filteredList}
        visibleIds={visibleIds}
        onClickPreview={onClickPreview}
        deleteItem={deleteItem}
        setMode={setMode}
        editItem={editItem}
      />

      <TouchableOpacity
        style={globalStyles.floatingButton}
        onPress={() => {
          setMode(Mode.ADD);
          setModalVisible(true);
        }}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddEditModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        titleInputRef={titleInputRef}
        descriptionInputRef={descriptionInputRef}
        passwordHintInputRef={passwordHintInputRef}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        passwordHint={passwordHint}
        setPasswordHint={setPasswordHint}
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
        setIconPickerVisible={setIconPickerVisible}
        onClickAddEditItem={onClickAddEditItem}
        clearFields={clearFields}
      />

      <IconPickerModal
        isIconPickerVisible={isIconPickerVisible}
        setIconPickerVisible={setIconPickerVisible}
        selectedColor={selectedColor}
        setSelectedIcon={setSelectedIcon}
        setSelectedColor={setSelectedColor}
      />

      <ImportExportModal
        isVisible={isImportExportModalVisible}
        setIsVisible={setImportExportModalVisible}
        onImport={handleImport}
        onExport={handleExport}
      />

      <PasswordModal
        isVisible={isPasswordModalVisible}
        setIsVisible={setPasswordModalVisible}
        onSubmit={handlePasswordSubmit}
        title={
          passwordModalType === "export"
            ? "Export Passwords"
            : "Import Passwords"
        }
        message={
          passwordModalType === "export"
            ? "Create a password to encrypt your exported data. You'll need this password to import the data later."
            : "Enter the password used when exporting this data."
        }
        confirmButtonText={passwordModalType === "export" ? "Export" : "Import"}
      />
    </SafeAreaView>
  );
};

export default HomePage;
