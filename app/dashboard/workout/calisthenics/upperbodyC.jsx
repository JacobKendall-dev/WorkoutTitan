import React from 'react'
import PlaceholderScreen from '../../../../components/PlaceholderScreen'

const UpperbodyC = () => {
  return (
    <PlaceholderScreen
      title="Upper Body Calisthenics"
      subtitle="A bodyweight training route for pushing, pulling, and skill progressions."
      activityConfig={{
        categoryId: 'calisthenics',
        workoutName: 'Upper body',
        buttonLabel: 'Start Upper Body Session',
      }}
      highlights={[
        'Support push-up, dip, pull-up, and press progressions in one place.',
        'Leave room for bodyweight-based reps, holds, and progression notes.',
        'Keep the same rounded, warm card styling used across the app.',
      ]}
      note="The visual treatment is ready here, but the upper body calisthenics workflow still needs to be added."
    />
  )
}

export default UpperbodyC
