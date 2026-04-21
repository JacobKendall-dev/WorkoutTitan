import React from 'react'
import PlaceholderScreen from '../../../components/PlaceholderScreen'

const CreateWorkout = () => {
  return (
    <PlaceholderScreen
      title="Create Workout"
      subtitle="A custom-builder space for routines you want to design from scratch."
      highlights={[
        'Assemble your own exercise list and organize the flow of a session.',
        'Set targets like reps, time, rest, and personal benchmark notes.',
        'Keep the same warm card system as the rest of the workout area once the builder is wired in.',
      ]}
      note="The visual shell is ready here, but the workout creation workflow still needs to be implemented."
    />
  )
}

export default CreateWorkout
