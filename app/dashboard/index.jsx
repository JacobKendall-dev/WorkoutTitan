import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Link } from 'expo-router'
import AppShell from '../../components/AppShell'
import SectionCard from '../../components/SectionCard'
import { CleaningCampsiteCard } from '../../components/AvatarCard'
import { useUser } from '../../hooks/useUser'

const ACTIVE_DESTINATIONS = [
  { label: 'Kitchen', href: '/dashboard/kitchen', detail: 'Recipes, meal plans, and calorie tracking.' },
  { label: 'Workout', href: '/dashboard/workout', detail: 'Training categories, exercise logs, and timers.' },
  { label: 'Challenges', href: '/dashboard/workout/challenges', detail: 'Complete chellenges and earn unlocks.' },
  { label: 'Campsite', href: '/dashboard/campsite', detail: 'Preview campsite scenes and environment customization.' },
  { label: 'Armoire', href: '/dashboard/armoire', detail: 'Browse armor looks and wardrobe color previews.' },
  { label: 'Profile', href: '/dashboard/profile', detail: 'Account details and sign-out controls.' },
]

const Dashboard = () => {
  const { user } = useUser()
  const [previewHeight, setPreviewHeight] = useState(220)

  const onPreviewLayout = useCallback((e) => {
    const { height } = e.nativeEvent.layout
    if (height > 0) setPreviewHeight(height)
  }, [])

  return (
    <AppShell
      title="Welcome, Traveler"
      subtitle={user?.email ? `Signed in as ${user.email}` : 'Choose where you want to head next.'}
    >
      <View style={styles.container}>
        <SectionCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <View style={styles.destinationGrid}>
            {ACTIVE_DESTINATIONS.map((destination) => (
              <Link key={destination.href} href={destination.href} asChild>
                <Pressable style={styles.linkCard}>
                  <Text style={styles.linkTitle}>{destination.label}</Text>
                  <Text style={styles.linkDetail} numberOfLines={2}>
                    {destination.detail}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </SectionCard>

        <SectionCard style={styles.previewCard} onLayout={onPreviewLayout}>
          <CleaningCampsiteCard
            style={[styles.previewImage, { height: previewHeight }]}
            cardStyle={[styles.previewAvatarCard, { height: previewHeight }]}
          />
        </SectionCard>
      </View>
    </AppShell>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff7f2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  linkCard: {
    width: '48.5%',
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    padding: 12,
  },
  linkTitle: {
    color: '#5c3238',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  linkDetail: {
    color: '#775a56',
    fontSize: 12,
    lineHeight: 16,
  },
  previewCard: {
    flex: 1,
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
    overflow: 'hidden',
    padding: 0,
    marginBottom: 0,
  },
  previewImage: {
    width: '100%',
  },
  previewAvatarCard: {
    width: '100%',
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
})