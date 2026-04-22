import React from 'react'
import WorkoutLoggerScreen from '../../../../components/WorkoutLoggerScreen'

const WORKOUTS = [
  { id: '1', name: 'Sit-ups', muscle: 'Core', fieldType: 'reps' },
  { id: '2', name: 'Crunches', muscle: 'Core', fieldType: 'reps' },
  { id: '3', name: 'Plank', muscle: 'Core', fieldType: 'seconds' },
  { id: '4', name: '6in Leg Hold', muscle: 'Lower Abs', fieldType: 'seconds' },
  { id: '5', name: 'Leg Raises', muscle: 'Lower Abs', fieldType: 'reps' },
  { id: '6', name: 'Trunk Twists', muscle: 'Obliques', fieldType: 'reps' },
  { id: '7', name: 'Side Crunches', muscle: 'Obliques', fieldType: 'reps' },
  { id: '8', name: 'Side Plank', muscle: 'Obliques', fieldType: 'seconds' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const Core = () => {
  return (
    <WorkoutLoggerScreen
      title="Core"
      subtitle="Weightless exercises to strengthen your core"
      workouts={WORKOUTS}
      presets={PRESETS}
      emptyDescription="Build your core sessions here with a mix of rep-based exercises and timed holds."
    />
  )
}

export default Core
