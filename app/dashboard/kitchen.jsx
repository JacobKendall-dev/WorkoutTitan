import { StyleSheet, Text, View } from 'react-native'
import SignButton from "../../components/SignButton"; 
import SafeView from '../../components/SafeView';
import ScreenBackground from '../../components/ScreenBackground';
import Card from '../../components/Card';
import { Link } from 'expo-router'
import React from 'react'

const Kitchen = () => {
  return (
    //../../assets/images/iphone gif background.gif
    <SafeView style={styles.container} safe={true}>
    <View style = {styles.container}>
      <Text style={styles.title}>Campsite Cooking</Text>
    </View>

    <View style={styles.container}>
      <Link href="/dashboard/kitchenfields/currentmealplan" asChild>
        <SignButton title="Current Meal Plan" style={styles.buttonSpacing}/>
      </Link>

      <Link href="/dashboard/kitchenfields/tracker" asChild>
        <SignButton title="Tracker" style={styles.buttonSpacing}/>
      </Link>

      <Link href="/dashboard/kitchenfields/recipes" asChild>
        <SignButton title="Recipes" style={styles.buttonSpacing}/>
      </Link>
    </View>

    <Card>
        <ScreenBackground
          imageSource={require("../../assets/images/CookingIdleCustom.gif")}
          overlay={false}
          resizeMode='contain'
          />
    </Card>
      

     </SafeView>

        

        
  
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
        marginVertical: 10,
},
    image: {
        width: '140%',
        height: 100,
        resizeMode: 'contain',
        alignItems: 'center',
},
    card: {
        width: '90%',
        height: 250,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginTop: 350,
        marginLeft: 20,
        overflow: 'hidden',
      },


})