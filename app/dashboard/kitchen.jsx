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
     <ScreenBackground
        imageSource={require("../../assets/images/Fantasy.gif")}
        overlay
        overlayOpacity={0.3}
        contentStyle={styles.screenContent}
        resizeMode='cover'
        
        >
     <SafeView style={styles.container} safe={true}>
        <View style = {styles.titleBlock}>
          <Text style={styles.title}>Campsite Cooking</Text>
        </View>

        <View style={styles.buttonBlock}>
          <Link href="/dashboard/kitchenfields/currentmealplan" asChild>
            <SignButton title="Current Meal Plan" style={styles.mealPlanButton}/>
          </Link>

          <Link href="/dashboard/kitchenfields/tracker" asChild>
            <SignButton title="Tracker" style={styles.trackerButton}/>
          </Link>

          <Link href="/dashboard/kitchenfields/recipes" asChild>
            <SignButton title="Recipes" style={styles.recipesButton}/>
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
        marginBottom: 24,
        color: "#A46856",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        overflow: "hidden",
        alignItems: 'center'

    },
    titleBlock: {
      alignItems: 'center',
      marginBottom: 24,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
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
    buttonBlock: {
       alignItems: 'center',
       marginBottom: 24,
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
      screenContent: {
         flex: 1,
         alignItems: 'center',
         justifyContent: 'flex-start',
         paddingTop: 30,
      },
      mealPlanButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      trackerButton: {
        marginTop: 20,
        marginLeft: 40,
        width: 200,
        height: 50,
      },

      recipesButton: {
        marginTop: 15,
        marginRight: 30,
        width: 210,
        height: 50,
      },


})