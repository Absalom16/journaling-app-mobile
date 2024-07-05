import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";
import RNPickerSelect from "react-native-picker-select";

const SummaryScreen = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null); // New state for period

  // Fetch summary data based on the selected period
  const fetchSummary = async (period) => {
    const response = await axios.get(`${API_URL}/summary?period=${period}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setSummary(response.data);
  };

  // Fetch entries based on the selected category
  const fetchEntriesByCategory = async (category) => {
    const response = await axios.get(
      `${API_URL}/journal/entries?category=${category}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    setFilteredEntries(response.data);
  };

  // Handle period change and fetch summary
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchSummary(period); // Fetch the summary for the selected period
  };

  // Handle category change and fetch entries
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredEntries([]);
    if (category) {
      fetchEntriesByCategory(category);
    }
  };

  // Populate period options for the dropdown
  const periodItems = [
    { label: "Daily Summary", value: "daily" },
    { label: "Weekly Summary", value: "weekly" },
    { label: "Monthly Summary", value: "monthly" },
  ];

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={handlePeriodChange}
        items={periodItems}
        placeholder={{ label: "Select a period", value: null }}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
        }}
      />
      {summary && (
        <View>
          <RNPickerSelect
            onValueChange={handleCategoryChange}
            items={summary.categories.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder={{ label: "Select a category", value: null }}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
            }}
          />
        </View>
      )}
      {filteredEntries.length > 0 && (
        <View style={styles.filteredEntriesContainer}>
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.entry}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.content}</Text>
                <Text>{item.category}</Text>
                <Text>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pickerInput: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    marginVertical: 5,
  },
  filteredEntriesContainer: {
    flex: 1,
    marginTop: 20,
  },
  entry: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  title: {
    fontWeight: "bold",
  },
});

export default SummaryScreen;
