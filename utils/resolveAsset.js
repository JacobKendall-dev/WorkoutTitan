import { ASSETS } from "../constants/Customizables"


const categoryMap ={
    armor: {
        requiresDirection: true,
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

export const resolveAsset = ({ category, direction, key }) => {
    const config = categoryMap[category]

    if(!config) return null
    
    if (config.requiresDirection && direction) {
        return config.map[direction]?.[key] || null
    }

    return config.map?.[key] || null
}