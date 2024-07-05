import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";

const AuthScreen = ({ navigation }) => {
  const { login, register, user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    if (isLogin) {
      login(username, password);
    } else {
      register(username, password);
    }
    navigation.replace("Main");
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
      <Button title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
      <Button
        title={`Switch to ${isLogin ? "Register" : "Login"}`}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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

export default AuthScreen;
