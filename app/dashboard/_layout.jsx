import { Stack, Tabs } from 'expo-router'
import {ArmorProvider} from '../../contexts/ArmorContext'
import {SceneProvider} from '../../contexts/SceneryContext'
import { Ionicons } from "@expo/vector-icons"

export default function DashboardLayout() {

  return (
    <SceneProvider>
      <ArmorProvider>
        <Stack
          screenOptions={{
            headerShown: true
        }}>
        </Stack>
      </ArmorProvider>
    </SceneProvider>

  )
}
