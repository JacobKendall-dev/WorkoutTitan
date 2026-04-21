import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'

const CATEGORIES = [
  {
    id: 'weights',
    name: 'Weights',
    count: '3 workout types',
    lastSession: 'Upper body · Today',
    sessions: 18,
    streak: 3,
    pb: `What is your personal best?`,
    workouts: [
      { label: 'Upper body', meta: 'Bench press, OHP, Triceps…', href: '/dashboard/workout/weightlifting/upperbodyW' },
      { label: 'Lower body', meta: 'Squats, Deadlift, Lunges…', href: '/dashboard/workout/weightlifting/lowerbodyW' },
      { label: 'Back', meta: 'Rows, Pull-ups, Lat pulldown…', href: '/dashboard/workout/weightlifting/backW' },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    count: '3 workout types',
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
    count: '4 workout types',
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
    count: 'Build your own',
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
      subtitle={`Choose a workout for ${today}. Don't forget to log your personal best!`}
    >
      <SectionCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Challenges</Text>
        <Text style={styles.summaryBody}>
          Want to check out workout challenges?
        </Text>
        <Pressable
          style={({ pressed }) => [styles.challengeLink, pressed && styles.challengeLinkPressed]}
          onPress={() => router.push('/dashboard/leaderboard')}
        >
          <Text style={styles.challengeLinkText}>Open challenges</Text>
        </Pressable>
      </SectionCard>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleCardPress(cat)}
          >
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
  challengeLink: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: 'rgba(247, 234, 228, 0.96)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  challengeLinkPressed: {
    backgroundColor: '#f2dfd9',
    borderColor: '#bd9b93',
  },
  challengeLinkText: {
    color: '#5c3238',
    fontSize: 13,
    fontWeight: '800',
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

