import React from 'react'
import PlaceholderScreen from '../../../../components/PlaceholderScreen'

const LowerbodyC = () => {
  return (
    <PlaceholderScreen
      title="Lower Body Calisthenics"
      subtitle="A route for bodyweight leg work, mobility, and explosive lower-body training."
      activityConfig={{
        categoryId: 'calisthenics',
        workoutName: 'Lower body',
        buttonLabel: 'Start Lower Body Session',
      }}
      highlights={[
        'Track single-leg strength, jumps, and endurance work without leaving the shared app style.',
        'Reserve space for progression notes and rep targets.',
        'Match the warm palette and rounded-card treatment from the kitchen pages.',
      ]}
      note="This screen is styled now, but the actual lower body calisthenics program still needs to be connected."
    />
  )
}

export default LowerbodyC
