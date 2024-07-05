import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const JournalScreen = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await axios.get(
        "http://192.168.100.123:3000/api/journal/entries",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setEntries(response.data);
    };

    fetchEntries();
  }, [user]);

  const addEntry = async () => {
    const newEntry = { title, content, category, date: new Date() };
    const response = await axios.post(
      "http://192.168.100.123:3000/api/journal/entries",
      newEntry,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setEntries([...entries, response.data]);
    setTitle("");
    setContent("");
    setCategory("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <Button title="Add Entry" onPress={addEntry} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.content}</Text>
            <Text>{item.category}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

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
});

export default JournalScreen;
