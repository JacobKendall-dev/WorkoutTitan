import { View, Image, StyleSheet, Pressable, Text, ScrollView, Modal } from 'react-native'
import React, { useMemo, useState, useCallback } from 'react'
import { images } from '../../../data/challenges.js'
import { useWorkouts } from '../../../hooks/useWorkouts'
import { getProgress, checkChallenge } from '../../../utils/challengeEngine.js'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'
import { appTheme } from '../../../constants/appTheme'

// Grid is fixed at 3 columns; rows grow to fit however many challenges match the filter.
const NUM_COLUMNS = 3
const SPACING = 10

const CATEGORY_TABS = ['Weightlifting', 'Calisthenics', 'Core', 'Running', 'Biking', 'Incline', 'StairMaster']

const SUB_TABS = {
  Weightlifting: ['Upper', 'Lower'],
  Calisthenics: ['Upper', 'Lower'],
  Core: null,
  Running: null,
  Biking: null,
  Incline: null,
  StairMaster: null,
}

// Combines static challenge data with live progress + unlock state
const evaluateChallenge = (challenge, exercises) => {
  const rules = challenge.requirements.rules
  const firstRule = rules[0] // current simplification (UI now supports multiple)

  if (!firstRule) return { ...challenge, progress: 0, unlocked: false }

  const progress = getProgress(firstRule, exercises)

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

const Challenges = () => {
  // UI state (filters + selected item)
  const [selectedCategory, setSelectedCategory] = useState('Weightlifting')
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  // Measured once from the grid container's actual rendered width —
  // NOT derived from tile size, so there's no layout feedback loop.
  const [gridWidth, setGridWidth] = useState(null)

  const onGridLayout = useCallback((e) => {
    const w = e.nativeEvent.layout.width
    if (w > 0) setGridWidth((prev) => (prev === w ? prev : w))
  }, [])

  const tileWidth = gridWidth ? (gridWidth - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS : 0
  const tileImageHeight = tileWidth * (1024 / 768)

  // Live workout data
  const { exercises } = useWorkouts()

  // Memoized so we only recompute when exercise data changes
  const enrichedChallenges = useMemo(() => {
    return images.map((item) => evaluateChallenge(item, exercises))
  }, [exercises])

  // Category + subcategory filtering
  const filteredChallenges = enrichedChallenges.filter((item) => {
    const matchesCategory = item.tab === selectedCategory
    const matchesSub = !selectedSubCategory || item.subTab === selectedSubCategory
    return matchesCategory && matchesSub
  })

  const handleChallenges = (item) => {
    setSelectedChallenge(item)
  }

  const closeDetail = () => setSelectedChallenge(null)

  const detailRules = selectedChallenge?.requirements?.rules || []

  return (
    <AppShell
      title="Challenges"
      subtitle="Browse unlocks, filter by workout type, and track your progress"
    >
      <SectionCard style={styles.filterCard}>
        <Text style={styles.sectionLabel}>Challenge categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabRow}>
            {CATEGORY_TABS.map((tab) => (
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

        {SUB_TABS[selectedCategory] && (
          <View style={styles.subTabRow}>
            {SUB_TABS[selectedCategory].map((sub) => (
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionCard style={styles.gridCard}>
          <Text style={styles.gridTitle}>Rewards</Text>

          <View style={styles.grid} onLayout={onGridLayout}>
            {gridWidth
              ? filteredChallenges.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleChallenges(item)}
                    style={[styles.rewardTile, { width: tileWidth }]}
                  >
                    <Image
                      source={item.unlocked ? item.image : item.hidden}
                      style={[styles.rewardImage, { width: tileWidth, height: tileImageHeight }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.rewardStatus} numberOfLines={1}>
                      {item.unlocked ? 'Unlocked' : 'Locked'}
                    </Text>
                  </Pressable>
                ))
              : null}
          </View>
        </SectionCard>
      </ScrollView>

      <Modal
        visible={!!selectedChallenge}
        transparent
        animationType="fade"
        onRequestClose={closeDetail}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeDetail}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {selectedChallenge && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.detailLabel}>Selected challenge</Text>
                  <Pressable onPress={closeDetail} hitSlop={10}>
                    <Text style={styles.modalClose}>✕</Text>
                  </Pressable>
                </View>
                <Text style={styles.detailTitle}>{selectedChallenge.name}</Text>
                <Text style={styles.detailDescription}>{selectedChallenge.description}</Text>

                {detailRules.map((rule, index) => {
                  const progress = getProgress(rule, exercises)
                  const percent = rule.target ? Math.min((progress / rule.target) * 100, 100) : 0
                  const isComplete = progress >= rule.target

                  return (
                    <View key={index} style={styles.ruleBlock}>
                      <Text style={styles.ruleText}>
                        {rule.exercise} — {progress} / {rule.target} {isComplete ? '✅' : ''}
                      </Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${percent}%` }]} />
                      </View>
                    </View>
                  )
                })}

                <Text style={styles.detailFooter}>
                  {selectedChallenge.unlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </AppShell>
  )
}

export default Challenges

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 12,
  },
  sectionLabel: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  tabRow: {
    flexDirection: 'row',
  },
  filterPill: {
    backgroundColor: '#ead8d2',
    borderRadius: 16,
    marginRight: 8,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  filterPillActive: {
    backgroundColor: appTheme.colors.primary,
  },
  filterPillText: {
    color: '#6a4a4f',
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#f7e7e2',
  },
  subTabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  subPill: {
    backgroundColor: '#fff8f5',
    borderColor: '#d8bbb1',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  subPillActive: {
    backgroundColor: '#f4b183',
    borderColor: '#f4b183',
  },
  subPillText: {
    color: '#6a4a4f',
    fontSize: 12,
    fontWeight: '700',
  },
  subPillTextActive: {
    color: '#4c271d',
  },
  gridCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 0,
  },
  gridTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    width: '100%',
  },
  rewardTile: {
    alignItems: 'center',
  },
  rewardImage: {
    borderRadius: 14,
    marginBottom: 6,
  },
  rewardStatus: {
    color: '#6a4a4f',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 15, 12, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fdf3ef',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: appTheme.colors.borderSoft,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalClose: {
    color: '#a06a5e',
    fontSize: 16,
    fontWeight: '800',
  },
  detailLabel: {
    color: appTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
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