import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'
import { useUser } from '../../../hooks/useUser'

const Profile = () => {
  const { logout, user, authChecked } = useUser()

  return (
    <AppShell
      title="Profile"
      subtitle="Manage your account and keep track of the session you are currently using."
    >
      <SectionCard style={styles.primaryCard}>
        <Text style={styles.label}>Current account</Text>
        <Text style={styles.email}>
          {authChecked ? (user?.email ?? 'No account is signed in.') : 'Checking your session...'}
        </Text>
        <Text style={styles.helperText}>
          Your recipes, meal plans, and logged workouts follow the signed-in Firebase account.
        </Text>
      </SectionCard>

      <SectionCard style={styles.secondaryCard}>
        <Text style={styles.secondaryTitle}>Session controls</Text>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout of Current Session</Text>
        </Pressable>
      </SectionCard>
    </AppShell>
  )
}

export default Profile

const styles = StyleSheet.create({
  primaryCard: {
    marginBottom: 16,
  },
  label: {
    color: '#f7d9c6',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  email: {
    color: '#fff7f2',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  helperText: {
    color: '#dac0b8',
    fontSize: 14,
    lineHeight: 21,
  },
  secondaryCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
  },
  secondaryTitle: {
    color: '#5d343a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#723a45',
  },
  logoutButtonText: {
    color: '#f7e7e2',
    fontSize: 15,
    fontWeight: '700',
  },
})

