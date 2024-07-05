import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://192.168.100.123:3000/api/auth/login",
        { username, password }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post(
        "http://192.168.100.123:3000/api/auth/register",
        { username, password }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
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
