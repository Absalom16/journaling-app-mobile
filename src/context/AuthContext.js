import React, { createContext, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password, callback) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      if (response.data.user) {
        setUser(response.data); // Update user context
        callback({}); // Call callback with no error
      } else {
        callback({ error: "Unexpected error during login." });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        callback({ error: error.response.data.error });
      } else {
        callback({ error: "Unexpected error during login." });
      }
    }
  };

  const register = async (username, password, callback) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });

      console.log(response.data)

      if (response.data) {
        // setUser(response.data); // Update user context
        callback({}); // Call callback with no error
      } else {
        callback({ error: "Unexpected error during registration." });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        callback({ error: error.response.data.error });
      } else {
        callback({ error: "Unexpected error during registration." });
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
