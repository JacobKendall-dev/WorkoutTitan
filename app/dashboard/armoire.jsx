import { StyleSheet, Text, View, FlatList, Pressable, Modal, Image} from 'react-native'
import React, {useState} from 'react'
import { Link } from 'expo-router'
import { setArmor } from '../../contexts/ArmorContext'
import SafeView from '../../components/SafeView'
import ScreenBackground from '../../components/ScreenBackground'
import DropdownMenu from '../../components/DropdownMenu'
import TabbedMenu from '../../components/TabbedMenu'



const armorTab = ["armorTab"]
const colorTab =["armorColor"]

const columnConfig =[
  ["title", "assetImage"],
  ["title", "assetImage"]
]

const ARMOR_DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Bucket Hat',
    assetImage: require('../../assets/images/hats/BucketHat.png'),
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Beanie',
    assetImage: require('../../assets/images/hats/Beanie.png'),
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Baseball Cap',
    assetImage: require('../../assets/images/hats/BaseballCap.png'),
  },
];



const COLOR_DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Blue',
    assetImage: require('../../assets/images/colors/BlueColor.png'),
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    assetImage: require('../../assets/images/colors/BlueColor.png'),
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    assetImage: require('../../assets/images/colors/BlueColor.png'),
  },
];




const Armoire = () => {

  const [activeMenu, setActiveMenu] = useState(null)

  const [color, setActiveColor] = useState("blue")
  const [armor, setActiveArmor] = useState("")

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
          <Pressable onPress={() => setActiveMenu("armor")}>
            <Text style = {styles.textStyle}>Helmets</Text>
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
            columns ={columnConfig}/>
        </DropdownMenu>

        

        {/*Armor Preview Window*/}
        <View style = {styles.card}>
          <Image
          source = {armor}/>
        </View>



        {/*Turn Buttons*/}
        <Pressable></Pressable>

        <Pressable></Pressable>
      </SafeView>

            
      )}

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
  link: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
   list: {
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
  buttonOpen: {
    backgroundColor: '#21cc8d',
    margin: 20
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  card: {
    margin: 30,
    height: 300,
    justifyContent: 'center',
    backgroundColor: '#21cc8d'
  },
  modal: {
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#21cc8d',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
})