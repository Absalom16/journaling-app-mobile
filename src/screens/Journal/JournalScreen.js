import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  Button,
  TextInput,
  IconButton,
  Dialog,
  Portal,
} from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";
import RNPickerSelect from "react-native-picker-select";

const JournalScreen = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true); // Show the spinner
      try {
        const response = await axios.get(`${API_URL}/journal/entries`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEntries(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Hide the spinner
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [user]);

  const addEntry = async () => {
    const newEntry = { title, content, category, date: new Date() };
    const response = await axios.post(`${API_URL}/journal/entries`, newEntry, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setEntries([...entries, response.data]);
    setTitle("");
    setContent("");
    setCategory("");
    setModalVisible(false); // Hide the modal
  };

  const updateEntry = async () => {
    const updatedEntry = { ...editingEntry, title, content, category };
    const response = await axios.put(
      `${API_URL}/journal/entries/${editingEntry.id}`,
      updatedEntry,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setEntries(
      entries.map((entry) =>
        entry.id === editingEntry.id ? response.data : entry
      )
    );
    setEditingEntry(null);
    setTitle("");
    setContent("");
    setCategory("");
    setModalVisible(false); // Hide the modal
  };

  const confirmDeleteEntry = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (entryToDelete) {
      await axios.delete(`${API_URL}/journal/entries/${entryToDelete.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEntries(entries.filter((entry) => entry.id !== entryToDelete.id));
      setEntryToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const startEditing = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setCategory(entry.category);
    setModalVisible(true); // Show the modal
  };

  const categoryItems = [
    { label: "Work", value: "Work" },
    { label: "Personal", value: "Personal" },
    { label: "Fitness", value: "Fitness" },
    { label: "Finance", value: "Finance" },
    // Add more categories as needed
  ];

  return (
    <View style={styles.container}>
      <Button
        icon="book"
        mode="contained"
        onPress={() => {
          setModalVisible(true);
          setEditingEntry(null);
        }}
      >
        Add Entry
      </Button>
      {loading ? (
        <ActivityIndicator size="large" color="indigo" />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <View style={styles.iconContainer}>
                <IconButton
                  icon="pencil"
                  iconColor="indigo"
                  mode="contained-tonal"
                  size={15}
                  onPress={() => startEditing(item)}
                />
                <IconButton
                  icon="delete"
                  iconColor="red"
                  mode="contained-tonal"
                  size={15}
                  onPress={() => confirmDeleteEntry(item)}
                />
              </View>
            </View>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <RNPickerSelect
              onValueChange={setCategory}
              items={categoryItems}
              value={category}
              style={pickerSelectStyles}
              placeholder={{ label: "Select a category", value: null }}
            />
            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              style={styles.input}
            />

            <View style={styles.modalButtonContainer}>
              <Button
                icon="pen"
                mode="contained"
                onPress={editingEntry ? updateEntry : addEntry}
                style={styles.modalButton}
              >
                {editingEntry ? "Update Entry" : "Add Entry"}
              </Button>
              <Button
                icon="close"
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
                color="gray"
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this entry?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDelete} color="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  inputAndroid: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  entry: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: "white",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  category: {
    fontStyle: "italic",
    fontSize: 14,
    color: "gray",
  },
  content: {
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 6,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default JournalScreen;
