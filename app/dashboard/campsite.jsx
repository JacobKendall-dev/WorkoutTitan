import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import SignButton from '../../components/SignButton'


//Background is handled with useState and list.

import ScreenBackground from '../../components/ScreenBackground'

const Campsite = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Campsite</Text>
        <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = 'contain'
      >


        <View style = {styles.card}>

      <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = 'contain'
      />

      </View>


      </ScreenBackground>
    </View>
  )
}

export default Campsite

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  bacground: {
    borderRadius: 20
  },
  title: {
    marginVertical: 40,
    fontSize: 28,
    color: '',
  },
  link: {
    marginVertical: 20,
    padding: 16,
    color: 'white',
    borderRadius: 8,
  },
  card: {
    width: '90%',
    height: 217,
    backgroundColor: '#fff',
    marginTop: 20,
    overflow: 'hidden'
  }
})