import React, { useMemo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import AppShell from '../../components/AppShell'
import SectionCard from '../../components/SectionCard'
import { ASSETS } from '../../constants/Customizables'
import { UNLOCKS } from '../../constants/Unlocks'
import { appTheme } from '../../constants/appTheme'

const SWATCH_OPTIONS = Object.entries(UNLOCKS.armorSwatches)
  .slice(0, 6)
  .map(([key, source]) => ({
    key,
    label: key.replace('Armor_', '').replace('_', ' '),
    source,
  }))

const getFirstAssetKey = (assetGroup) => Object.keys(assetGroup ?? {})[0]

const resolveAsset = (assetGroup, assetKey) => {
  if (!assetGroup) return null
  if (typeof assetGroup === 'number') return assetGroup

  const fallbackKey = getFirstAssetKey(assetGroup)
  return assetGroup[assetKey] ?? assetGroup[fallbackKey] ?? null
}

const Armoire = () => {
  const [activeSwatchKey, setActiveSwatchKey] = useState(SWATCH_OPTIONS[0]?.key ?? null)

  const previewSource = useMemo(() => {
    const suffix = (activeSwatchKey ?? '').replace('Armor_', '').toLowerCase()
    return resolveAsset(ASSETS.armoireFront, `${suffix}non`)
  }, [activeSwatchKey])

  const activeLabel = SWATCH_OPTIONS.find((item) => item.key === activeSwatchKey)?.label ?? 'Default'

  return (
    <AppShell
      title="Armoire"
      subtitle="Change your wardrobe"
    >
      <SectionCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Wardrobe Preview</Text>
        <Text style={styles.heroTitle}>{activeLabel} Armor</Text>
        <Text style={styles.heroBody}>
          
        </Text>

        <View style={styles.previewStage}>
          <Image source={ASSETS.platform} resizeMode="contain" style={styles.platformImage} />
          {previewSource ? (
            <Image source={previewSource} resizeMode="contain" style={styles.armorImage} />
          ) : null}
        </View>
      </SectionCard>

      <SectionCard style={styles.swatchCard}>
        <Text style={styles.sectionTitle}>Armor swatches</Text>
        <View style={styles.swatchGrid}>
          {SWATCH_OPTIONS.map((swatch) => {
            const isActive = swatch.key === activeSwatchKey

            return (
              <Pressable
                key={swatch.key}
                onPress={() => setActiveSwatchKey(swatch.key)}
                style={[styles.swatchButton, isActive ? styles.swatchButtonActive : null]}
              >
                <Image source={swatch.source} resizeMode="contain" style={styles.swatchImage} />
                <Text style={[styles.swatchLabel, isActive ? styles.swatchLabelActive : null]}>
                  {swatch.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </SectionCard>

      
    </AppShell>
  )
}

export default Armoire

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
  previewStage: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderColor: '#ceb1a8',
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 280,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 16,
  },
  platformImage: {
    bottom: 16,
    height: 140,
    position: 'absolute',
    width: '88%',
  },
  armorImage: {
    height: 210,
    width: '72%',
  },
  swatchCard: {
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
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatchButton: {
    alignItems: 'center',
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 130,
    padding: 12,
    width: '48%',
  },
  swatchButtonActive: {
    backgroundColor: '#fff2eb',
    borderColor: '#d8895d',
  },
  swatchImage: {
    height: 64,
    marginBottom: 10,
    width: '100%',
  },
  swatchLabel: {
    color: appTheme.colors.primaryDeep,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  swatchLabelActive: {
    color: '#7a3f30',
  },
  infoCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  infoText: {
    color: '#6a514d',
    fontSize: 14,
    lineHeight: 21,
  },
})
