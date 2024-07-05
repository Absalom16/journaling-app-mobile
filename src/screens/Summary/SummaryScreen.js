import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const SummaryScreen = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState();

  const fetchSummary = async (period) => {
    const response = await axios.get(`http://192.168.100.123:3000/api/summary?period=${period}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setSummary(response.data);
  };

  return (
    <View style={styles.container}>
      <Button title="Daily Summary" onPress={() => fetchSummary('daily')} />
      <Button title="Weekly Summary" onPress={() => fetchSummary('weekly')} />
      <Button title="Monthly Summary" onPress={() => fetchSummary('monthly')} />
      {summary && (
        <View>
          <Text>Total Entries: {summary.totalEntries}</Text>
          <Text>Categories: {summary.categories.join(', ')}</Text>
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
});

export default SummaryScreen;
