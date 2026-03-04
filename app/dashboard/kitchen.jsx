import { StyleSheet, Text, View } from 'react-native'
import SignButton from "../../components/SignButton"; 
import ScreenBackground from '../../components/ScreenBackground';
import { Link } from 'expo-router'
import React from 'react'

const Kitchen = () => {
  return (
    <ScreenBackground
      imageSource={require("../../assets/images/iphone gif background.gif")}
      overlay
      overlayOpacity={0.3}
      contentStyle={styles.container}
    >
      <Text style={styles.title}>Kitchen Title Screen</Text>

      <Link href="/dashboard/kitchenfields/currentmealplan" asChild>
        <SignButton title="Current Meal Plan" style={styles.buttonSpacing}/>
      </Link>

      <Link href="/dashboard/kitchenfields/tracker" asChild>
        <SignButton title="Tracker" style={styles.buttonSpacing}/>
      </Link>

      <Link href="/dashboard/kitchenfields/recipes" asChild>
        <SignButton title="Recipes" style={styles.buttonSpacing}/>
      </Link>
      

     

        

        
    </ScreenBackground>
  )
}

export default Kitchen

const styles = StyleSheet.create({
    title: {
        marginVertical: 40,
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 80,
        color: "#A46856",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        overflow: "hidden",

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    link: {
        marginVertical: 20,
        fontSize: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        textDecorationLine: 'underline'
    },
    buttonSpacing: {
        marginVertical: 20,
},

})