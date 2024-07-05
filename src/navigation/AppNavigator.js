import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import AuthScreen from "../screens/Auth/AuthScreen";
import JournalScreen from "../screens/Journal/JournalScreen";
import SummaryScreen from "../screens/Summary/SummaryScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Journal") {
            iconName = focused ? "journal" : "journal-outline";
          } else if (route.name === "Summary") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 10, // Adjust the font size for the tab bar labels
          fontWeight: "bold", // Make the tab bar labels bold
        },
        tabBarItemStyle: {
          justifyContent: "center", // Center the tab bar items
        },
        tabBarStyle: {
          paddingTop: 10, // Optional: adjust padding for the tab bar
        },
      })}
    >
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Summary" component={SummaryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerTitle: "DailyDiary", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerTitle: "DailyDiary", headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
