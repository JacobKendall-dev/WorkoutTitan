import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Sheet = () => {
  const { data } = useLocalSearchParams()
  const router = useRouter()
  const category = JSON.parse(data)

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Handle */}
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.eyebrow}>Category</Text>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.lastSession}>Last session: {category.lastSession}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{category.sessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 {category.streak}</Text>
            <Text style={styles.statLabel}>Week streak</Text>
          </View>
        </View>

        {/* PB Badge */}
        {category.pb && (
          <View style={styles.pbRow}>
            <Text style={styles.pbLabel}>{category.pbLabel ?? 'Personal best'}</Text>
            <Text style={styles.pbValue}>{category.pb}</Text>
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Choose a workout</Text>

        {/* Workout Links */}
        {category.workouts.map((workout) => (
          <Link key={workout.href} href={workout.href} asChild>
            <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View>
                <Text style={styles.rowName}>{workout.label}</Text>
                <Text style={styles.rowMeta}>{workout.meta}</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>
          </Link>
        ))}

      </ScrollView>
    </SafeAreaView>
  )
}

export default Sheet

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
  },
  container: {
    padding: 20,
    paddingTop: 12,
  },
  eyebrow: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  lastSession: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    borderRadius: 12,
    padding: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  pbRow: {
    backgroundColor: '#F3E7FE',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pbLabel: {
    fontSize: 11,
    color: '#7c3aed',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pbValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5b21b6',
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  rowPressed: {
    backgroundColor: '#fafafa',
  },
  rowName: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
    marginBottom: 2,
  },
  rowMeta: {
    fontSize: 11,
    color: '#aaa',
  },
  rowArrow: {
    fontSize: 20,
    color: '#ccc',
  },
})