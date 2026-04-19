import {createContext, useState} from 'react';

export const SceneContext = createContext();

export const SceneProvider = ({children}) => {
    const [scene, setScene] = useState({
        season: {
            seasonName: null,
            skyName: "Sunny",
            skyAsset: "sn",
        },
        tent: {
            tentPatternName: "Default",
            tentPatternAsset: null,
            tentColorName: "Default",
            tentColor: "nonnon",
        }
    });

    const updateSeason = (updates) => {
        setScene(prev => ({
            ...prev,
            season: {
                ...prev.season,
                ...updates
            }
        }))
    }

    const updateTent = (updates) => {
        setScene(prev => ({
            ...prev,
            tent: {
                ...prev.tent,
                ...updates
            }
        }))
    }

    return (
        <SceneContext.Provider value = {{
            updateSeason,
            updateTent}}>
            {children}
        </SceneContext.Provider>
    )
}