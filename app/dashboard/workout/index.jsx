import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'


const CATEGORIES = [
  {
    id: 'weights',
    name: 'Weights',
    icon: '🏋️',
    count: '3 workout types',
    iconBg: '#f7d9cb',
    lastSession: 'Upper body · Today',
    sessions: 18,
    streak: 3,
    pb: `Incremented exerciseAmount for personalbests.bench`,
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
    iconBg: '#f4b183',
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
    iconBg: '#eed7c0',
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
    iconBg: '#e8d5cf',
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
    <AppShell
      title="Workout"
      subtitle={`Choose a training lane for ${today}. Each card follows the same warm, camp-inspired look as your kitchen tools.`}
    >
      <SectionCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Training categories</Text>
        <Text style={styles.summaryBody}>
          Jump into a guided workout type, review stats for the category, or open the custom workout builder.
        </Text>
      </SectionCard>

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
    </AppShell>
  )
}

export default Workout

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: 18,
  },
  summaryTitle: {
    color: '#fff7f2',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryBody: {
    color: '#dac0b8',
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(247, 234, 228, 0.96)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ceb1a8',
  },
  cardPressed: {
    backgroundColor: '#f2dfd9',
    borderColor: '#bd9b93',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5c3238',
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 12,
    color: '#7b625d',
    lineHeight: 18,
  },
})

