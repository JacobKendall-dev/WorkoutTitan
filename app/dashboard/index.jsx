import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '../../hooks/useUser'

const Dashboard = () => {
   


  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome Traveler</Text>

        

        <Link style={styles.link} href="/dashboard/campsite">
        Go to Campsite
        </Link>

        <Link style={styles.link} href="/dashboard/kitchen">
        Go to Kitchen
        </Link>

        <Link style={styles.link} href="/dashboard/armoire">
        Go to Armoire
        </Link>

        <Link style={styles.link} href="/dashboard/workout">
        Go to Workout
        </Link>

        <Link style={styles.link} href="/dashboard/leaderboard">
        Leaderboard
        </Link>

        <Link style={styles.link} href="/dashboard/profile">
        Profile
        </Link>
    </View>
  )
}

export default Dashboard

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