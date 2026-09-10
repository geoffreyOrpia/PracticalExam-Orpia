import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function AddBookScreen({ navigation, setBooks }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    const cleanedTitle = title.trim();
    const cleanedAuthor = author.trim();

    if (!cleanedTitle || !cleanedAuthor) {
      setError("Please enter both the book title and author.");
      return;
    }

    const newBook = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title: cleanedTitle,
      author: cleanedAuthor,
      read: false,
    };

    setBooks((currentBooks) => [...currentBooks, newBook]);

    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Add to your reading log</Text>

        <Text style={styles.label}>Book title</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: The Little Prince"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setError("");
          }}
          autoCapitalize="words"
          accessibilityLabel="Book title"
        />

        <Text style={styles.label}>Author</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Antoine de Saint-Exupéry"
          value={author}
          onChangeText={(text) => {
            setAuthor(text);
            setError("");
          }}
          autoCapitalize="words"
          accessibilityLabel="Author"
        />

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        <View style={styles.button}>
          <Button title="Save Book" onPress={handleSave} />
        </View>

        <Button
          title="Cancel"
          color="#64748b"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  form: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#172033",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    color: "#172033",
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
});
