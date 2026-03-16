import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const CATEGORIES = [
  {
    id: 'weights',
    name: 'Weights',
    icon: '🏋️',
    count: '3 workout types',
    iconBg: '#F3E7FE',
    lastSession: 'Upper body · Today',
    sessions: 18,
    streak: 3,
    pb: 'Bench Press · 225 lbs',
    workouts: [
      { label: 'Upper body', meta: 'Bench press, OHP, Triceps…', href: '/dashboard/workout/weightlifting/upperbodyW' },
      { label: 'Lower body', meta: 'Squats, Deadlift, Lunges…', href: '/dashboard/workout/weightlifting/lowerbodyW' },
      { label: 'Back', meta: 'Rows, Pull-ups, Lat pulldown…', href: '/dashboard/workout/weightlifting/backW' },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: '🏃',
    count: '3 workout types',
    iconBg: '#FEF3E7',
    lastSession: 'Running · 3 days ago',
    sessions: 24,
    streak: 6,
    pb: 'Best 5k · 24:30',
    pbLabel: 'Best run',
    workouts: [
      { label: 'Running', meta: 'Outdoor & treadmill runs', href: '/dashboard/workout/cardio/running' },
      { label: 'Swimming', meta: 'Laps, drills, open water', href: '/dashboard/workout/cardio/swimming' },
      { label: 'Cycling', meta: 'Road, trail, stationary', href: '/dashboard/workout/cardio/cycling' },
    ],
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics',
    icon: '🤸',
    count: '4 workout types',
    iconBg: '#E7F3FE',
    lastSession: 'Core · Yesterday',
    sessions: 31,
    streak: 12,
    pb: 'Max pull-ups · 18',
    pbLabel: 'Personal best',
    workouts: [
      { label: 'Upper body', meta: 'Push-ups, Dips, Pike press…', href: '/dashboard/workout/calisthenics/upperbodyC' },
      { label: 'Lower body', meta: 'Pistol squats, Jumps…', href: '/dashboard/workout/calisthenics/lowerbodyC' },
      { label: 'Core', meta: 'Planks, L-sits, Dragon flags…', href: '/dashboard/workout/calisthenics/core' },
      { label: 'Stretches', meta: 'Mobility & flexibility work', href: '/dashboard/workout/calisthenics/stretches' },
    ],
  },
  {
    id: 'create',
    name: 'Create',
    icon: '➕',
    count: 'Build your own',
    iconBg: '#E7FEF0',
    href: '/dashboard/workout/createWorkout',
  },
]

const Workout = () => {
  const router = useRouter()

  const handleCardPress = (category) => {
    if (category.id === 'create') {
      router.push(category.href)
      return
    }
    router.push({
      pathname: '/dashboard/workout/sheet',
      params: { data: JSON.stringify(category) },
    })
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Workout</Text>
        <Text style={styles.subtitle}>{today}</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => handleCardPress(cat)}
            >
              <View style={[styles.iconWrap, { backgroundColor: cat.iconBg }]}>
                <Text style={styles.iconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.cardName}>{cat.name}</Text>
              <Text style={styles.cardCount}>{cat.count}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Workout

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  container: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  cardPressed: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  cardCount: {
    fontSize: 11,
    color: '#999',
  },
})