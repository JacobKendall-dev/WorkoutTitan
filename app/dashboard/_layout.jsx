import { Stack, Tabs } from 'expo-router'
import {ArmorContext} from '../../contexts/ArmorContext'
import { Ionicons } from "@expo/vector-icons"

export default function DashboardLayout() {

  return (
    <SceneProvider>
      <ArmorContext>
        <Stack
          screenOptions={{
            headerShown: true
        }}>
        </Stack>
      </ArmorContext>
    </SceneProvider>

  )
}
