import React from 'react'
import PlaceholderScreen from '../../../../components/PlaceholderScreen'

const BackW = () => {
  return (
    <PlaceholderScreen
      title="Back With Weights"
      subtitle="A dedicated screen for pulls, rows, and back-focused lifting sessions."
      activityConfig={{
        categoryId: 'weights',
        workoutName: 'Back',
        buttonLabel: 'Start Back Session',
      }}
      highlights={[
        'Support lat, row, and pull variation tracking with set-by-set logging.',
        'Show recent back-day personal bests in the same soft-card layout used across the app.',
        'Keep this route visually aligned with the kitchen and workout overview pages.',
      ]}
      note="The styling is in place here now, but the actual back workout experience still needs to be implemented."
    />
  )
}

export default BackW
