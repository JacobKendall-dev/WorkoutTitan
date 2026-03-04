import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useUser } from "../../hooks/useUser"

export default function LoginLayout() {

  const { user } = useUser()
  console.log(user)

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}