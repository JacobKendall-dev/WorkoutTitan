import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { UserProvider } from "../contexts/UserContext"
import { StyleSheet } from "react-native"

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </UserProvider>
  )
}

const syles = StyleSheet.create({

})