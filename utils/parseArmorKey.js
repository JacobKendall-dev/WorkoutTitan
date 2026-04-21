

export const parseArmorKey = (key) => {
    if (!key || key.length <3) return null

    const color = key.slice (0,1)
    const item = key.slice (2)

    return{color, item}
}