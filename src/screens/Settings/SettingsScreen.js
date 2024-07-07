import React, { useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";
import styles from "./SettingsScreenStyles";

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const updateProfile = async () => {
    setButtonLoading(true);
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
    } finally {
      setButtonLoading(false);
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
          labelStyle={styles.buttonText}
        >
          {buttonLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            "Update Profile"
          )}
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor="red"
          labelStyle={styles.buttonText}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};



export default SettingsScreen;
