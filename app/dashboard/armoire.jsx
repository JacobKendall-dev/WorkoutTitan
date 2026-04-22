import { StyleSheet, Text, View, FlatList, Pressable, Modal, Image} from 'react-native'
import React, {useState, useContext} from 'react'
import { Link } from 'expo-router'
import SafeView from '../../components/SafeView'
import ScreenBackground from '../../components/ScreenBackground'
import DropdownMenu from '../../components/DropdownMenu'
import TabbedMenu from '../../components/TabbedMenu'
import {ArmorContext} from '../../contexts/ArmorContext'
import {resolveAsset} from '../../utils/resolveAsset'



const columnConfig =[
  ["title", "assetImage"],
  ["title", "assetImage"]
]

const ARMOR_DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Bucket Hat',
    key: 'buc',
    assetImage: require('../../assets/images/hats/BucketHat.png'),
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Beanie',
    key: 'bea',
    assetImage: require('../../assets/images/hats/Beanie.png'),
  }
];



const COLOR_DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Blue',
    key: 'b',
    assetImage: require('../../assets/images/colors/BlueColor.png'),
  },
];




const Armoire = () => {

  const [activeMenu, setActiveMenu] = useState(null)

  const [color, setActiveColor] = useState("blue")
  const {armor, updateArmor} = useContext(ArmorContext)

  const armorAsset = resolveAsset({
    category: "armor",
    direction: "front", 
    parsed: {
      color: armor.color,
      item: armor.item
    }
  })

  console.log(armor)
  console.log(armor?.name)
  console.log(armor?.color)
  console.log(armor?.item)


  return (
    
      <View style = {styles.container}>
       <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = "contain"
      >

    <SafeView style={styles.container} safe = {true}>

      <Text style={styles.title}>Armoire</Text>

    


      {/*Helmets: */}
        <View style = {styles.buttonOpen}>


          <Pressable onPress={() => setActiveMenu(prev => prev ==="armor"? null: "armor")}>
            <Text style = {styles.textStyle}>Customization</Text>
          </Pressable>
        </View>

      {activeMenu === "armor" && (
        <SafeView style = {styles.list} safe = {true}>
           <DropdownMenu
            title = "Armor Customization"
            menuName= "armor"
            activeMenu = {activeMenu}>
          <TabbedMenu
            tabs ={['Armor', 'Color']} 
            data ={[ARMOR_DATA, COLOR_DATA]}
            columns ={columnConfig}
            onRowPress={(activeTab, item) => {
              if (activeTab === "Armor") {
                updateArmor({
                  item: item.key
                })
              } else {
                updateArmor({
                  color: item.key
                })
              }
            }}
            />
        </DropdownMenu>

      </SafeView>
      )}

    <View style={styles.card}>
      <Image
        source={armorAsset}
        style={styles.armorImage}
        resizeMode="contain"
      />
      <Text style={styles.cardTitle}>{armor.name}</Text>
    </View>

      

    </SafeView>
    </ScreenBackground>
    </View>
  )
}


export default Armoire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  background: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  title: {
    marginVertical: 40,
    fontSize: 28,
  },
   list: {
    padding: 16,
    backgroundColor: '#21cc8d',
    borderRadius: 8,
  },
  buttonOpen: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#21cc8d',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
},
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  card: {
    margin: 30,
    height: 280,
    width: 240,
    backgroundColor: '#21cc8d',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  armorImage: {
  width: 160,
  height: 160,
  marginBottom: 10,
},
cardTitle: {
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
},
})