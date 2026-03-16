import { StyleSheet, Text, View, FlatList, Pressable, Modal} from 'react-native'
import React, {useState} from 'react'
import { Link } from 'expo-router'
import { setArmor } from '../../contexts/ArmorContext'
import SafeView from '../../components/SafeView'
import ScreenBackground from '../../components/ScreenBackground'


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

 const Item = ({ title }) => (
    <View style = {styles.item}>
        <Text style = {styles.textStyle}> { title } </Text>
    </View>
 );



const Armoire = () => {

  const [showHelmets, setShowHelmets] = useState(false)

  const[modalVisible, setModalVisible] = useState(false)

  return (
      <View style = {styles.container}>
       <ScreenBackground style = {styles.background}
        imageSource ={require("../../assets/images/CleaningIdleDefault.gif")} 
        overlay = {false}
        resizeMode = "contain"
      >

    <SafeView style={styles.container} safe = {true}>

      <Text style={styles.title}>Armoire</Text>


      //Helmets: 
        <View style = {styles.buttonOpen}>
          <Pressable onPress={() => setShowHelmets(prev => !prev)}>
            <Text style = {styles.textStyle}>Helmets</Text>
          </Pressable>
        </View>

      {showHelmets && (
        <SafeView style = {styles.list} safe = {true}>
        <FlatList
              data = {DATA}
              keyExtractor = {(item) => item.id }
              contentContainerStyle = {styles.list}
              renderItem = {({item}) => (        
              <Pressable
              onPress = {() => setArmor({armor, item})}>
                <Item title = {item.title}/>
              </Pressable>
              )}
            />
            </SafeView>

            
      )}


      //Armor Color:
          
            <Pressable
            style = {styles.buttonOpen}
            onPress={()=> setModalVisible(true)}>
              <Text style = {styles.textStyle}>Show Armor Colors</Text>
            </Pressable>

            <Modal
            animationType="slide"
            transparent = {true}
            visible = {modalVisible}
            onRequestClose ={() => {
              setModalVisible(false)
            }}>

              <View style = {styles.modal}>
                <Card style = {styles.card}>

                </Card>
              </View>

              <SafeView style = {styles.buttonClose} safe = {true}>
              <Pressable style = {styles.buttonClose}
              onPress = {()=> setModalVisible(false)}
              >
              <Text style = {styles.textStyle}>Close</Text>
              </Pressable>
              </SafeView>
            </Modal>
          
            

          
    
      <Link style={styles.link} href="/dashboard/shop">
          The Shop
      </Link>
    </SafeView>
    </ScreenBackground>
    </View>
  )
}


export default Armoire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
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
    maxHeight: 100,
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