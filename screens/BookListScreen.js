import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookCard from "../components/BookCard";

const STORAGE_KEY = "@reading_log_books";

export default function BookListScreen({ navigation, books, setBooks }) {
  const [loaded, setLoaded] = useState(false);
  const [fact, setFact] = useState("");
  const [factLoading, setFactLoading] = useState(true);

  // ---- TASK 4: Load saved books on mount ----
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null) {
          setBooks(JSON.parse(json));
        }
      } catch (e) {
        console.log("Failed to load books:", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ---- TASK 4: Save books whenever they change (after initial load) ----
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch((e) =>
      console.log("Failed to save books:", e),
    );
  }, [books, loaded]);

  // ---- TASK 5: Fetch a fun fact from a public API ----
  useEffect(() => {
    fetch("https://uselessfacts.jsph.pl/api/v2/facts/random")
      .then((res) => res.json())
      .then((data) => setFact(data.text))
      .catch(() => setFact("Could not load a fun fact right now."))
      .finally(() => setFactLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Task 5: fun fact display */}
      <View style={styles.factBox}>
        {factLoading ? (
          <Text style={styles.factText}>Loading fun fact...</Text>
        ) : (
          <Text style={styles.factText}>💡 {fact}</Text>
        )}
      </View>

      {/* Task 6: polished button with icon instead of plain Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddBook")}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Book</Text>
      </TouchableOpacity>

      {/* Task 2: FlatList rendering */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard title={item.title} author={item.author} read={item.read} />
        )}
        ListHeaderComponent={
          <Text style={styles.headerText}>
            {books.length} {books.length === 1 ? "book" : "books"} saved
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No books yet. Add one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  factBox: {
    backgroundColor: "#fff8e1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  factText: {
    fontSize: 13,
    color: "#5d4037",
    fontStyle: "italic",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
  },
});
