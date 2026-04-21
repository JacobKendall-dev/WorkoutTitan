import React from 'react'
import PlaceholderScreen from '../../../../components/PlaceholderScreen'

const Core = () => {
  return (
    <PlaceholderScreen
      title="Core"
      subtitle="A focused training screen for trunk strength, holds, and control work."
      activityConfig={{
        categoryId: 'calisthenics',
        workoutName: 'Core',
        buttonLabel: 'Start Core Session',
      }}
      highlights={[
        'Track planks, hollow holds, leg raises, and advanced core progressions.',
        'Show progress clearly in the same visual system used across the app.',
        'Keep space for benchmark stats and movement notes once the feature is built.',
      ]}
      note="The styling pass is complete here, but the core workout flow is still a future step."
    />
  )
}

export default Core
