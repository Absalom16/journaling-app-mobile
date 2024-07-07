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
import styles from "./JournalScreenStyles";
import RNPickerSelect from "react-native-picker-select";

const JournalScreen = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/journal/entries`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEntries(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [user]);

  const addEntry = async () => {
    setButtonLoading(true);
    try {
      const newEntry = { title, content, category, date: new Date() };
      const response = await axios.post(
        `${API_URL}/journal/entries`,
        newEntry,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setEntries([...entries, response.data]);
      setTitle("");
      setContent("");
      setCategory("");
      setModalVisible(false);
    } catch (error) {
      alert(error.response.data.error);
    } finally {
      setButtonLoading(false);
    }
  };

  const updateEntry = async () => {
    setButtonLoading(true);
    const updatedEntry = { ...editingEntry, title, content, category };
    try {
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
      setModalVisible(false);
    } catch (error) {
      alert(error.response.data.error);
    } finally {
      setButtonLoading(false);
    }
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
    setModalVisible(true);
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
                {buttonLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : editingEntry ? (
                  "Update Entry"
                ) : (
                  "Add Entry"
                )}
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

export default JournalScreen;
