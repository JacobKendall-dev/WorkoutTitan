import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Swimming = () => {
  return (
        <View style={styles.container}>
          <Text style={styles.title}>Swimming</Text>
        </View>
      )
    }
    
    export default Swimming
    
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