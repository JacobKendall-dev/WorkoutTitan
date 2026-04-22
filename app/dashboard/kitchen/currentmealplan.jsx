import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, } from 'firebase/firestore'
import ScreenBackground from '../../../components/ScreenBackground'
import { useUser } from '../../../hooks/useUser'
import { auth, db } from '../../../lib/firebaseConfig'

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast' }, 
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snack', label: 'Snack' },
]

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

//Returns a new Date shifted forward/backward by the requested number of days.
const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

//Normalizes a date to the start of its week (Sunday at 12:00 AM).
const getStartOfWeek = (date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  next.setDate(next.getDate() - next.getDay())
  return next
}

//Converts a Date into a stable YYYY-MM-DD key for storage/lookups.
const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

//Formats a date as a readable full label.
const formatFullDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

//Builds a one-week date range label from a start date.
const formatWeekRange = (startDate) => {
  const endDate = addDays(startDate, 6)

  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
}

//Checks whether two Date values point to the same calendar day.
const isSameDay = (left, right) => toDateKey(left) === toDateKey(right)

const CurrentMealPlan = () => {
  const [recipes, setRecipes] = useState([])
  const [mealPlans, setMealPlans] = useState({})
  const [loadingRecipes, setLoadingRecipes] = useState(true)
  const [loadingMealPlans, setLoadingMealPlans] = useState(true)
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)
  const [now, setNow] = useState(() => new Date())

  const { user, authChecked } = useUser()
  const currentUser = user ?? auth.currentUser
  const userId = currentUser?.uid

  //Keeps "now" refreshed every minute so "Today" and week boundaries stay accurate.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  //Calculates the current week start date from the live clock value.
  const currentWeekStart = useMemo(() => getStartOfWeek(now), [now])

  //Builds 14 planner day objects (current week + next week) used by the UI.
  const plannerDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const date = addDays(currentWeekStart, index)
        return {
          date,
          dateKey: toDateKey(date),
          dayLabel: DAY_LABELS[date.getDay()],
          fullLabel: formatFullDate(date),
          isToday: isSameDay(date, now),
          weekOffset: index < 7 ? 0 : 1,
        }
      }),
    [currentWeekStart, now]
  )

  //Splits planner days into "This Week" and "Next Week" sections with date ranges.
  const weeks = useMemo(
    () => [
      {
        key: 'current',
        label: 'This Week',
        range: formatWeekRange(currentWeekStart),
        days: plannerDays.slice(0, 7),
      },
      {
        key: 'next',
        label: 'Next Week',
        range: formatWeekRange(addDays(currentWeekStart, 7)),
        days: plannerDays.slice(7),
      },
    ],
    [currentWeekStart, plannerDays]
  )

  //Creates the signed-in user's recipes query ordered by most recently saved.
  const recipesQuery = useMemo(() => {
    if (!authChecked || !userId) return null

    if (!userId) return null

    return query(
      collection(db, 'users', userId, 'recipes'),
      orderBy('savedAt', 'desc')
    )
  }, [authChecked, userId])

  //Subscribes to real-time recipe updates and stores them in local state.
  useEffect(() => {
    if (!authChecked) {
      setLoadingRecipes(true)
      return undefined
    }

    if (!recipesQuery) {
      setRecipes([])
      setLoadingRecipes(false)
      return undefined
    }

    const unsubscribe = onSnapshot(
      recipesQuery,
      (snapshot) => {
        const nextRecipes = snapshot.docs.map((recipeDoc) => ({
          id: recipeDoc.id,
          ...recipeDoc.data(),
        }))

        setRecipes(nextRecipes)
        setLoadingRecipes(false)
      },
      (error) => {
        console.error('Recipe listener error:', error)
        Alert.alert('Recipe Book Error', 'We could not load your saved recipes.')
        setLoadingRecipes(false)
      }
    )

    return unsubscribe
  }, [authChecked, recipesQuery])

  //Subscribes to real-time meal plan slot assignments for the signed-in user.
  useEffect(() => {
    if (!authChecked) {
      setLoadingMealPlans(true)
      return undefined
    }

    if (!userId) {
      setMealPlans({})
      setLoadingMealPlans(false)
      return undefined
    }

    const mealPlanQuery = query(
      collection(db, 'users', userId, 'mealPlans'),
      orderBy('dateKey', 'asc')
    )

    const unsubscribe = onSnapshot(
      mealPlanQuery,
      (snapshot) => {
        const nextMealPlans = {}

        snapshot.docs.forEach((mealPlanDoc) => {
          nextMealPlans[mealPlanDoc.id] = mealPlanDoc.data()
        })

        setMealPlans(nextMealPlans)
        setLoadingMealPlans(false)
      },
      (error) => {
        console.error('Meal plan listener error:', error)
        Alert.alert('Meal Plan Error', 'We could not load your meal plan right now.')
        setLoadingMealPlans(false)
      }
    )

    return unsubscribe
  }, [authChecked, userId])

  //Opens the recipe picker for a specific day/meal slot, or prompts sign-in if needed.
  const openRecipePicker = (day, mealType) => {
    if (!userId) {
      Alert.alert('Sign in required', 'Please sign in before planning meals.')
      return
    }

    setActiveSlot({ day, mealType })
    setIsPickerVisible(true)
  }

  //Closes the recipe picker modal and clears the currently selected slot.
  const closeRecipePicker = () => {
    setIsPickerVisible(false)
    setActiveSlot(null)
  }

  //Saves the selected recipe into the active meal slot in Firestore.
  const handleAssignRecipe = async (recipe) => {
    if (!userId || !activeSlot) return

    const { day, mealType } = activeSlot
    const slotId = `${day.dateKey}_${mealType.key}`

    try {
      await setDoc(doc(db, 'users', userId, 'mealPlans', slotId), {
        dateKey: day.dateKey,
        dayLabel: day.dayLabel,
        mealType: mealType.key,
        recipeId: recipe.id,
        recipeTitle: recipe.title || 'Untitled Recipe',
        updatedAt: serverTimestamp(),
      })

      closeRecipePicker()
    } catch (error) {
      console.error('Failed to save meal plan slot:', error)
      Alert.alert('Save failed', 'We could not assign that recipe right now.')
    }
  }

  //Removes any assigned recipe from the currently active meal slot.
  const handleClearSlot = async () => {
    if (!userId || !activeSlot) return

    const { day, mealType } = activeSlot
    const slotId = `${day.dateKey}_${mealType.key}`

    try {
      await deleteDoc(doc(db, 'users', userId, 'mealPlans', slotId))
      closeRecipePicker()
    } catch (error) {
      console.error('Failed to clear meal plan slot:', error)
      Alert.alert('Update failed', 'We could not clear that meal slot right now.')
    }
  }

  //Reads the assigned recipe entry for a date and meal type key.
  const getSlotRecipe = (dateKey, mealTypeKey) => mealPlans[`${dateKey}_${mealTypeKey}`]

  //Renders a pressable meal slot card with assigned recipe title or placeholder text.
  const renderMealSlot = (day, mealType) => {
    const assignedRecipe = getSlotRecipe(day.dateKey, mealType.key)

    return (
      <Pressable
        key={`${day.dateKey}_${mealType.key}`}
        style={[
          styles.mealSlot,
          assignedRecipe ? styles.mealSlotAssigned : styles.mealSlotEmpty,
        ]}
        onPress={() => openRecipePicker(day, mealType)}
      >
        <Text style={styles.mealLabel}>{mealType.label}</Text>
        <Text
          style={[
            styles.mealValue,
            !assignedRecipe && styles.mealValuePlaceholder,
          ]}
          numberOfLines={2}
        >
          {assignedRecipe?.recipeTitle || 'Select a recipe'}
        </Text>
      </Pressable>
    )
  }

  //Renders a single day card with all meal slots and a "Today" badge when applicable.
  const renderDayCard = (day) => (
    <View
      key={day.dateKey}
      style={[styles.dayCard, day.isToday && styles.todayCard]}
    >
      <View style={styles.dayHeader}>
        <View>
          <Text style={styles.dayTitle}>{day.dayLabel}</Text>
          <Text style={styles.dayDate}>{day.fullLabel}</Text>
        </View>

        {day.isToday ? (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>Today</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.mealGrid}>
        {MEAL_TYPES.map((mealType) => renderMealSlot(day, mealType))}
      </View>
    </View>
  )

  //Combines loading states so the screen can show one shared loading UI.
  const isLoading = !authChecked || loadingRecipes || loadingMealPlans

  return (
    <ScreenBackground
      imageSource={require('../../../assets/images/Gradient2.png')}
      overlay
      overlayOpacity={0.35}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Current Meal Plan</Text>
            <Text style={styles.subtitle}>
              Plan breakfast, lunch, dinner, and snacks for this week and next week using recipes from your recipe book.
            </Text>
            <Text style={styles.helperText}>
              Your planner rolls over every Sunday at 12:00 AM, so the screen always shows the current week plus the following week.
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#f6ddd6" />
              <Text style={styles.stateText}>Loading your meal planner...</Text>
            </View>
          ) : !userId ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Sign in to build your meal plan.</Text>
              <Text style={styles.emptyText}>
                Once you are signed in, you can assign recipes from your recipe book to any meal slot in the next two weeks.
              </Text>
            </View>
          ) : (
            <>
              {weeks.map((week) => (
                <View key={week.key} style={styles.weekSection}>
                  <View style={styles.weekHeader}>
                    <Text style={styles.weekTitle}>{week.label}</Text>
                    <Text style={styles.weekRange}>{week.range}</Text>
                  </View>

                  {week.days.map((day) => renderDayCard(day))}
                </View>
              ))}

              {recipes.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Your recipe book is empty.</Text>
                  <Text style={styles.emptyText}>
                    Add recipes in the Recipe Book first, then tap any meal slot here to assign them.
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent
        onRequestClose={closeRecipePicker}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose A Recipe</Text>
            <Text style={styles.modalSubtitle}>
              {activeSlot
                ? `${activeSlot.mealType.label} for ${activeSlot.day.fullLabel}`
                : 'Select a meal slot'}
            </Text>

            {activeSlot && getSlotRecipe(activeSlot.day.dateKey, activeSlot.mealType.key) ? (
              <Pressable style={styles.clearButton} onPress={handleClearSlot}>
                <Text style={styles.clearButtonText}>Clear this meal</Text>
              </Pressable>
            ) : null}

            {recipes.length === 0 ? (
              <View style={styles.modalEmptyState}>
                <Text style={styles.emptyTitle}>No recipes saved yet.</Text>
                <Text style={styles.emptyText}>
                  Head to your Recipe Book to add recipes before assigning meals.
                </Text>
              </View>
            ) : (
              <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.recipeOption}
                    onPress={() => handleAssignRecipe(item)}
                  >
                    <Text style={styles.recipeOptionTitle}>
                      {item.title || 'Untitled Recipe'}
                    </Text>
                    <Text style={styles.recipeOptionPreview} numberOfLines={3}>
                      {item.content}
                    </Text>
                  </Pressable>
                )}
                contentContainerStyle={styles.recipeListContent}
                showsVerticalScrollIndicator={false}
              />
            )}

            <Pressable style={styles.closeButton} onPress={closeRecipePicker}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  )
}

export default CurrentMealPlan

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 76,
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    color: '#fff7f2',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#f6ddd6',
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    color: '#dbc7c2',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  stateText: {
    color: '#f6ddd6',
    fontSize: 15,
    marginTop: 14,
  },
  weekSection: {
    marginBottom: 26,
  },
  weekHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(72, 38, 28, 0.72)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  weekTitle: {
    color: '#fff7f2',
    fontSize: 22,
    fontWeight: '800',
  },
  weekRange: {
    color: '#e8d2cb',
    fontSize: 13,
    marginTop: 4,
  },
  dayCard: {
    backgroundColor: 'rgba(32, 19, 14, 0.78)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  todayCard: {
    borderColor: 'rgba(255, 215, 174, 0.72)',
    shadowColor: '#f4b183',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayTitle: {
    color: '#fff7f2',
    fontSize: 20,
    fontWeight: '700',
  },
  dayDate: {
    color: '#dac0b8',
    fontSize: 13,
    marginTop: 2,
  },
  todayBadge: {
    backgroundColor: '#f4b183',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  todayBadgeText: {
    color: '#3e1f15',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mealGrid: {
    gap: 10,
  },
  mealSlot: {
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 74,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  mealSlotAssigned: {
    backgroundColor: 'rgba(244, 177, 131, 0.18)',
    borderColor: 'rgba(255, 214, 190, 0.34)',
  },
  mealSlotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mealLabel: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  mealValue: {
    color: '#fff7f2',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  mealValuePlaceholder: {
    color: '#c8b4ad',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: 'rgba(32, 19, 14, 0.78)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 8,
    padding: 20,
  },
  emptyTitle: {
    color: '#fff7f2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#dac0b8',
    fontSize: 14,
    lineHeight: 21,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#fff5ef',
    borderRadius: 28,
    maxHeight: '86%',
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    width: '100%',
  },
  modalTitle: {
    color: '#502a20',
    fontSize: 24,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#7b5448',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    marginTop: 6,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7d9cb',
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#7d2f1f',
    fontSize: 13,
    fontWeight: '700',
  },
  modalEmptyState: {
    paddingVertical: 20,
  },
  recipeListContent: {
    paddingBottom: 8,
  },
  recipeOption: {
    backgroundColor: '#fffdfb',
    borderColor: '#ecd4ca',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  recipeOptionTitle: {
    color: '#502a20',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  recipeOptionPreview: {
    color: '#7b5448',
    fontSize: 13,
    lineHeight: 19,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#5b3328',
    borderRadius: 18,
    marginTop: 8,
    paddingVertical: 14,
  },
  closeButtonText: {
    color: '#fff7f2',
    fontSize: 15,
    fontWeight: '700',
  },
})

