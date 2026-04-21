import React from 'react'
import PlaceholderScreen from '../../../../components/PlaceholderScreen'

const Stretches = () => {
  return (
    <PlaceholderScreen
      title="Stretches"
      subtitle="A mobility and flexibility screen for cooldowns, recovery, and movement prep."
      activityConfig={{
        categoryId: 'calisthenics',
        workoutName: 'Stretches',
        buttonLabel: 'Start Stretch Session',
      }}
      highlights={[
        'Support guided stretch flows, mobility checkpoints, and session notes.',
        'Keep the same warm, camp-style visual polish as the kitchen tools.',
        'Leave room for timed holds and recovery streaks in a future iteration.',
      ]}
      note="This route now matches the rest of the app visually, but the stretch content is still pending."
    />
  )
}

export default Stretches
