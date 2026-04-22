import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'
import { appTheme } from '../../../constants/appTheme'

const STORAGE_KEY = 'custom-workout-library'

const CATEGORY_OPTIONS = [
  { id: 'cardio', label: 'Cardio' },
  { id: 'calisthenics', label: 'Calisthenics' },
  { id: 'weightlifting', label: 'Weightlifting' },
]

const createBlankWorkout = () => ({
  title: '',
  category: 'cardio',
  distance: '',
  speed: '',
  time: '',
  intensity: '',
  description: '',
  bodyArea: '',
  reps: '',
  weight: '',
})

const normalizeWorkouts = (savedValue) => {
  if (!Array.isArray(savedValue)) {
    return []
  }

  return savedValue
    .filter((item) => item && typeof item === 'object' && String(item.title ?? '').trim())
    .map((item, index) => ({
      id: item.id ?? `${Date.now()}-${index}`,
      title: String(item.title ?? '').trim(),
      category: CATEGORY_OPTIONS.some((option) => option.id === item.category) ? item.category : 'cardio',
      distance: String(item.distance ?? ''),
      speed: String(item.speed ?? ''),
      time: String(item.time ?? ''),
      intensity: String(item.intensity ?? ''),
      description: String(item.description ?? ''),
      bodyArea: String(item.bodyArea ?? ''),
      reps: String(item.reps ?? ''),
      weight: String(item.weight ?? ''),
      createdAt: item.createdAt ?? new Date().toISOString(),
    }))
}

const getCategoryAccent = (category) => {
  switch (category) {
    case 'calisthenics':
      return '#6d4f7f'
    case 'weightlifting':
      return '#7d2f1f'
    case 'cardio':
    default:
      return '#2f667d'
  }
}

const formatCategory = (category) => {
  const match = CATEGORY_OPTIONS.find((option) => option.id === category)
  return match?.label ?? 'Workout'
}

const buildWorkoutDetails = (workout) => {
  switch (workout.category) {
    case 'cardio':
      return [
        workout.distance ? `Distance: ${workout.distance}` : null,
        workout.speed ? `Speed: ${workout.speed}` : null,
        workout.time ? `Time: ${workout.time}` : null,
        workout.intensity ? `Intensity: ${workout.intensity}` : null,
      ].filter(Boolean)
    case 'calisthenics':
      return [
        workout.time ? `Time: ${workout.time}` : null,
        workout.bodyArea ? `Body area: ${workout.bodyArea}` : null,
      ].filter(Boolean)
    case 'weightlifting':
      return [
        workout.reps ? `Reps: ${workout.reps}` : null,
        workout.weight ? `Weight: ${workout.weight}` : null,
        workout.bodyArea ? `Body area: ${workout.bodyArea}` : null,
      ].filter(Boolean)
    default:
      return []
  }
}

const CreateWorkout = () => {
  const [customWorkouts, setCustomWorkouts] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [draftWorkout, setDraftWorkout] = useState(createBlankWorkout)
  const [isLoading, setIsLoading] = useState(true)

  const sortedWorkouts = useMemo(
    () => [...customWorkouts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [customWorkouts]
  )

  const saveWorkouts = async (nextWorkouts) => {
    setCustomWorkouts(nextWorkouts)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextWorkouts))
  }

  const loadWorkouts = async () => {
    try {
      const savedValue = await AsyncStorage.getItem(STORAGE_KEY)
      const parsedValue = savedValue ? JSON.parse(savedValue) : []
      const normalizedWorkouts = normalizeWorkouts(parsedValue)

      setCustomWorkouts(normalizedWorkouts)

      if (JSON.stringify(parsedValue) !== JSON.stringify(normalizedWorkouts)) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedWorkouts))
      }
    } catch (error) {
      console.error('Failed to load custom workouts', error)
      Alert.alert('Workout error', 'We could not load your custom workouts right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWorkouts()
  }, [])

  const updateDraftField = (field, value) => {
    setDraftWorkout((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  const handleCategoryChange = (category) => {
    setDraftWorkout((currentDraft) => ({
      ...currentDraft,
      category,
      distance: '',
      speed: '',
      time: '',
      intensity: '',
      bodyArea: '',
      reps: '',
      weight: '',
    }))
  }

  const openCreateModal = () => {
    setDraftWorkout(createBlankWorkout())
    setIsModalVisible(true)
  }

  const closeCreateModal = () => {
    setDraftWorkout(createBlankWorkout())
    setIsModalVisible(false)
  }

  const handleSaveWorkout = async () => {
    const trimmedTitle = draftWorkout.title.trim()

    if (!trimmedTitle) {
      Alert.alert('Missing title', 'Please add a workout name before saving.')
      return
    }

    const newWorkout = {
      ...draftWorkout,
      id: `${Date.now()}`,
      title: trimmedTitle,
      createdAt: new Date().toISOString(),
    }

    try {
      const nextWorkouts = [newWorkout, ...customWorkouts]
      await saveWorkouts(nextWorkouts)
      closeCreateModal()
    } catch (error) {
      console.error('Failed to save custom workout', error)
      Alert.alert('Workout error', 'We could not save that custom workout.')
    }
  }

  const renderCategoryFields = () => {
    if (draftWorkout.category === 'cardio') {
      return (
        <>
          <LabeledInput
            label="Distance"
            value={draftWorkout.distance}
            onChangeText={(value) => updateDraftField('distance', value)}
            placeholder="Optional distance"
          />
          <LabeledInput
            label="Speed"
            value={draftWorkout.speed}
            onChangeText={(value) => updateDraftField('speed', value)}
            placeholder="Optional speed"
          />
          <LabeledInput
            label="Time"
            value={draftWorkout.time}
            onChangeText={(value) => updateDraftField('time', value)}
            placeholder="Optional time"
          />
          <LabeledInput
            label="Intensity"
            value={draftWorkout.intensity}
            onChangeText={(value) => updateDraftField('intensity', value)}
            placeholder="Optional intensity"
          />
        </>
      )
    }

    if (draftWorkout.category === 'calisthenics') {
      return (
        <>
          <LabeledInput
            label="Time"
            value={draftWorkout.time}
            onChangeText={(value) => updateDraftField('time', value)}
            placeholder="Optional time"
          />
          <LabeledInput
            label="Body Area"
            value={draftWorkout.bodyArea}
            onChangeText={(value) => updateDraftField('bodyArea', value)}
            placeholder="Arms, legs, core..."
          />
        </>
      )
    }

    return (
      <>
        <LabeledInput
          label="Reps"
          value={draftWorkout.reps}
          onChangeText={(value) => updateDraftField('reps', value)}
          placeholder="Optional reps"
          keyboardType="numeric"
        />
        <LabeledInput
          label="Weight"
          value={draftWorkout.weight}
          onChangeText={(value) => updateDraftField('weight', value)}
          placeholder="Optional weight"
          keyboardType="numeric"
        />
        <LabeledInput
          label="Body Area"
          value={draftWorkout.bodyArea}
          onChangeText={(value) => updateDraftField('bodyArea', value)}
          placeholder="Arms, legs, core..."
        />
      </>
    )
  }

  return (
    <AppShell
      title="Create Workout"
      subtitle="Create and save your own workouts"
    >
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          styles.addButtonFullWidth,
          pressed && styles.addButtonPressed,
        ]}
        onPress={openCreateModal}
      >
        <Text style={styles.addButtonText}>Create Custom Workout</Text>
      </Pressable>

      <View style={styles.listSection}>
        <Text style={styles.sectionLabel}>Saved workouts</Text>
        <SectionCard style={styles.listCard}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Loading your library...</Text>
              <Text style={styles.emptyBody}>We are gathering your custom workouts now.</Text>
            </View>
          ) : sortedWorkouts.length ? (
            <View style={styles.listContent}>
              {sortedWorkouts.map((workout) => {
                const detailItems = buildWorkoutDetails(workout)

                return (
                  <View key={workout.id} style={styles.workoutCard}>
                    <View style={styles.workoutHeader}>
                      <Text style={styles.workoutTitle}>{workout.title}</Text>
                      <View
                        style={[
                          styles.categoryPill,
                          { backgroundColor: getCategoryAccent(workout.category) },
                        ]}
                      >
                        <Text style={styles.categoryPillText}>{formatCategory(workout.category)}</Text>
                      </View>
                    </View>

                    {detailItems.length ? (
                      detailItems.map((detail) => (
                        <Text key={`${workout.id}-${detail}`} style={styles.workoutMeta}>
                          {detail}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.workoutMetaMuted}>No extra metrics saved yet.</Text>
                    )}

                    {workout.description ? (
                      <Text style={styles.workoutDescription}>{workout.description}</Text>
                    ) : null}
                  </View>
                )
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No custom workouts yet</Text>
              <Text style={styles.emptyBody}>
                Start building your own workouts here and they will show up in this styled library.
              </Text>
            </View>
          )}
        </SectionCard>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={closeCreateModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeCreateModal}>
            <View style={styles.modalCard}>
              <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>New Custom Workout</Text>
                <Text style={styles.modalSubtitle}>
                  Set up the basics first, then add the workout-specific details below.
                </Text>

                <LabeledInput
                  label="Workout Name"
                  value={draftWorkout.title}
                  onChangeText={(value) => updateDraftField('title', value)}
                  placeholder="My custom workout"
                />

                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryRow}>
                  {CATEGORY_OPTIONS.map((option) => {
                    const isSelected = draftWorkout.category === option.id

                    return (
                      <Pressable
                        key={option.id}
                        style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                        onPress={() => handleCategoryChange(option.id)}
                      >
                        <Text
                          style={[
                            styles.categoryOptionText,
                            isSelected && styles.categoryOptionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>

                {renderCategoryFields()}

                <LabeledInput
                  label="Description"
                  value={draftWorkout.description}
                  onChangeText={(value) => updateDraftField('description', value)}
                  placeholder="Add a note or description"
                  multiline
                />

                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
                    onPress={closeCreateModal}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                    onPress={handleSaveWorkout}
                  >
                    <Text style={styles.primaryButtonText}>Save Workout</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </AppShell>
  )
}

const LabeledInput = ({
  label,
  multiline = false,
  ...props
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor="#998a85"
      {...props}
    />
  </View>
)

export default CreateWorkout

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#723a45',
    borderRadius: 18,
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  addButtonFullWidth: {
    width: '100%',
  },
  addButtonPressed: {
    backgroundColor: '#63323b',
  },
  addButtonText: {
    color: '#f7e7e2',
    fontSize: 14,
    fontWeight: '800',
  },
  listSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#f4ddd6',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.96)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ceb1a8',
  },
  listContent: {
    padding: 14,
    gap: 12,
  },
  workoutCard: {
    backgroundColor: '#fff8f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ead8d2',
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  workoutTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#5c3238',
  },
  categoryPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryPillText: {
    color: '#fff7f2',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  workoutMeta: {
    color: '#7b625d',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  workoutMetaMuted: {
    color: '#96807a',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  workoutDescription: {
    color: '#4f2c31',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#5c3238',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    color: '#7b625d',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  modalRoot: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
  },
  modalCard: {
    maxHeight: '92%',
    backgroundColor: '#fff5ef',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: appTheme.colors.borderSoft,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 34,
  },
  modalTitle: {
    color: '#5d343a',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#7b625d',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  inputWrap: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#5d343a',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ceb1a8',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#432328',
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 110,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  categoryOption: {
    flexGrow: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d5b8af',
    backgroundColor: '#fff8f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  categoryOptionSelected: {
    backgroundColor: '#723a45',
    borderColor: '#723a45',
  },
  categoryOptionText: {
    color: '#6a4a4f',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryOptionTextSelected: {
    color: '#f7e7e2',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ead8d2',
  },
  secondaryButtonPressed: {
    backgroundColor: '#dec8c2',
  },
  secondaryButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#723a45',
  },
  primaryButtonPressed: {
    backgroundColor: '#63323b',
  },
  primaryButtonText: {
    color: '#f7e7e2',
    fontSize: 15,
    fontWeight: '700',
  },
})
