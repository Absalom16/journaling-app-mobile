import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
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
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={updateProfile}
          // style={styles.button}
          labelStyle={styles.buttonText}
        >
          Update Profile
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor="red"
          // style={[styles.button, styles.logoutButton]}
          labelStyle={styles.buttonText}
        >
          Logout
        </Button>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
  },
});

export default SettingsScreen;
