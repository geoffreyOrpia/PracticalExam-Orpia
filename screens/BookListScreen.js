import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BookCard from "../components/BookCard";

const STORAGE_KEY = "@ExamApp:books";

export default function BookListScreen({ navigation, books, setBooks }) {
  const [fact, setFact] = useState("");
  const [factLoading, setFactLoading] = useState(true);
  const [factError, setFactError] = useState("");

  const [storageLoading, setStorageLoading] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  // Queue writes so rapid changes are saved in the correct order.
  const saveQueue = useRef(Promise.resolve());

  // Load saved books once when this screen mounts.
  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        const savedBooks = await AsyncStorage.getItem(STORAGE_KEY);

        if (!active) return;

        if (savedBooks !== null) {
          const parsedBooks = JSON.parse(savedBooks);

          const isValid =
            Array.isArray(parsedBooks) &&
            parsedBooks.every(
              (book) =>
                book !== null &&
                typeof book === "object" &&
                typeof book.id === "string" &&
                typeof book.title === "string" &&
                typeof book.author === "string" &&
                typeof book.read === "boolean",
            );

          if (!isValid) {
            throw new Error("Invalid saved book data");
          }

          setBooks(parsedBooks);
        }

        setStorageReady(true);
      } catch (error) {
        if (active) {
          setStorageError(
            "Could not load saved books. Changes will not be saved this session.",
          );
        }
      } finally {
        if (active) {
          setStorageLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, [setBooks]);

  // Save only after loading finishes successfully.
  // This prevents the default books from overwriting saved books on startup.
  useEffect(() => {
    if (!storageReady) return;

    const serializedBooks = JSON.stringify(books);

    saveQueue.current = saveQueue.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serializedBooks))
      .then(() => {
        setStorageError("");
      })
      .catch(() => {
        setStorageError("Could not save the latest changes on this device.");
      });
  }, [books, storageReady]);

  // Fetch a fun fact from a public API.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchFact() {
      try {
        const response = await fetch(
          "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();

        if (typeof data.text !== "string" || !data.text.trim()) {
          throw new Error("No fact returned");
        }

        if (active) {
          setFact(data.text);
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setFactError("Could not load a fun fact. Check your connection.");
        }
      } finally {
        if (active) {
          setFactLoading(false);
        }
      }
    }

    fetchFact();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  function toggleRead(id) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id ? { ...book, read: !book.read } : book,
      ),
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Add Book"
        onPress={() => navigation.navigate("AddBook")}
        disabled={storageLoading}
      />

      <View style={styles.factBox}>
        <Text style={styles.factHeading}>Did you know?</Text>

        <Text style={styles.factText}>
          {factLoading ? "Loading a fun fact..." : factError || fact}
        </Text>
      </View>

      {storageError ? <Text style={styles.error}>{storageError}</Text> : null}

      {storageLoading ? (
        <Text style={styles.loading}>Loading saved books...</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              author={item.author}
              read={item.read}
              onToggleRead={() => toggleRead(item.id)}
            />
          )}
          ListHeaderComponent={
            <Text style={styles.count}>
              {books.length} {books.length === 1 ? "book" : "books"} saved
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No books saved yet. Tap "Add Book" to get started.
            </Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f6fa",
  },
  factBox: {
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#e0edff",
    borderRadius: 10,
  },
  factHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 6,
  },
  factText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#243b64",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#526174",
    fontSize: 16,
  },
  loading: {
    textAlign: "center",
    marginTop: 24,
    color: "#526174",
  },
  error: {
    color: "#b91c1c",
    marginBottom: 12,
  },
});
