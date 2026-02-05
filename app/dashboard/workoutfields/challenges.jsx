import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Challenges = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenges</Text>
    </View>
  )
}

export default Challenges

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