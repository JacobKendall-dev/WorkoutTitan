import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const Kitchen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Title Screen</Text>


        <Link style={styles.link} href="/dashboard/kitchenfields/currentmealplan">
        Current Meal Plan
        </Link>

        <Link style={styles.link} href="/dashboard/kitchenfields/tracker">
        This will be a modal for Protein/Calories 
        </Link>

        <Link style={styles.link} href="/dashboard/kitchenfields/recipes">
        Recipes
        </Link>
    </View>
  )
}

export default Kitchen

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

})