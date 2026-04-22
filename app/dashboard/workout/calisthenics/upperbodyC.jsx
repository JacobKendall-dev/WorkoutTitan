import React from 'react'
import WorkoutLoggerScreen from '../../../../components/WorkoutLoggerScreen'

const WORKOUTS = [
  { id: '1', name: 'Push-ups', muscle: 'Chest', fieldType: 'reps' },
  { id: '2', name: 'Incline Push-ups', muscle: 'Upper Chest', fieldType: 'reps' },
  { id: '3', name: 'Dips', muscle: 'Lower Chest', fieldType: 'reps' },
  { id: '4', name: 'Pull-ups', muscle: 'Back', fieldType: 'reps' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const UpperbodyW = () => {
  return (
    <WorkoutLoggerScreen
      title="Upper Body Calisthenics"
      subtitle="Weightless upperbody exercises"
      workouts={WORKOUTS}
      presets={PRESETS}
      emptyDescription="Tap an exercise to record reps, update your personal best, and run a clean rest timer between sets."
    />
  )
}

export default UpperbodyW
