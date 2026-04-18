import { StyleSheet, Text, View } from 'react-native'
import SignButton from "../../../components/SignButton"; 
import SafeView from '../../../components/SafeView';
import ScreenBackground from '../../../components/ScreenBackground';
import PlainButton from '../../../components/SolidColorButton';
import Card from '../../../components/Card';
import { Link } from 'expo-router'
import React from 'react'
import { CookingCard } from '../../../components/AvatarCard';

const Kitchen = () => {
  return (
    //../../assets/images/iphone gif background.gif
     <ScreenBackground
        imageSource={require('../../../assets/images/Gradient2.png')}
        overlay
        overlayOpacity={0.3}
        contentStyle={styles.screenContent}
        resizeMode='cover'
        
        >
     
        <View style = {styles.titleBlock}>                        
          <Text style={styles.title}>Campsite Cooking</Text>
        </View>

//---------------------------------------------------------------------------------------------

        <View style={styles.topRow}>                       
          <Link href="/dashboard/kitchen/currentmealplan" asChild>
            <PlainButton title="Current Meal Plan" style={styles.sideButtonLeft}/>
          </Link>
        </View>
        <View style={styles.middleRow}>
          <Link href="/dashboard/kitchen/tracker" asChild>
            <PlainButton title="Tracker" style={styles.sideButtonRight}/>
          </Link>
        </View>

        <View style={styles.bottomRow}>                                      
          <Link href="/dashboard/kitchen/recipes" asChild>
            <PlainButton title="Recipes" style={styles.bottomButton}/>
          </Link>
        </View>
//---------------------------------------------------------------------------------------------
        
     <Card>
            <ScreenBackground
              imageSource={require("../../../assets/images/CookingIdleCustom.gif")}
              overlay={false}
              resizeMode='contain'
              
              />
        </Card>
      
      
    
</ScreenBackground>
        

        
  
  )
}

export default Kitchen



const styles = StyleSheet.create({
    title: {
        marginVertical: 20,
        fontSize: 30,
        fontWeight: "bold",
        textShadowColor: '#524439',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginTop: 15,
        marginBottom: 15,
        color: "#f0e3e0",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        overflow: "hidden",
        alignItems: 'center'
        

    },
    titleBlock: {
      alignItems: 'center',
      marginBottom: 5,
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
     buttonSection: {
        alignItems: 'center',
        marginBottom: 24,
      },

      topRow: {
        marginTop: 12,
        alignItems: 'center',
      },

      middleRow: {
        marginTop: 12,
        alignItems: 'center',
      
      },

      bottomRow: {
        marginTop: 12,
        alignItems: 'center',
        marginBottom: 50,
      },

      sideButtonLeft: {
        width: 150,
        height: 55,
        marginLeft: 1,
        alignItems: 'center',
      },
      sideButtonRight: {
        width: 150,
        height: 55,
        marginLeft: 1,
        alignItems: 'center',
      },

      bottomButton: {
        width: 150,
        height: 55,
      },

})