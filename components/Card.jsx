import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Card = ({ children }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
    card: {
        elevation: 3,
        backgroundColor: '#ddd',
        shadowOffset: {width: 1, height: 1}, 
        shadowColor: '#231D2D',
        marginHorizontal:  350,
        marginVertical: 20,
        width: '83%',
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    cardContent: {
       flex: 1,
    },

})