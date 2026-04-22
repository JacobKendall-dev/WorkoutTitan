import { StyleSheet, Text, View, FlatList, Pressable, Modal, Image} from 'react-native'
import React, {useState, useContext} from 'react'
import { Link } from 'expo-router'
import SafeView from '../../components/SafeView'
import ScreenBackground from '../../components/ScreenBackground'
import DropdownMenu from '../../components/DropdownMenu'
import TabbedMenu from '../../components/TabbedMenu'
import {ArmorContext} from '../../contexts/ArmorContext'
import {resolveAsset} from '../../utils/resolveAsset'
import {UNLOCKS, Unlocks} from '../../constants/Unlocks'



const columnConfig =[
  ["title", "asset"],
  ["title", "asset"]
]

const ARMOR_DATA = Object.values(UNLOCKS.armorUnlocks)
const COLOR_DATA = Object.values(UNLOCKS.armorSwatches)





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
    fontSize: 28,
    marginTop: 10,
    marginBottom: 12,
    textAlign: "center"
  },
   list: {
    padding: 16,
    backgroundColor: '#21cc8d',
    borderRadius: 8,
  },
  buttonOpen: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginTop: 5,
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