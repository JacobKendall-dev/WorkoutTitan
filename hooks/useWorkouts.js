import { useEffect, useState } from 'react'
import { collection, doc, increment, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebaseConfig'

const ACTIVITY_DOC_ID = '__activity__'

const getStartOfWeek = (sourceDate = new Date()) => {
  const startOfWeek = new Date(sourceDate)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  return startOfWeek
}

const getDateKey = (sourceDate = new Date()) => {
  const year = sourceDate.getFullYear()
  const month = String(sourceDate.getMonth() + 1).padStart(2, '0')
  const day = String(sourceDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toJsDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value.toDate === 'function') return value.toDate()

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function useWorkouts(){
  const [exercises, setExercises] = useState({})
  const [activityLog, setActivityLog] = useState([])

  const user = auth.currentUser
  const userId = user?.uid

  async function logExercise(exerciseName, muscle, sets, personalBest) {
    if (!userId) throw new Error('User not logged in')

    const exerciseRef = doc(db, 'users', userId, 'exercises', exerciseName)

    await setDoc(exerciseRef, {
      exerciseAmount: increment(1),
      muscle,
      sets,
      personalBest,
      lastUpdated: new Date(),
    })
  }

  async function logWorkoutActivity(categoryId, workoutName, exerciseName = null) {
    if (!userId) throw new Error('User not logged in')

    const startedAt = new Date()
    const activityEntry = {
      categoryId,
      workoutName,
      exerciseName,
      startedAt: startedAt.toISOString(),
      dateKey: getDateKey(startedAt),
    }
    const activityRef = doc(db, 'users', userId, 'exercises', ACTIVITY_DOC_ID)
    const nextActivityLog = [...activityLog, activityEntry]

    await setDoc(activityRef, {
      entries: nextActivityLog,
      updatedAt: startedAt.toISOString(),
    })
  }

  const subscribeToExercises = () => {
    if (!userId) {
      setExercises({})
      return () => {}
    }

    return onSnapshot(collection(db, 'users', userId, 'exercises'), (snapshot) => {
      const allData = {}
      let nextActivityLog = []

      snapshot.docs.forEach((entry) => {
        if (entry.id === ACTIVITY_DOC_ID) {
          const activityEntries = entry.data()?.entries ?? []
          nextActivityLog = activityEntries.map((activityEntry, index) => ({
            id: `${entry.id}-${index}`,
            ...activityEntry,
            startedAt: toJsDate(activityEntry.startedAt),
          }))
          return
        }

        allData[entry.id] = entry.data()
      })

      setExercises(allData)
      setActivityLog(nextActivityLog)
    })
  }

  const getCategoryStats = (categoryId) => {
    const startOfWeek = getStartOfWeek()
    const categoryActivity = activityLog.filter((entry) => {
      if (entry.categoryId !== categoryId || !entry.startedAt) {
        return false
      }

      return entry.startedAt >= startOfWeek
    })

    const uniqueDays = new Set(
      categoryActivity.map((entry) => entry.dateKey ?? getDateKey(entry.startedAt))
    )

    return {
      sessions: categoryActivity.length,
      streak: uniqueDays.size,
    }
  }

  useEffect(() => {
    const unsubscribeExercises = subscribeToExercises()

    return () => {
      unsubscribeExercises()
    }
  }, [userId])

  return { logExercise, exercises, logWorkoutActivity, getCategoryStats }
}
