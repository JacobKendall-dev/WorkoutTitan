import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, {useState}  from 'react'
import TabbedMenu from '../../components/TabbedMenu'
import DropdownMenu from '../../components/DropdownMenu'
import ScreenBackground from '../../components/ScreenBackground'


const friendsTabs = ["leaderboard"];
const globalTabs =["leaderboard"]

const columnConfig ={
  leaderboard: ["title", "highscore"],
}

const FRIEND_DATA = [
  {
    id: 'bd7acbea',
    title: 'Tina Belcher',
    highscore: "120",
  },
  {
    id: '3ac68afc',
    title: 'Gene Belcher',
    highscore: "100",
  },
  {
    id: '58694a0f',
    title: 'Louise Belcher',
    highscore: "78",
  },
];


const GLOBAL_DATA = [
  {
    id:"4ad2f193",
    title:"Anon 1",
    highscore: "200",
  },
  {
    id:"8f029c05",
    title:"Anon 2",
    highscore: "174",
  },
  {
    id: "14t392q2",
    title: "Anon 3",
    highscore: "120",
  }
]

const Leaderboard = () => {

  const renderItem = ({item}) => (
    <View style = {styles.row}>
      <Text style= {styles.itemText}>{item.title}</Text>
      <Text style= {styles.itemText}>{item.highscore}</Text>
    </View>
  )


    const [activeMenu, setActiveMenu] = useState(null)

    const toggleMenu = (menu) => {
      setActiveMenu((prev) => (prev === menu ? null: menu))
    }

  return (
    <View style={styles.container}>
    <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = "contain"
      >
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Leaderboard</Text>
    </View>
   
    <View style={styles.row}>
    <DropdownMenu
    title = "Friend's Leaderboard"
    menuName= "friend"
    activeMenu = {activeMenu}
    toggleMenu = {toggleMenu}>
      <TabbedMenu 
        tabs = {friendsTabs} 
        data ={FRIEND_DATA}
        columns ={columnConfig}/>
    </DropdownMenu>


    <DropdownMenu
    title = "Global Leaderboard"
    menuName= "global"
    activeMenu = {activeMenu}
    toggleMenu = {toggleMenu}>
      <TabbedMenu 
        tabs = {globalTabs} 
        data ={GLOBAL_DATA}
        columns = {columnConfig}/>
    </DropdownMenu>


    </View>
    </ScreenBackground>
    </View>

  )
}

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    textAlign: "center",
    color: 'black',
    fontSize: 28,
  },
  titleContainer: {
    width: "100%",
    alignContent: "center",
    marginVertical: 20,
  },
  itemText: {
    marginVertical: 20,
    color: 'black',
    fontSize: 15
  },
  link: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
  list: {
    height: 200,
    width: 250,
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
  row:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonLayout: {
    flexDirection: "row"
  },
  buttonOpen: {
    backgroundColor:'#21cc8d',
    margin: 20,
    justifyContent: 'center'
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 20
  }
})