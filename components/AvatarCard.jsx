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

const buildCookingLayers = ({
  hatKey,
  knightColorKey,
  tentPatternKey,
  tentAndLeavesKey,
  groundAndSkyKey,
  layerStyles,
}) => [
  {
    key: 'cookingGroundAndSky',
    source: resolveAsset(ASSETS.cookingGroundAndSky, groundAndSkyKey),
    style: layerStyles?.cookingGroundAndSky,
  },
  {
    key: 'cookingTentAndLeaves',
    source: resolveAsset(ASSETS.cookingTentAndLeaves, tentAndLeavesKey),
    style: layerStyles?.cookingTentAndLeaves,
  },
  {
    key: 'cookingTentPatterns',
    source: resolveAsset(ASSETS.cookingTentPatterns, tentPatternKey),
    style: layerStyles?.cookingTentPatterns,
  },
  {
    key: 'cookingKnightColor',
    source: resolveAsset(ASSETS.cookingKnightColor, knightColorKey),
    style: layerStyles?.cookingKnightColor,
  },
  {
    key: 'cookingHat',
    source: resolveAsset(ASSETS.cookingHat, hatKey),
    style: layerStyles?.cookingHat,
  },
]

const buildCleaningLayers = ({
  hatKey,
  knightColorKey,
  tentPatternKey,
  tentAndLeavesKey,
  groundAndSkyKey,
  layerStyles,
}) => [
  {
    key: 'cleaningGroundAndSky',
    source: resolveAsset(ASSETS.cleaningGroundAndSky, groundAndSkyKey),
    style: layerStyles?.cleaningGroundAndSky,
  },
  {
    key: 'cleaningTentAndLeaves',
    source: resolveAsset(ASSETS.cleaningTentAndLeaves, tentAndLeavesKey),
    style: layerStyles?.cleaningTentAndLeaves,
  },
  {
    key: 'cleaningTentPatterns',
    source: resolveAsset(ASSETS.cleaningTentPatterns, tentPatternKey),
    style: layerStyles?.cleaningTentPatterns,
  },
  {
    key: 'cleaningKnightColor',
    source: resolveAsset(ASSETS.cleaningKnightColor, knightColorKey),
    style: layerStyles?.cleaningKnightColor,
  },
  {
    key: 'cleaningHat',
    source: resolveAsset(ASSETS.cleaningHat, hatKey),
    style: layerStyles?.cleaningHat,
  },
  {
    key: 'campfire',
    source: ASSETS.campfire,
    style: layerStyles?.campfire,
  },
]

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

export function CookingCard({
  hatKey,
  knightColorKey,
  tentPatternKey,
  tentAndLeavesKey,
  groundAndSkyKey,
  layerStyles,
  style,
  cardStyle,
  imageStyle,
}) {
  const layers = buildCookingLayers({
    hatKey,
    knightColorKey,
    tentPatternKey,
    tentAndLeavesKey,
    groundAndSkyKey,
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

export function CleaningCard({
  hatKey,
  knightColorKey,
  tentPatternKey,
  tentAndLeavesKey,
  groundAndSkyKey,
  layerStyles,
  style,
  cardStyle,
  imageStyle,
}) {
  const layers = buildCleaningLayers({
    hatKey,
    knightColorKey,
    tentPatternKey,
    tentAndLeavesKey,
    groundAndSkyKey,
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
