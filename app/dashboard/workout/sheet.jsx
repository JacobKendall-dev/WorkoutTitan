import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'

const Sheet = () => {
  const { data } = useLocalSearchParams()
  const category = JSON.parse(data)

  return (
    <AppShell scroll={false} contentContainerStyle={styles.container}>
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      <SectionCard style={styles.headerCard}>
        <Text style={styles.eyebrow}>Category</Text>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.lastSession}>Last session: {category.lastSession}</Text>
      </SectionCard>

      <View style={styles.statsRow}>
        <SectionCard style={styles.statCard}>
          <Text style={styles.statValue}>{category.sessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </SectionCard>
        <SectionCard style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {category.streak}</Text>
          <Text style={styles.statLabel}>Week streak</Text>
        </SectionCard>
      </View>

      {category.pb && (
        <View style={styles.pbRow}>
          <Text style={styles.pbLabel}>{category.pbLabel ?? 'Personal best'}</Text>
          <Text style={styles.pbValue}>{category.pb}</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Choose a workout</Text>

      <View style={styles.workoutList}>
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
      </View>
    </AppShell>
  )
}

export default Sheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  headerCard: {
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 12,
    color: '#f7d9c6',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff7f2',
    marginBottom: 4,
  },
  lastSession: {
    fontSize: 13,
    color: '#dac0b8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#5c3238',
  },
  statLabel: {
    fontSize: 11,
    color: '#7b625d',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  pbRow: {
    backgroundColor: '#f7d9cb',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  pbLabel: {
    fontSize: 11,
    color: '#7d2f1f',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  pbValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5c3238',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#f4ddd6',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  workoutList: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ead8d2',
  },
  rowPressed: {
    backgroundColor: '#f1ded8',
  },
  rowName: {
    fontSize: 15,
    color: '#5c3238',
    fontWeight: '700',
    marginBottom: 3,
  },
  rowMeta: {
    fontSize: 12,
    color: '#7b625d',
  },
  rowArrow: {
    fontSize: 20,
    color: '#8f6b64',
  },
})

