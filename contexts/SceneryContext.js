import { createContext, useMemo, useState } from "react"
import { ASSETS } from "../constants/Customizables"

export const SceneryContext = createContext()

const resolveSceneLayer = ({ map, key }) => {
  if (!map) return null

  if (!key) {
    const fallbackKey = Object.keys(map)[0]
    return map[fallbackKey] ?? null
  }

  return map[key] ?? null
}

export const SceneryProvider = ({ children }) => {
  const [scenery, setScenery] = useState({
    hatKey: "BaseballCap",
    groundKey: "DefaultGround",
    skyKey: "BlueSky",
  })

  const updateScenery = (updates) => {
    setScenery((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const layers = useMemo(() => {
    return [
      {
        key: "sky",
        source: resolveSceneLayer({
          map: ASSETS.scenerySky,
          key: scenery.skyKey,
        }),
      },
      {
        key: "ground",
        source: resolveSceneLayer({
          map: ASSETS.sceneryGround,
          key: scenery.groundKey,
        }),
      },
      {
        key: "hat",
        source: resolveSceneLayer({
          map: ASSETS.armorUnlocks,
          key: scenery.hatKey,
        }),
      },
    ]
  }, [scenery])

  return (
    <SceneryContext.Provider
      value={{
        scenery,
        updateScenery,
        layers,
      }}
    >
      {children}
    </SceneryContext.Provider>
  )
}