import { View, Text, Button, StyleSheet } from "react-native";

export default function BookCard({ title, author, read, onToggleRead }) {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>by {author}</Text>

        <Text style={[styles.status, read && styles.readStatus]}>
          {read ? "Read" : "Unread"}
        </Text>
      </View>

      <Button
        title={read ? "Mark as unread" : "Mark as read"}
        onPress={onToggleRead}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe2ea",
  },
  details: {
    flexDirection: "column",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172033",
  },
  author: {
    fontSize: 15,
    color: "#526174",
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400e",
    marginTop: 10,
  },
  readStatus: {
    color: "#166534",
  },
});
