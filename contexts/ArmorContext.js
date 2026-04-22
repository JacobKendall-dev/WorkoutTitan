import {createContext, useState} from 'react';
import {resolveAsset} from '../utils/resolveAsset'

export const ArmorContext = createContext();

export const ArmorProvider = ({children}) => {
    const [armor, setArmor] = useState({
        name: "Default Grey",
        color: "gr",
        item: "non",
    })

    const updateArmor = (updates) => {
        setArmor(prev => ({
            ...prev,
            ...updates
        }))
    }

    return (
        <ArmorContext.Provider value = {{
            armor,
            updateArmor}}>
            {children}
        </ArmorContext.Provider>
    )
}