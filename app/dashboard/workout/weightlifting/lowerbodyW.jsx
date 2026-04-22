import React from 'react'
import WorkoutLoggerScreen from '../../../../components/WorkoutLoggerScreen'

const WORKOUTS = [
  { id: '1', name: 'Squats', muscle: 'Quads', fieldType: 'weightReps' },
  { id: '2', name: 'Leg Press', muscle: 'Quads', fieldType: 'weightReps' },
  { id: '3', name: 'Leg Curls', muscle: 'Hamstrings', fieldType: 'weightReps' },
  { id: '4', name: 'Deadlift', muscle: 'Posterior Chain', fieldType: 'weightReps' },
  { id: '5', name: 'Leg Abductor', muscle: 'Glutes', fieldType: 'weightReps' },
  { id: '6', name: 'Leg Adductor', muscle: 'Inner Thighs', fieldType: 'weightReps' },
  { id: '7', name: 'Calf Raises', muscle: 'Calves', fieldType: 'weightReps' },
  { id: '8', name: 'Romanian Deadlift', muscle: 'Hamstrings', fieldType: 'weightReps' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const LowerbodyW = () => {
  return (
    <WorkoutLoggerScreen
      title="Lower Body Weights"
      subtitle="Choose a workout and set your own reps and weight"
      workouts={WORKOUTS}
      presets={PRESETS}
      emptyDescription="Select a workout by pressing on the exercise below"
    />
  )
}

export default LowerbodyW
