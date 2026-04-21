import { StyleSheet, Text, Pressable, View } from 'react-native'
import { Link } from 'expo-router'
import AppShell from '../components/AppShell'
import SectionCard from '../components/SectionCard'

const Home = () => {
  return (
    <AppShell
      title="Workout Titan"
      subtitle="A warm, camp-inspired home base for meal planning, training, and tracking your progress."
      contentContainerStyle={styles.content}
    >
      <SectionCard style={styles.heroCard}>
        <Text style={styles.heroText}>
          Step into the dashboard to explore your kitchen, workouts, leaderboard, and profile in one shared space.
        </Text>
      </SectionCard>

      <View style={styles.actions}>
        <Link href="/dashboard" asChild>
          <Pressable style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Enter Dashboard</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </Pressable>
        </Link>

        <Link href="/register" asChild>
          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </Pressable>
        </Link>
      </View>
    </AppShell>
  )
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  heroCard: {
    marginBottom: 18,
  },
  heroText: {
    color: '#f8ece7',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#f4b183',
    borderColor: '#ffd6be',
  },
  secondaryButton: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
  },
  primaryButtonText: {
    color: '#4c271d',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: '#5c3238',
    fontSize: 16,
    fontWeight: '700',
  },
})

export default Home
