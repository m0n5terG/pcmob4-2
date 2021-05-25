import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../database/firebaseDB";

const db = firebase.firestore().collection("todos");

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = db.orderBy("created").onSnapshot((collection) => {
      const updatedNotes = collection.docs.map((doc) => {
        const noteObject = {
          ...doc.data(),
          id: doc.id,
        };
        console.log(noteObject);
        return noteObject;
      });
     
     setNotes(updatedNotes); // And set our notes stat array to its docs
  });
  
  // Unsubscribe when unmounting
  return unsubscribe;      
}, []);

  /*firebase.firestore().collection("testing").add({
    title: "Testing! Does this work???",
    body: "This is to check the integration is working",
    potato: true,
    question: "Why is there a potato bool here",
  });*/   

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  // Monitor route.params for changes and add items to the database
  useEffect(() => {
    if (route.params?.text) {
      const newNote = {
        title: route.params.text,
        done: false,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.add(newNote);
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Screen");
  }

  // This deletes an individual note
  function deleteNote(id) {
    console.log("Deleting " + id);
  db.doc(id).delete();
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 15,
          width: "auto",
        }}
      >
        <View style={styles.listContainer}>
          <View
            style={{
              flexWrap: "wrap",
              width: 330,
              paddingLeft: 20,
            }}
          >
            <Text style={{ textAlign: "left", fontSize: 16, paddingTop: 10, paddingBottom: 5 }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 10, paddingBottom: 10, color: "red" }}>{item.created.toDate().toDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <Ionicons name="trash" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    backgroundColor: "whitesmoke",
    height: "auto",
    borderRadius: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
