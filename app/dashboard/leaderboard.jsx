import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, {useState}  from 'react'


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


   const [showFriendMenu, setShowFriendMenu] = useState(false)
   const [showGlobalMenu, setShowGlobalMenu] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
    <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = "contain"
      >
    <View style={styles.row}>

    <Pressable style = {styles.buttonOpen} onPress={() => setShowFriendData(prev => !prev)}> 
      <Text style= {styles.buttonText}>Friends</Text>
    </Pressable>

    <Pressable style = {styles.buttonOpen} onPress={() => setShowGlobalData(prev => !prev)}>
      <Text style= {styles.buttonText}>Global</Text>
    </Pressable>
    </View>

    {showFriendMenu && (
    <View style = {styles.list}>
    <FlatList
      data={FRIEND_DATA}
      contentContainerStyle = {styles.list}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}/>
      </View>
    )}

    {showGlobalMenu && (
    <View style = {styles.list}>
    <FlatList
    data={GLOBAL_DATA}
    contentContainerStyle = {styles.list}
    renderItem={renderItem}
    keyExtractor= {(item) => item.id}/>
    </View>
    )}
    </ScreenBackground>
    </View>

  )
}

export default Leaderboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    marginVertical: 40,
    color: 'black',
    fontSize: 28,
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