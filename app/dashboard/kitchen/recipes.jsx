import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable } from 'react-native'
import { Link } from 'expo-router'
import React, {useEffect, useMemo, useState} from 'react'

// Firestore imports
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig"; 



const Recipes = () => {
    //Constants
    const Recipes = () => {
    const [recipes, setRecipes] = useState([]);  // holds your recipe docs
    const [loading, setLoading] = useState(true);

    const recipesQuery = useMemo(() => {
    return query(collection(db, "recipes"), orderBy("name", "asc"));
    }, []);

    useEffect(() => {
        // realtime listener: updates whenever recipes change in Firestore
        const unsubscribe = onSnapshot(
        recipesQuery,
        (snapshot) => {
            const next = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setRecipes(next);
            setLoading(false);
        },
        (error) => {
            console.error("onSnapshot error:", error);
            setLoading(false);
        }
        );

        // cleanup when screen unmounts
        return unsubscribe;
    }, [recipesQuery]);

    const renderItem = ({ item }) => (
        <Pressable style={styles.row} onPress={() => console.log("Open recipe:", item.id)}>
        <Text style={styles.recipeName}>{item.name ?? "(Unnamed recipe)"}</Text>
        </Pressable>
    );


    return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>

      {/* Optional link to an "add recipe" screen if you have one */}
      <Link href="/add-recipe" style={styles.link}>
        Add a recipe
      </Link>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading recipes…</Text>
        </View>
      ) : (
        <FlatList 
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}> Your recipe book is empty. Add your first recipe!</Text>}
        />
        )}
        </View>
    )
    }
}
export default Recipes

const styles = StyleSheet.create({
    title: {
        marginVertical: 40,
        fontSize: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        marginVertical: 20,
        fontSize: 20,
        textDecorationLine: 'underline'
    },
    listContainer: {
         paddingBottom: 24,
  },
    row: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
  },
    recipeName: {
         fontSize: 16,
         fontWeight: "600",
  },
      center: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
  },
     loadingText: {
          marginTop: 10,
  },
     emptyContainer: {
          flexGrow: 1,
          justifyContent: "center",
  },
     emptyText: {
           textAlign: "center",
           fontSize: 16,
  },

})
  
