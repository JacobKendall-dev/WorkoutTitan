import { StyleSheet, Text, View } from 'react-native'
import ScreenBackground from '../components/ScreenBackground'
import { Link } from 'expo-router'
import PlainButton from '../components/SolidColorButton'
import Card from '../components/Card'

const Home = () => {
  return (
  <ScreenBackground
        imageSource={require("../assets/images/Gradient2.png")}
        overlay
        overlayOpacity={0.3}
        contentStyle={styles.screenContent}
        resizeMode='cover'
        
        >
    <View style={styles.container}>
      <Text style={styles.title}>
        WORKOUT TITAN
      </Text>
      <Link style={styles.link} href="/dashboard">
        Start now
      </Link>
      <Link style={styles.link} href="/login">
        Login
      </Link>
    </View>


   </ScreenBackground>
  )
}

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
})

export default Home