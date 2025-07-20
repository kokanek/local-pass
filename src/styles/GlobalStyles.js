import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
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
  instructionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  chartIcon: {
    position: "absolute",
    top: 32,
    right: 20,
  },
  savedPasswordsSection: {
    flex: 1,
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
  hiddenRow: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 15,
    height: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  hiddenButton: {
    width: 75,
    height: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#1E90FFcc",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#FF0000bb",
  },
});
