import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Armoire = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Armoire</Text>

      <Link style={styles.link} href="/shop">
          The Shop
      </Link>
    </View>
  )
}

export default Armoire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    marginVertical: 40,
    fontSize: 28,
  },
  link: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
})