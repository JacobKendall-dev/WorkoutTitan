import React from 'react'
import WorkoutLoggerScreen from '../../../../components/WorkoutLoggerScreen'

const WORKOUTS = [
  { id: '1', name: 'Bench', muscle: 'Chest', fieldType: 'weightReps' },
  { id: '2', name: 'Incline Bench', muscle: 'Upper Chest', fieldType: 'weightReps' },
  { id: '3', name: 'Bicep Curls', muscle: 'Biceps', fieldType: 'weightReps' },
  { id: '4', name: 'Shoulder Press', muscle: 'Shoulders', fieldType: 'weightReps' },
  { id: '5', name: 'Lateral Raises', muscle: 'Lats', fieldType: 'weightReps' },
  { id: '6', name: 'Cable Rows', muscle: 'Lats', fieldType: 'weightReps' },
  { id: '7', name: 'Lap Pull-Downs', muscle: 'Lats', fieldType: 'weightReps' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const UpperbodyW = () => {
  return (
    <WorkoutLoggerScreen
      title="Upper Body Weights"
      subtitle="Choose a workout and set your own reps and weight"
      workouts={WORKOUTS}
      presets={PRESETS}
      emptyDescription="Select a workout by pressing on the exercise below"
    />
  )
}

export default UpperbodyW
