import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ASSETS } from '../constants/Customizables'

const getFirstAssetKey = (assetGroup) => Object.keys(assetGroup ?? {})[0]

const resolveAsset = (assetGroup, assetKey) => {
  if (!assetGroup) return null

  if (typeof assetGroup === 'number') {
    return assetGroup
  }

  const fallbackKey = getFirstAssetKey(assetGroup)
  const resolvedKey = assetKey ?? fallbackKey

  return assetGroup[resolvedKey] ?? assetGroup[fallbackKey] ?? null
}

const normalizeLayers = (layers) => [...layers].reverse()

const buildCleaningCampsiteLayers = ({
  campfireSource,
  cleaningHatKey,
  cleaningKnightColorKey,
  cleaningTentPatternsKey,
  cleaningTentAndLeavesKey,
  cleaningGroundAndSkyKey,
  layerStyles,
}) => normalizeLayers([
  {
    key: 'campfire',
    source: campfireSource ?? ASSETS.campfire,
    style: layerStyles?.campfire,
  },
  {
    key: 'cleaningHat',
    source: resolveAsset(ASSETS.cleaningHat, cleaningHatKey),
    style: layerStyles?.cleaningHat,
  },
  {
    key: 'cleaningKnightColor',
    source: resolveAsset(ASSETS.cleaningKnightColor, cleaningKnightColorKey),
    style: layerStyles?.cleaningKnightColor,
  },
  {
    key: 'cleaningTentPatterns',
    source: resolveAsset(ASSETS.cleaningTentPatterns, cleaningTentPatternsKey),
    style: layerStyles?.cleaningTentPatterns,
  },
  {
    key: 'cleaningTentAndLeaves',
    source: resolveAsset(ASSETS.cleaningTentAndLeaves, cleaningTentAndLeavesKey),
    style: layerStyles?.cleaningTentAndLeaves,
  },
  {
    key: 'cleaningGroundAndSky',
    source: resolveAsset(ASSETS.cleaningGroundAndSky, cleaningGroundAndSkyKey),
    style: layerStyles?.cleaningGroundAndSky,
  },
])

const buildCookingCampsiteLayers = ({
  cookingHatKey,
  cookingKnightColorKey,
  cookingTentPatternsKey,
  cookingTentAndLeavesKey,
  cookingGroundAndSkyKey,
  layerStyles,
}) => normalizeLayers([
  {
    key: 'cookingHat',
    source: resolveAsset(ASSETS.cookingHat, cookingHatKey),
    style: layerStyles?.cookingHat,
  },
  {
    key: 'cookingKnightColor',
    source: resolveAsset(ASSETS.cookingKnightColor, cookingKnightColorKey),
    style: layerStyles?.cookingKnightColor,
  },
  {
    key: 'cookingTentPatterns',
    source: resolveAsset(ASSETS.cookingTentPatterns, cookingTentPatternsKey),
    style: layerStyles?.cookingTentPatterns,
  },
  {
    key: 'cookingTentAndLeaves',
    source: resolveAsset(ASSETS.cookingTentAndLeaves, cookingTentAndLeavesKey),
    style: layerStyles?.cookingTentAndLeaves,
  },
  {
    key: 'cookingGroundAndSky',
    source: resolveAsset(ASSETS.cookingGroundAndSky, cookingGroundAndSkyKey),
    style: layerStyles?.cookingGroundAndSky,
  },
])

function LayeredAvatarCard({
  layers,
  style,
  cardStyle,
  imageStyle,
}) {
  return (
    <View style={[styles.card, style, cardStyle]}>
      {layers
        .filter((layer) => layer?.source)
        .map((layer) => (
          <Image
            key={layer.key}
            source={layer.source}
            resizeMode={layer.resizeMode ?? 'contain'}
            style={[styles.layer, imageStyle, layer.style]}
          />
        ))}
    </View>
  )
}

export function CookingCampsiteCard({
  cookingHatKey,
  cookingKnightColorKey,
  cookingTentPatternsKey,
  cookingTentAndLeavesKey,
  cookingGroundAndSkyKey,
  layerStyles,
  style,
  cardStyle,
  imageStyle,
}) {
  const layers = buildCookingCampsiteLayers({
    cookingHatKey,
    cookingKnightColorKey,
    cookingTentPatternsKey,
    cookingTentAndLeavesKey,
    cookingGroundAndSkyKey,
    layerStyles,
  })

  return (
    <LayeredAvatarCard
      layers={layers}
      style={style}
      cardStyle={cardStyle}
      imageStyle={imageStyle}
    />
  )
}

export function CleaningCampsiteCard({
  campfireSource,
  cleaningHatKey,
  cleaningKnightColorKey,
  cleaningTentPatternsKey,
  cleaningTentAndLeavesKey,
  cleaningGroundAndSkyKey,
  layerStyles,
  style,
  cardStyle,
  imageStyle,
}) {
  const layers = buildCleaningCampsiteLayers({
    campfireSource,
    cleaningHatKey,
    cleaningKnightColorKey,
    cleaningTentPatternsKey,
    cleaningTentAndLeavesKey,
    cleaningGroundAndSkyKey,
    layerStyles,
  })

  return (
    <LayeredAvatarCard
      layers={layers}
      style={style}
      cardStyle={cardStyle}
      imageStyle={imageStyle}
    />
  )
}

export function CookingCard(props) {
  return (
    <CookingCampsiteCard
      cookingHatKey={props.cookingHatKey ?? props.hatKey}
      cookingKnightColorKey={props.cookingKnightColorKey ?? props.knightColorKey}
      cookingTentPatternsKey={props.cookingTentPatternsKey ?? props.tentPatternKey}
      cookingTentAndLeavesKey={props.cookingTentAndLeavesKey ?? props.tentAndLeavesKey}
      cookingGroundAndSkyKey={props.cookingGroundAndSkyKey ?? props.groundAndSkyKey}
      layerStyles={props.layerStyles}
      style={props.style}
      cardStyle={props.cardStyle}
      imageStyle={props.imageStyle}
    />
  )
}

export function CleaningCard(props) {
  return (
    <CleaningCampsiteCard
      campfireSource={props.campfireSource}
      cleaningHatKey={props.cleaningHatKey ?? props.hatKey}
      cleaningKnightColorKey={props.cleaningKnightColorKey ?? props.knightColorKey}
      cleaningTentPatternsKey={props.cleaningTentPatternsKey ?? props.tentPatternKey}
      cleaningTentAndLeavesKey={props.cleaningTentAndLeavesKey ?? props.tentAndLeavesKey}
      cleaningGroundAndSkyKey={props.cleaningGroundAndSkyKey ?? props.groundAndSkyKey}
      layerStyles={props.layerStyles}
      style={props.style}
      cardStyle={props.cardStyle}
      imageStyle={props.imageStyle}
    />
  )
}

export default LayeredAvatarCard

const styles = StyleSheet.create({
  card: {
    width: '83%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: '#ddd',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
})

