import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UpperbodyC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upperbody for Calisthenics</Text>
    </View>
  )
}

export default UpperbodyC

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