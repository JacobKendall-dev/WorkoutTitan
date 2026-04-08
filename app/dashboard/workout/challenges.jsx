import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useWorkouts } from '../../../hooks/useWorkouts'

const Challenges = () => {

  const CHALLENGES = [
  {id: '1', name: 'Bench', sets: '4x8', muscle: 'Chest'},
  {id: '2', name: 'Incline Bench', sets: '3x10', muscle: 'Upper Chest'},
  {id: '3', name: 'Bicep Curls', sets: '3x12', muscle: 'Biceps'},
  {id: '4', name: 'Dips', sets: '3x15', muscle: 'Lower Chest'}
  ]

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