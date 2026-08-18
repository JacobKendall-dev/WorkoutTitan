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
    accent: '#f4ddd6',
    renderPreview: (style, avatarStyle) => (
      <CleaningCampsiteCard style={style} cardStyle={avatarStyle} />
    ),
  },
  {
    id: 'cooking',
    title: 'Cooking Campsite',
    accent: '#f7d9cb',
    renderPreview: (style, avatarStyle) => (
      <CookingCampsiteCard style={style} cardStyle={avatarStyle} />
    ),
  },
]

const Campsite = () => {
  const [activeScene, setActiveScene] = useState(SCENES[0].id)

  const selectedScene = SCENES.find((scene) => scene.id === activeScene) ?? SCENES[0]

  return (
    <AppShell title="Campsite" subtitle="Preview your campsite">
      <SectionCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Scene Preview</Text>
        <Text style={styles.heroTitle}>{selectedScene.title}</Text>

        <View style={styles.previewCard}>
          {selectedScene.renderPreview(styles.previewImage, styles.previewAvatarCard)}
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
                style={[styles.sceneButton, isActive ? styles.sceneButtonActive : null]}
              >
                <View style={[styles.sceneSwatch, { backgroundColor: scene.accent }]} />
                <Text
                  style={[styles.sceneTitle, isActive ? styles.sceneTitleActive : null]}
                  numberOfLines={1}
                >
                  {scene.title}
                </Text>
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
    marginBottom: 12,
  },
  eyebrow: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: appTheme.colors.title,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  previewCard: {
    height: 240,
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 0,
  },
  previewImage: {
    width: '100%',
    height: 240,
  },
  previewAvatarCard: {
    width: '100%',
    height: 240,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  selectorCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 0,
  },
  sectionTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  selectorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sceneButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  sceneButtonActive: {
    borderColor: '#d8895d',
    backgroundColor: '#fff2eb',
  },
  sceneSwatch: {
    borderRadius: 12,
    height: 36,
    width: 36,
  },
  sceneTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  sceneTitleActive: {
    color: '#7a3f30',
  },
})