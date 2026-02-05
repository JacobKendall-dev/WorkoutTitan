import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const CurrentMealPlan = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CurrentMealPlan</Text>


    </View>
  )
}

export default CurrentMealPlan

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