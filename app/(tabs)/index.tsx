import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect, useRouter } from "expo-router";

const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  // Function to load notes from storage
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      setNotes(storedNotes ? JSON.parse(storedNotes) : []);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  // Load notes when screen mounts
  useEffect(() => {
    loadNotes();
  }, []);

  // Reload notes when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  // Function to truncate content to first 8 words
  const truncateContent = (content) => {
    const words = content.split(" ");
    return words.length > 8 ? words.slice(0, 8).join(" ") + "..." : content;
  };

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No notes yet. Add one!</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.noteCard}
              onPress={() => router.push({ pathname: "/notedetail", params: { id: item.id, title: item.title, content: item.content } })}
            >
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{truncateContent(item.content)}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Link href="/addnote" style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#6b7280",
    marginTop: 50,
  },
  noteCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContent: {
    color: "#4b5563",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
