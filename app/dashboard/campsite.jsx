import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AppShell from '../../components/AppShell'
import { CleaningCampsiteCard, CookingCampsiteCard } from '../../components/AvatarCard'
import SectionCard from '../../components/SectionCard'
import { appTheme } from '../../constants/appTheme'

const SCENES = [
  {
    id: 'cleaning',
    title: 'Cleaning Campsite',
    description: '',
    accent: '#f4ddd6',
    renderPreview: (style) => <CleaningCampsiteCard style={style} cardStyle={styles.previewAvatarCard} />,
  },
  {
    id: 'cooking',
    title: 'Cooking Campsite',
    description: '',
    accent: '#f7d9cb',
    renderPreview: (style) => <CookingCampsiteCard style={style} cardStyle={styles.previewAvatarCard} />,
  },
]

const CAMP_FEATURES = [
  'Layered scene art built from hats, knight colors, tent patterns, and sky variations.',
  'A dedicated home for future campsite customization and unlock previews.',
  'A matching card layout so this screen feels at home beside Kitchen and Workout.',
]

const Campsite = () => {
  const [activeScene, setActiveScene] = useState(SCENES[0].id)

  const selectedScene = SCENES.find((scene) => scene.id === activeScene) ?? SCENES[0]

  return (
    <AppShell
      title="Campsite"
      subtitle="Preview your campsite"
    >
      <SectionCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Scene Preview</Text>
        <Text style={styles.heroTitle}>{selectedScene.title}</Text>
        <Text style={styles.heroBody}>{selectedScene.description}</Text>

        <View style={styles.previewCard}>
          {selectedScene.renderPreview(styles.previewImage)}
        </View>
      </SectionCard>

      <SectionCard style={styles.selectorCard}>
        <Text style={styles.sectionTitle}>Choose a scene</Text>
        <View style={styles.selectorGrid}>
          {SCENES.map((scene) => {
            const isActive = scene.id === activeScene

            return (
              <Pressable
                key={scene.id}
                onPress={() => setActiveScene(scene.id)}
                style={[
                  styles.sceneButton,
                  isActive ? styles.sceneButtonActive : null,
                ]}
              >
                <View style={[styles.sceneSwatch, { backgroundColor: scene.accent }]} />
                <View style={styles.sceneCopy}>
                  <Text style={[styles.sceneTitle, isActive ? styles.sceneTitleActive : null]}>
                    {scene.title}
                  </Text>
                  <Text style={styles.sceneDescription}>{scene.description}</Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </SectionCard>

      
    </AppShell>
  )
}

export default Campsite

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: 16,
  },
  eyebrow: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: appTheme.colors.title,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroBody: {
    color: appTheme.colors.body,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  previewCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 250,
    overflow: 'hidden',
    padding: 0,
  },
  previewImage: {
    width: '100%',
    minHeight: 250,
  },
  previewAvatarCard: {
    width: '100%',
    height: 250,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  selectorCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 16,
  },
  sectionTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  selectorGrid: {
    gap: 12,
  },
  sceneButton: {
    alignItems: 'center',
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  sceneButtonActive: {
    borderColor: '#d8895d',
    backgroundColor: '#fff2eb',
  },
  sceneSwatch: {
    borderRadius: 14,
    height: 48,
    width: 48,
  },
  sceneCopy: {
    flex: 1,
  },
  sceneTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  sceneTitleActive: {
    color: '#7a3f30',
  },
  sceneDescription: {
    color: '#775a56',
    fontSize: 13,
    lineHeight: 19,
  },
  infoCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  featureList: {
    gap: 12,
  },
  featureRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  featureDot: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    height: 10,
    marginTop: 6,
    width: 10,
  },
  featureText: {
    color: '#6a514d',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
})
