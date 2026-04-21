import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import AppShell from '../../components/AppShell'
import SectionCard from '../../components/SectionCard'
import { useUser } from '../../hooks/useUser'

const ACTIVE_DESTINATIONS = [
  { label: 'Kitchen', href: '/dashboard/kitchen', detail: 'Recipes, meal plans, and calorie tracking.' },
  { label: 'Workout', href: '/dashboard/workout', detail: 'Training categories, exercise logs, and timers.' },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', detail: 'Community rankings and challenge progress.' },
  { label: 'Profile', href: '/dashboard/profile', detail: 'Account details and sign-out controls.' },
]

const UPCOMING_DESTINATIONS = [
  { label: 'Campsite', detail: 'Reserved for a future hub experience.' },
  { label: 'Armoire', detail: 'Reserved for avatar gear and customization.' },
]

const Dashboard = () => {
  const { user } = useUser()

  return (
    <AppShell
      title="Welcome, Traveler"
      subtitle={user?.email ? `Signed in as ${user.email}` : 'Choose where you want to head next.'}
    >
      <SectionCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Open now</Text>
        <View style={styles.destinationList}>
          {ACTIVE_DESTINATIONS.map((destination) => (
            <Link key={destination.href} href={destination.href} asChild>
              <Pressable style={styles.linkCard}>
                <Text style={styles.linkTitle}>{destination.label}</Text>
                <Text style={styles.linkDetail}>{destination.detail}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </SectionCard>

      <SectionCard style={styles.upcomingCard}>
        <Text style={styles.upcomingTitle}>Coming soon</Text>
        {UPCOMING_DESTINATIONS.map((destination) => (
          <View key={destination.label} style={styles.upcomingItem}>
            <Text style={styles.upcomingLabel}>{destination.label}</Text>
            <Text style={styles.upcomingDetail}>{destination.detail}</Text>
          </View>
        ))}
      </SectionCard>
    </AppShell>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff7f2',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  destinationList: {
    gap: 12,
  },
  linkCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    padding: 16,
  },
  linkTitle: {
    color: '#5c3238',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  linkDetail: {
    color: '#775a56',
    fontSize: 14,
    lineHeight: 20,
  },
  upcomingCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
  },
  upcomingTitle: {
    color: '#5c3238',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  upcomingItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e3d1cb',
  },
  upcomingLabel: {
    color: '#5c3238',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  upcomingDetail: {
    color: '#7c635e',
    fontSize: 14,
    lineHeight: 20,
  },
})

