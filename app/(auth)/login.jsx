import { StyleSheet, Text, View, Pressable, Button, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Spacer from '../../components/Spacer'
import { Link, useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { login } = useUser()
  const router = useRouter()

  const handleSubmit = async () => {
    setError(null)

    try {
      await login(email, password)
      router.replace('/dashboard')
    } catch (error) {
      if (error.message.includes('auth/user-not-found')) {
        setError('This email is not in use')
        return
      }

      if (
        error.message.includes('auth/wrong-password') ||
        error.message.includes('auth/invalid-credential') ||
        error.message.includes('auth/invalid-login-credentials')
      ) {
        setError('Email and/or password was incorrect')
        return
      }

      setError('Email and/or password was incorrect')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Login to your account</Text>


      <TextInput 
      style={{width: '80%', marginBottom: 20}}
      placeholder ="Email"
      keyboardType="email-address"
      onChangeText={setEmail}
      value={email}
      />
      <TextInput 
      style={{width: '80%', marginBottom: 20}}
      placeholder ="Password"
      onChangeText={setPassword}
      value={password}
      secureTextEntry
      />

      <Button
        title="Login"
        onPress={handleSubmit}
        color="#000"
      />
      <Spacer />
      {error && <Text style={styles.error}>{error}</Text>}

      <Spacer height={100}/>
      <Link href='/register'>
        <Text style={{textAlign: 'center'}}>
          Register Instead
        </Text>
      </Link>

    </View>
    </TouchableWithoutFeedback>
  )
}

export default Login

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
