import { StyleSheet, Text, View, Pressable } from 'react-native'
import ScreenBackground from '../../../components/ScreenBackground'
import { Link } from 'expo-router'
import React from 'react'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'

const Kitchen = () => {
  return (
    <AppShell
      title="Campsite Cooking"
      subtitle="Move between your planner, tracker, and recipe book while keeping the same warm campfire feel."
    >
      <View style={styles.actionStack}>
        <View style={styles.row}>
          <Link href="/dashboard/kitchen/currentmealplan" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Current Meal Plan</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.row}>
          <Link href="/dashboard/kitchen/tracker" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Tracker</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.row}>
          <Link href="/dashboard/kitchen/recipes" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Recipes</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <SectionCard style={styles.previewCard}>
        <ScreenBackground
          imageSource={require('../../../assets/images/CookingIdleCustom.gif')}
          overlay={false}
          resizeMode="contain"
          style={styles.previewImage}
        />
      </SectionCard>
    </AppShell>
  )
}

export default Kitchen

const styles = StyleSheet.create({
  actionStack: {
    gap: 12,
    marginBottom: 18,
  },
  row: {
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: '#723a45',
    borderWidth: 1,
    borderColor: '#b98d84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#f7e7e2',
    fontSize: 16,
    fontWeight: '700',
  },
  previewCard: {
    minHeight: 260,
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
    overflow: 'hidden',
    padding: 0,
  },
  previewImage: {
    minHeight: 260,
  },
})
