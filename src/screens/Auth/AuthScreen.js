import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";

const AuthScreen = ({ navigation }) => {
  const { login, register, user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    if (isLogin) {
      login(username, password, (response) => {
        if (response.error) {
          alert(response.error);
        }
      });
      if (user) {
        navigation.replace("Main");
      }
    } else {
      register(username, password, (response) => {
        if (response.error) {
          alert(response.error);
        }
      });
      setIsLogin(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
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
        <Button title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={`Switch to ${isLogin ? "Register" : "Login"}`}
          onPress={() => setIsLogin(!isLogin)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default AuthScreen;
