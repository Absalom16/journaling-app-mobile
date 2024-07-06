import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Button, TextInput } from "react-native-paper";

const AuthScreen = ({ navigation }) => {
  const { login, register, user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // Add this line

  const handleAuth = () => {
    setLoading(true); // Set loading to true when authentication starts

    if (isLogin) {
      login(username, password, (response) => {
        setLoading(false); // Set loading to false when authentication ends
        if (response.error) {
          alert(response.error);
        } else {
          navigation.replace("Main");
        }
      });
    } else {
      register(username, password, (response) => {
        setLoading(false); // Set loading to false when authentication ends
        if (response.error) {
          alert(response.error);
        } else {
          setIsLogin(true);
        }
      });
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
        <Button
          icon={loading ? "" : "login"} // Show icon only if not loading
          mode="contained"
          onPress={handleAuth}
          loading={loading} // Show spinner if loading is true
        >
          {isLogin ? "Login" : "Register"}
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => setIsLogin(!isLogin)}>
          {`Switch to ${isLogin ? "Register" : "Login"}`}
        </Button>
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
