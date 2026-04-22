import React from 'react'
import WorkoutLoggerScreen from '../../../../components/WorkoutLoggerScreen'

const WORKOUTS = [
  { id: '1', name: 'Lunges', muscle: 'Thigh', fieldType: 'reps' },
  { id: '2', name: 'Calfraises', muscle: 'Calfs', fieldType: 'reps' },
  { id: '3', name: 'Wall sit', muscle: 'Thigh', fieldType: 'seconds' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m 30s', seconds: 150 },
]

const LowerbodyC = () => {
  return (
    <WorkoutLoggerScreen
      title="Lower Body Calisthenics"
      subtitle="Weightless lowerbody exercises"
      workouts={WORKOUTS}
      presets={PRESETS}
      emptyDescription="Tap an exercise to record reps, update your personal best, and run a clean rest timer between sets."
    />
  )
}

export default LowerbodyC
