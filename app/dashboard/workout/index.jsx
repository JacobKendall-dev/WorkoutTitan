import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'

const CATEGORIES = [
  {
    id: 'weights',
    name: 'Weights',
    icon: '🏋️',
    iconBg: '#F3E7FE',
    workouts: [
      { label: 'Upper body', href: '/dashboard/workout/weightlifting/upperbodyW' },
      { label: 'Lower body', href: '/dashboard/workout/weightlifting/lowerbodyW' },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: '🏃',
    iconBg: '#FEF3E7',
    workouts: [
      { label: 'Running', href: '/dashboard/workout/cardio/running' },
      { label: 'Cycling', href: '/dashboard/workout/cardio/cycling' },
    ],
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics',
    icon: '🤸',
    iconBg: '#E7F3FE',
    workouts: [
      { label: 'Upper body', href: '/dashboard/workout/calisthenics/upperbodyC' },
      { label: 'Lower body', href: '/dashboard/workout/calisthenics/lowerbodyC' },
      { label: 'Core', href: '/dashboard/workout/calisthenics/core' },
    ],
  },
  {
    id: 'create',
    name: 'Create',
    icon: '➕',
    iconBg: '#E7FEF0',
    workouts: [],
    href: '/dashboard/workout/createWorkout',
  },
]

const Workout = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(null)

  const handleSelect = (cat) => {
    if (cat.id === 'create') {
      router.push(cat.href)
      return
    }
    setActiveTab(prev => prev?.id === cat.id ? null : cat)
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Workout</Text>
        <Text style={styles.subtitle}>{today}</Text>

        {/* TABS */}
        <View style={styles.tabs}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat.id}
              onPress={() => handleSelect(cat)}
              style={[
                styles.tab,
                activeTab?.id === cat.id && styles.tabActive
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: cat.iconBg }]}>
                <Text style={styles.iconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.tabText}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        <Link href="/dashboard/workout/challenges" style={styles.challengeBtn}>
          <Text style={styles.challengeText}>Challenges</Text>
        </Link>

        {/* EXPANDED PANEL */}
        {activeTab && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{activeTab.name}</Text>

            {activeTab.workouts.map((w, i) => (
              <Pressable
                key={i}
                style={styles.linkBox}
                onPress={() => router.push(w.href)}
              >
                <Text style={styles.linkText}>{w.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
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

  headerRow: {
    marginBottom: 10,
  },
  backBtn: {
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
    color: '#444',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tab: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  tabActive: {
    borderColor: '#999',
    backgroundColor: '#fafafa',
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
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  panel: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  linkBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkText: {
    fontSize: 14,
    color: '#333',
  },
challengeBtn: {
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: '#111',
  borderRadius: 10,
  alignSelf: 'flex-start',
},

challengeText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 13,
},
})

