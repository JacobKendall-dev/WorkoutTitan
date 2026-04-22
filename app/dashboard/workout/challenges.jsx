import { View, Image, Dimensions, StyleSheet, Pressable, Text, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import {images} from '../../../data/challenges.js'
import { useWorkouts } from '../../../hooks/useWorkouts'
import {getProgress, checkChallenge} from '../../../utils/challengeEngine.js'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'
import { appTheme } from '../../../constants/appTheme'

// Main Challenges screen
const Challenges = () => {

  // UI state (filters + selected item)
  const [selectedCategory, setSelectedCategory] = useState('Weightlifting')
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  // Grid layout calculation
  const { width } = Dimensions.get('window')
  const numColumns = 3;
  const spacing = 10;
  const imageWidth = (width - spacing * (numColumns + 1)) / numColumns;

  // Live workout data
  const { exercises } = useWorkouts()

  // Optional subtabs per category
  const subTabs = {
    Weightlifting: ['Upper', 'Lower'],
    Calisthenics: ['Upper', 'Lower'],
    Core: null,
    Running: null,
    Biking: null,
    Incline: null,
    StairMaster: null
  }

  // Combines static challenge data with live progress + unlock state
  const evaluateChallenge = (challenge, exercises) => {
    const rules = challenge.requirements.rules
    const firstRule = rules[0]; // current simplification (UI now supports multiple)

    if (!firstRule) return { ...challenge, progress: 0, unlocked: false };

    const progress = getProgress(firstRule, exercises);

    const unlocked = checkChallenge(
      challenge,
      exercises,
      {} // session placeholder (future use)
    )

    return {
      ...challenge,
      progress,
      unlocked,
    }
  }

  // Memoized so we only recompute when exercise data changes
  const enrichedChallenges = useMemo(() => {
    return images.map(item => evaluateChallenge(item, exercises))
  }, [exercises])

  // Category + subcategory filtering
  const filteredChallenges = enrichedChallenges.filter(item => {
    const matchesCategory = item.tab === selectedCategory
    const matchesSub =
      !selectedSubCategory || item.subTab === selectedSubCategory;

    return matchesCategory && matchesSub
  })

  const handleChallenges = (item) => {
    setSelectedChallenge(item)
  }

  return (
    <AppShell
      title="Challenges"
      subtitle="Browse unlocks, filter by workout type, and track your progress"
    >
      <SectionCard style={styles.filterCard}>
        <Text style={styles.sectionLabel}>Challenge categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabRow}>
            {['Weightlifting', 'Calisthenics', 'Core', 'Running', 'Biking', 'Incline', 'StairMaster'].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => {
                  setSelectedCategory(tab)
                  setSelectedSubCategory(null)
                }}
                style={[styles.filterPill, selectedCategory === tab && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, selectedCategory === tab && styles.filterPillTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {subTabs[selectedCategory] && (
          <View style={styles.subTabRow}>
            {subTabs[selectedCategory].map((sub) => (
              <Pressable
                key={sub}
                onPress={() => setSelectedSubCategory(sub)}
                style={[styles.subPill, selectedSubCategory === sub && styles.subPillActive]}
              >
                <Text style={[styles.subPillText, selectedSubCategory === sub && styles.subPillTextActive]}>
                  {sub}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </SectionCard>

      <SectionCard style={styles.gridCard}>
        <Text style={styles.gridTitle}>Rewards</Text>
        <View style={styles.grid}>
          {filteredChallenges.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => handleChallenges(item)}
              style={[
                styles.rewardTile,
                { marginRight: (index % numColumns) !== numColumns - 1 ? spacing : 0 },
              ]}
            >
              <Image
                source={item.unlocked ? item.image : item.hidden}
                style={[styles.rewardImage, { width: imageWidth }]}
                resizeMode="contain"
              />
              <Text style={styles.rewardStatus}>{item.unlocked ? 'Unlocked' : 'Locked'}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      {selectedChallenge && (() => {
        const rules = selectedChallenge?.requirements?.rules || []

        return (
          <SectionCard style={styles.detailCard}>
            <Text style={styles.detailLabel}>Selected challenge</Text>
            <Text style={styles.detailTitle}>{selectedChallenge.name}</Text>
            <Text style={styles.detailDescription}>{selectedChallenge.description}</Text>

            {rules.map((rule, index) => {
              const progress = getProgress(rule, exercises);
              const percent = rule.target
                ? Math.min((progress / rule.target) * 100, 100)
                : 0;
              const isComplete = progress >= rule.target

              return (
                <View key={index} style={styles.ruleBlock}>
                  <Text style={styles.ruleText}>
                    {rule.exercise} — {progress} / {rule.target} {isComplete ? "✅" : ""}
                  </Text>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percent}%` }]} />
                  </View>
                </View>
              )
            })}

            <Text style={styles.detailFooter}>
              {selectedChallenge.unlocked ? "Unlocked" : "Locked"}
            </Text>
          </SectionCard>
        )
      })()}
    </AppShell>
  )
}

export default Challenges

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 16,
  },
  sectionLabel: {
    color: appTheme.colors.primaryDeep,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
  },
  filterPill: {
    backgroundColor: '#ead8d2',
    borderRadius: 16,
    marginRight: 10,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  filterPillActive: {
    backgroundColor: appTheme.colors.primary,
  },
  filterPillText: {
    color: '#6a4a4f',
    fontSize: 14,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#f7e7e2',
  },
  subTabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  subPill: {
    backgroundColor: '#fff8f5',
    borderColor: '#d8bbb1',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  subPillActive: {
    backgroundColor: '#f4b183',
    borderColor: '#f4b183',
  },
  subPillText: {
    color: '#6a4a4f',
    fontSize: 13,
    fontWeight: '700',
  },
  subPillTextActive: {
    color: '#4c271d',
  },
  gridCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 16,
  },
  gridTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rewardTile: {
    alignItems: 'center',
    marginBottom: 14,
  },
  rewardImage: {
    aspectRatio: 768 / 1024,
    borderRadius: 16,
    height: undefined,
    marginBottom: 8,
  },
  rewardStatus: {
    color: '#6a4a4f',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  detailLabel: {
    color: appTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailDescription: {
    color: '#775a56',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  ruleBlock: {
    marginBottom: 14,
  },
  ruleText: {
    color: appTheme.colors.primaryDeep,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressTrack: {
    backgroundColor: '#d8bbb1',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    backgroundColor: '#21cc8d',
    height: '100%',
  },
  detailFooter: {
    color: appTheme.colors.primary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
})
