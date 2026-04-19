import {createContext, useState} from 'react';

export const ArmorContext = createContext();

export const ArmorProvider = ({children}) => {
    const [armor, setArmor] = useState({
        name: "Default Grey",
        asset: grnon,
        color: 'grey'
    });

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