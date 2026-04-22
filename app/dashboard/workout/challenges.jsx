import React from 'react'
import PlaceholderScreen from '../../../components/PlaceholderScreen'

const Challenges = () => {
  return (
    <PlaceholderScreen
      title="Challenges"
      subtitle="A motivating screen for personal goals, streaks, and event-based workout pushes."
      highlights={[
        'Feature short-term fitness goals, seasonal events, or personal mini-quests.',
        'Track completions and reflect challenge wins in the leaderboard later on.',
        'Use the same warm, rounded, high-contrast design language as the meal-planning screens.',
      ]}
      note="The challenge system itself is still pending, but this page now matches the app’s established visual direction."
    />
  )
}

export default Challenges
