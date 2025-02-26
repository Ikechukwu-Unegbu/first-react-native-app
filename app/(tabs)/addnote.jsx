import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddNoteScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigation = useNavigation();

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and Content cannot be empty!");
      return;
    }

    try {
      const existingNotes = await AsyncStorage.getItem("notes");
      const notes = existingNotes ? JSON.parse(existingNotes) : [];

      const newNote = {
        id: Date.now().toString(),
        title,
        content,
      };

      notes.push(newNote);
      await AsyncStorage.setItem("notes", JSON.stringify(notes));

      Alert.alert("Success", "Note saved successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textarea}
        placeholder="Write your note here..."
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    paddingVertical: 8,
  },
  textarea: {
    fontSize: 16,
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddNoteScreen;
