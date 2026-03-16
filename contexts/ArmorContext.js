import {createContext, useState} from 'react';

export const ArmorContext = createContext();

export const ArmorProvider = ({children}) => {
    const [armor, setArmor] = useState({
        name: "",
        asset: null,
    });

    const updateArmorAsset = (newAsset) => {
        setArmor(prev => ({
            ...prev,
            asset: newAsset
        }))
    }

    return (
        <ArmorContext.Provider value = {{armor, setArmor}}>
            {childern}
        </ArmorContext.Provider>
    )
}