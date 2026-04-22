import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ASSETS } from '../constants/Customizables'


const resolveSceneAsset = (assetGroup, key) => {
  if (!assetGroup) return null

  const fallbackKey = Object.keys(assetGroup ?? {})[0]
  const resolvedKey = key ?? fallbackKey

  return assetGroup?.[resolvedKey] ?? assetGroup?.[fallbackKey] ?? null
}


const normalizeLayers = (layers) => layers


const buildCleaningCampsiteLayers = ({
  campfireSource,
  cleaningHatKey,
  cleaningKnightColorKey,
  cleaningTentPatternsKey,
  cleaningTentAndLeavesKey,
  cleaningGroundAndSkyKey,
  layerStyles,
}) =>
  normalizeLayers([
    {
      key: 'cleaningGroundAndSky',
      source: resolveSceneAsset(ASSETS.cleaningGroundAndSky, cleaningGroundAndSkyKey),
      style: layerStyles?.cleaningGroundAndSky,
    },
    {
      key: 'cleaningTentAndLeaves',
      source: resolveSceneAsset(ASSETS.cleaningTentAndLeaves, cleaningTentAndLeavesKey),
      style: layerStyles?.cleaningTentAndLeaves,
    },
    {
      key: 'cleaningTentPatterns',
      source: resolveSceneAsset(ASSETS.cleaningTentPatterns, cleaningTentPatternsKey),
      style: layerStyles?.cleaningTentPatterns,
    },
    {
      key: 'cleaningKnightColor',
      source: resolveSceneAsset(ASSETS.cleaningKnightColor, cleaningKnightColorKey),
      style: layerStyles?.cleaningKnightColor,
    },
    {
      key: 'cleaningHat',
      source: resolveSceneAsset(ASSETS.cleaningHat, cleaningHatKey),
      style: layerStyles?.cleaningHat,
    },
    {
      key: 'campfire',
      source: campfireSource ?? ASSETS.campfire,
      style: layerStyles?.campfire,
    },
  ])


const buildCookingCampsiteLayers = ({
  cookingHatKey,
  cookingKnightColorKey,
  cookingTentPatternsKey,
  cookingTentAndLeavesKey,
  cookingGroundAndSkyKey,
  layerStyles,
}) =>
  normalizeLayers([
    {
      key: 'cookingGroundAndSky',
      source: resolveSceneAsset(ASSETS.cookingGroundAndSky, cookingGroundAndSkyKey),
      style: layerStyles?.cookingGroundAndSky,
    },
    {
      key: 'cookingTentAndLeaves',
      source: resolveSceneAsset(ASSETS.cookingTentAndLeaves, cookingTentAndLeavesKey),
      style: layerStyles?.cookingTentAndLeaves,
    },
    {
      key: 'cookingTentPatterns',
      source: resolveSceneAsset(ASSETS.cookingTentPatterns, cookingTentPatternsKey),
      style: layerStyles?.cookingTentPatterns,
    },
    {
      key: 'cookingKnightColor',
      source: resolveSceneAsset(ASSETS.cookingKnightColor, cookingKnightColorKey),
      style: layerStyles?.cookingKnightColor,
    },
    {
      key: 'cookingHat',
      source: resolveSceneAsset(ASSETS.cookingHat, cookingHatKey),
      style: layerStyles?.cookingHat,
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
        ?.filter((layer) => layer?.source)
        .map((layer, index) => (
          <Image
            key={layer.key ?? index}
            source={layer.source}
            resizeMode={layer.resizeMode ?? 'contain'}
            style={[
              styles.layer,
              imageStyle,
              layer.style,
              { zIndex: index }
            ]}
          />
        ))}
    </View>
  )
}


export function CleaningCampsiteCard(props) {
  const layers = buildCleaningCampsiteLayers({
    campfireSource: props.campfireSource,
    cleaningHatKey: props.cleaningHatKey ?? props.hatKey,
    cleaningKnightColorKey: props.cleaningKnightColorKey ?? props.knightColorKey,
    cleaningTentPatternsKey: props.cleaningTentPatternsKey ?? props.tentPatternKey,
    cleaningTentAndLeavesKey: props.cleaningTentAndLeavesKey ?? props.tentAndLeavesKey,
    cleaningGroundAndSkyKey: props.cleaningGroundAndSkyKey ?? props.groundAndSkyKey,
    layerStyles: props.layerStyles,
  })

  return (
    <LayeredAvatarCard
      layers={layers}
      style={props.style}
      cardStyle={props.cardStyle}
      imageStyle={props.imageStyle}
    />
  )
}

export function CookingCampsiteCard(props) {
  const layers = buildCookingCampsiteLayers({
    cookingHatKey: props.cookingHatKey ?? props.hatKey,
    cookingKnightColorKey: props.cookingKnightColorKey ?? props.knightColorKey,
    cookingTentPatternsKey: props.cookingTentPatternsKey ?? props.tentPatternKey,
    cookingTentAndLeavesKey: props.cookingTentAndLeavesKey ?? props.tentAndLeavesKey,
    cookingGroundAndSkyKey: props.cookingGroundAndSkyKey ?? props.groundAndSkyKey,
    layerStyles: props.layerStyles,
  })

  return (
    <LayeredAvatarCard
      layers={layers}
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