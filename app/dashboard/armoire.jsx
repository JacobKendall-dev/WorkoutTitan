import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Modal } from 'react-native';
import {references} from 'constants';


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



const Armoire = () => {


  const [showHelmets, setShowHelmets] = useState(false)

  const[modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Armoire</Text>


      //Helmets: 
          <Pressable onPress={setShowHelmets(prev => !prev)}>
            <Text>Helmets</Text>
            </Pressable>

      {showHelmets && (
        <FlatList
              data = {DATA}
              keyExtractor = {(item) => item.id }
              contentContainerStyle = {styles.list}
              renderItem = {({item}) => (        
              <Pressable
              onPress = {() => setSource(armor, item)}>
                <Item title = {item.title}/>
              </Pressable>
              )}
            />
      )}


      //Armor Color:
            <Modal
            animationType="slide"
            transparent = {true}
            visible = {modalVisible}
            onRequestClose ={() => {
              setModalVisible(false)
            }}>
              <Pressable
              style = {[styles.button, styles.buttonClose]}
              onPress = {()=> setModalVisible(!modalVisible)}
              >
                <Text style = {styles.textStyle}>Close</Text>
              </Pressable>
            </Modal>

            <Pressable
            style = {[styles.button, styles.buttonOpen]}
            onPress={()=> setModalVisible(true)}>
              <Text style = {styles.textStyle}>Show Armor Colors</Text>
            </Pressable>

          
    
      <Link style={styles.link} href="/dashboard/shop">
          The Shop
      </Link>
    </View>
  )
}

export default Armoire

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
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  },
  buttonOpen: {
    backgroundColor: '#21cc8d'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
})