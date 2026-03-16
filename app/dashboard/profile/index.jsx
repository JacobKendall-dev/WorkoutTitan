import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '../../../hooks/useUser'

const Profile = () => {

console.log('profile file loaded')
 const { logout, user } = useUser()

  return (
    <View>


      <Text>{user.email}</Text>

      <Button
            title="Logout of the Current Session"
            onPress = {logout}
            color='#89890e'
        />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})