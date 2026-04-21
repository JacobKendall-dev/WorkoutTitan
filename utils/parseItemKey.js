import {parseArmorKey} from "../utils/parseArmorKey"
import {parseEnvironmentKey} from "../utils/parseEnvironmentKey"

export const parseKey = ({ category, key}) => {
    switch(category) {
        case "armor":
            return parseArmorKey(key)
        case "environmentKey":
            return parseCleaningKey(key)
        default:
            return null
    }
}