import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
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

    fetchEntries();
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

  const deleteEntry = async (id) => {
    await axios.delete(`${API_URL}/journal/entries/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setEntries(entries.filter((entry) => entry.id !== id));
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
      <Button title="Add Entry" onPress={() => setModalVisible(true)} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.category}</Text>
              <Text>{item.content}</Text>
              <Text>{new Date(item.date).toLocaleDateString()}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => startEditing(item)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteEntry(item.id)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
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
          <Button
            title={editingEntry ? "Update Entry" : "Add Entry"}
            onPress={editingEntry ? updateEntry : addEntry}
          />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  },
  title: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 8,
    backgroundColor: "lightblue",
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalView: {
    // flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    margin: 20,
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
});

export default JournalScreen;
