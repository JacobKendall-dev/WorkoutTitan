import { StyleSheet, Text, View, Pressable, Button, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'
import { useUser } from '../../hooks/useUser'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // Pulls the register method from our user/auth hook.
  const { register } = useUser()

  // Handles register button press: clears old errors, tries signup, and stores any new error.
  const handleSubmit = async () => {
    setError(null)
    try {
      await register(email, password)
      console.log('current user is:', email, password)
    } catch (error) {
        setError(error.message)
    }

  }

  return (
    // Dismisses the keyboard when user taps outside input fields.
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

    // Updates local email state as the user types.
    <TextInput 
    style={{width: '80%', marginBottom: 20}}
    placeholder ="Email"
    keyboardType="email-address"
    onChangeText={setEmail}
    value={email}
    />

    // Updates local password state as the user types. 
    <TextInput 
    style={{width: '80%', marginBottom: 20}}
    placeholder ="Password"
    onChangeText={setPassword}
    value={password}
    secureTextEntry
    />

    // Calls submit handler to attempt account creation. 
    <Button
    title="Register"
    onPress={handleSubmit}
    color="#000"
    />

    <Spacer />
    {error && <Text style={styles.error}>{error}</Text>}
      
    </View>
    </TouchableWithoutFeedback>
  )
}

export default Register

const styles = StyleSheet.create({
    title: {
        marginVertical: 40,
        fontSize: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        marginVertical: 20,
        fontSize: 20,
        textDecorationLine: 'underline'
    },
    error: {
      color: "#fff000",
      padding: 10,
      backgroundColor: '#f5c1c8',
      borderColor: "#fff000",
      borderwidth: 1,
      borderRadius: 6,
      marginHorizontal: 10,
    }
})
