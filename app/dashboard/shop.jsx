import { StyleSheet, Text, View, Image, FlatList, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import ScreenBackground from '../../components/ScreenBackground';


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

 const Item = ({title}) => {
    <View style = {styles.item}>
        <Text style = {styles.title}>{title}</Text>
    </View>
  }

const Shop = () => {

  return (
    <ScreenBackground style = {styles.background}
    imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
    overlay = {false}
    resizeMode = "contain"
    >

    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <FlatList
        data = {DATA}
        keyExtractor = {(item) => item.id }
        contentContainerStyle = {styles.list}
        renderItem = {({item}) => (        
        <Pressable>
          <Item title = {item.title}/>
        </Pressable>
        )}
      />

    <Link style={styles.link} href='/dashboard'>
    Back to Dashboard
    </Link>
    </View>
    </ScreenBackground>
  )
}

export default Shop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }
})