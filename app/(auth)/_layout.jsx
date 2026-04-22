import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Pressable, Text } from "react-native"
import { useUser } from "../../hooks/useUser"

export default function LoginLayout() {
const { user } = useUser()
  const router = useRouter()
  console.log(user)

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: true,
          title: "",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#ffeace" },
          headerTintColor: "#723a45",
          headerTitleStyle: { fontFamily: "Kaitlynhw" },
          headerBackTitleStyle: { fontFamily: "Kaitlynhw" },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
              <Text style={{ color: "#723a45", fontSize: 16, fontWeight: "700" }}>
                {"Return"}
              </Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  )
}
