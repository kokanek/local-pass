import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';

const icons = ['account-balance', 'mail', 'event', 'access-time', 'local-grocery-store', 'restaurant'];
const colors = ['#DB4437', '#1DA1F2', '#00C805', '#FFCA28'];

const HomePage = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('lock');
  const [selectedColor, setSelectedColor] = useState('#4CAF50');
  const [isIconPickerVisible, setIconPickerVisible] = useState(false);
  const [secureData, setSecureData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const newFilteredList = [...secureData];
    setFilteredList(newFilteredList);
  }, [secureData])

  useEffect(() => {
    const retrieveData = async () => {
      try {
        let jsonValue = await SecureStore.getItemAsync('secure_data');
        jsonValue = jsonValue != undefined || null ? JSON.parse(jsonValue) : [];
        console.log('storing jsonvalue: ', jsonValue);
        setSecureData(jsonValue);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    retrieveData();
  }, [])

  const storeData = async () => {
    console.log('reached here')
    console.log('secure data in function: ', secureData);

    try {
      const data = {
        title: title,
        description: description,
        passwordHint: passwordHint,
        icon: selectedIcon,
        color: selectedColor,
      };

      console.log('secureData: ', secureData);
      const tempData = [...secureData, data];
      console.log('secureData: ', tempData);
      const jsonValue = JSON.stringify(tempData);
      console.log('stroring value: ', jsonValue);
      await SecureStore.setItemAsync('secure_data', jsonValue);
      setSecureData(tempData);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const onTextFiltered = (str) => {
    if (str.trim() == '') {
      setFilteredList(secureData)
      return;
    }
    const newFilteredList = filteredList.filter(item => item.title.toLowerCase().includes(str.toLowerCase()) || item.description.toLowerCase().includes(str.toLowercase))
    setFilteredList(newFilteredList)
  }

  console.log('secure data in render: ', secureData);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hello, User</Text>
          <Text style={styles.headerSubtitle}>Save your password easily and securely</Text>
          <Icon name="bar-chart" size={24} color="#000" style={styles.chartIcon} />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            onChangeText={(str) => onTextFiltered(str)}
          />
        </View>

        <View style={styles.savedPasswordsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved password</Text>
            <Text style={styles.sectionSubtitle}>Latest save ▼</Text>
          </View>
          {filteredList.map((item) => (
            <View style={styles.passwordItem} key={item.title + item.description}>
              <Icon name={item.icon} size={24} color={item.color} style={styles.appIcon} />
              <View style={styles.passwordDetails}>
                <Text style={styles.passwordTitle}>{item.title}</Text>
                <Text style={styles.passwordEmail}>{item.description}</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#000" style={styles.arrowIcon} />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={['down']}
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
                <Icon name={selectedIcon} size={48} color={selectedColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Password Hint"
                value={passwordHint}
                onChangeText={setPasswordHint}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={() => {
            storeData();
            setModalVisible(false);
          }}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  chartIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  newPasswordCard: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  newPasswordTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  newPasswordSubtitle: {
    color: '#fff',
    fontSize: 14,
  },
  addNewButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  addNewButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '48%',
  },
  statIcon: {
    backgroundColor: '#9C27B0',
    padding: 5,
    borderRadius: 5,
  },
  statTitle: {
    fontSize: 14,
    marginTop: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  savedPasswordsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  passwordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  appIcon: {
    marginRight: 15,
  },
  passwordDetails: {
    flex: 1,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordEmail: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconPicker: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconPickerModal: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
  },
  iconPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconItem: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdfdfd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default HomePage;