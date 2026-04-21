import React from 'react'
import PlaceholderScreen from '../../../components/PlaceholderScreen'

const Calendar = () => {
  return (
    <PlaceholderScreen
      title="Workout Calendar"
      subtitle="A planning view for seeing consistency, rest days, and logged sessions over time."
      highlights={[
        'Visualize training frequency and rest/recovery patterns by week or month.',
        'Connect session history from the exercise logger to meaningful calendar milestones.',
        'Keep the same soft-card and campfire color treatment used across the kitchen experience.',
      ]}
      note="This page is now visually aligned with the rest of the app, but the calendar data layer still needs to be connected."
    />
  )
}

export default Calendar
