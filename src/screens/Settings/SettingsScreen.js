import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const updateProfile = async () => {
    await axios.put(
      "http://192.168.100.123:3000/api/profile",
      { username, password },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    alert("Profile updated!");
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
      <Button title="Update Profile" onPress={updateProfile} />
      <Button title="Logout" onPress={handleLogout} />
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
});

export default SettingsScreen;
