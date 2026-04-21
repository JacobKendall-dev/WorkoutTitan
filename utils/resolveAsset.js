import { ASSETS } from "../constants/Customizables"
import { parseArmorKey} from "../utils/parseArmorKey"
import { parseEnvironmentKey} from "../utils/parseEnvironmentKey"


const categoryMap ={
    armor: {
        requiresDirection: true,
        parser: parseArmorKey,
        buildKey: ({color,item}) => `${color}${item}`,
        map: {
            front: ASSETS.armoireFront,
            left: ASSETS.armoireLeft,
            right: ASSETS.armoireRight,
            back: ASSETS.armoireBack,
        },
    },
    cleaningKnightColor:{
        requiresDirection: false,
        map: ASSETS.cleaningKnightColor
    },
    cleaningHat: {
        requiresDirection: false,
        map: ASSETS.cleaningHat
    },
    cleaningGroundAndSky:{
        requiresDirection: false,
        map: ASSETS.cleaningGroundAndSky
    },
    cleaningTentAndLeaves:{
        requiresDirection: false,
        map: ASSETS.cleaningTentAndLeaves
    },
    cleaningTentAndPatterns: {
        requiresDirection: false,
        map: ASSETS.cleaningTentPatterns
    },    cookingKnightColor:{
        requiresDirection: false,
        map: ASSETS.cookingKnightColor
    },
    cookingHat: {
        requiresDirection: false,
        map: ASSETS.cookingHat
    },
    cookingGroundAndSky:{
        requiresDirection: false,
        map: ASSETS.cookingGroundAndSky
    },
    cookingTentAndLeaves:{
        requiresDirection: false,
        map: ASSETS.cookingTentAndLeaves
    },
    cookingTentAndPatterns: {
        requiresDirection: false,
        map: ASSETS.cookingTentPatterns
    },
    }

export const resolveAsset = ({ category, direction, key , parsed}) => {
    const config = categoryMap[category]

    if(!config) return null
    
    let finalKey = key

    if (config.parser) {
        const parsedData = parsed || config.parser(key)

        if (!parsedData) return null

        finalKey = config.buildKey
        ? config.buildKey(parsedData)
        : key
    }

    if (config.requiresDirection && direction) {
        return config.map[direction]?.[finalKey] || null
    }

    return config.map?.[finalKey] || null
}