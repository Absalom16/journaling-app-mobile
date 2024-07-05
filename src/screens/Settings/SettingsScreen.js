import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const updateProfile = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        { username, password },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      console.log(response.data);

      alert("Profile updated!");
    } catch (error) {
      console.log(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      }
    }
  };

  const handleLogout = () => {
    navigation.navigate("Auth");
    logout();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  updateButton: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,  // Added margin to separate buttons
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,  // Added margin to separate buttons
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingsScreen;
