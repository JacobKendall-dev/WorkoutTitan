import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const Workout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>


        <Link style={styles.link} href="/dashboard/workoutfields/cardio/running">
        Running Cardio
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/cardio/swimming">
        Swimming Cardio
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/cardio/swimming">
        Cycling Cardio
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/calisthenics/upperbodyC">
        Upperbody Calisthenics
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/calisthenics/lowerbodyC">
        Lowerbody Calisthenics
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/calisthenics/core">
        Core
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/calisthenics/stretches">
        Stretches
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/weightLifting/upperbodyW">
        Upperbody WeightLifting
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/weightLifting/lowerbodyW">
        Lowerbody WeightLifting
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/weightLifting/backW">
        Back WeightLifting
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/createWorkout">
        Create Workout
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/calendar">
        Calendar/Schedular
        </Link>

        <Link style={styles.link} href="/dashboard/workoutfields/challenges">
        Challenges
        </Link>
    </View>
  )
}

export default Workout

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
        marginVertical: 10,
        fontSize: 20,
        textDecorationLine: 'underline'
    },

})