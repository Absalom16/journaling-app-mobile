import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Menu, Button, ActivityIndicator, Provider } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";

const SummaryScreen = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const [loading, setLoading] = useState(false); // Loading state

  const fetchSummary = async (period) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${API_URL}/summary?period=${period}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchEntriesByCategory = async (category) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${API_URL}/journal/entries?category=${category}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setFilteredEntries(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period.label);
    fetchSummary(period.value);
    setPeriodMenuVisible(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredEntries([]);
    if (category) {
      fetchEntriesByCategory(category);
    }
    setCategoryMenuVisible(false);
  };

  const periodItems = [
    { label: "Daily Summary", value: "daily" },
    { label: "Weekly Summary", value: "weekly" },
    { label: "Monthly Summary", value: "monthly" },
  ];

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Menu
            visible={periodMenuVisible}
            onDismiss={() => setPeriodMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPeriodMenuVisible(true)}
              >
                {selectedPeriod ? selectedPeriod : "Select a period"}
              </Button>
            }
          >
            {periodItems.map((item) => (
              <Menu.Item
                key={item.value}
                onPress={() => handlePeriodChange(item)}
                title={item.label}
              />
            ))}
          </Menu>
          {summary && (
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCategoryMenuVisible(true)}
                >
                  {selectedCategory ? selectedCategory : "Select a category"}
                </Button>
              }
            >
              {summary.categories.map((category) => (
                <Menu.Item
                  key={category}
                  onPress={() => handleCategoryChange(category)}
                  title={category}
                />
              ))}
            </Menu>
          )}
        </View>
        {loading ? (
          <ActivityIndicator animating={true} size="large" color="#6200ee" />
        ) : (
          filteredEntries.length > 0 && (
            <View style={styles.filteredEntriesContainer}>
              <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.category}>{item.category}</Text>
                    </View>
                    <Text style={styles.content}>{item.content}</Text>
                    <Text style={styles.date}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              />
            </View>
          )
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filteredEntriesContainer: {
    flex: 1,
    marginTop: 20,
  },
  entry: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  category: {
    fontStyle: "italic",
    fontSize: 14,
    color: "gray",
  },
  content: {
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 6,
  },
});

export default SummaryScreen;
