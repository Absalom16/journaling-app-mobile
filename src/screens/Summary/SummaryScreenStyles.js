import { StyleSheet } from "react-native";

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

export default styles;
