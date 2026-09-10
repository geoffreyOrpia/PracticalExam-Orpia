// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// replace for this:
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BookListScreen from "./screens/BookListScreen";
import AddBookScreen from "./screens/AddBookScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [books, setBooks] = useState([
    {
      id: "1",
      title: "Noli Me Tangere",
      author: "Jose Rizal",
      read: true,
    },
    {
      id: "2",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      read: false,
    },
  ]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BookList">
        <Stack.Screen name="BookList" options={{ title: "My Reading Log" }}>
          {(props) => (
            <BookListScreen {...props} books={books} setBooks={setBooks} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddBook" options={{ title: "Add Book" }}>
          {(props) => (
            <AddBookScreen {...props} books={books} setBooks={setBooks} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
