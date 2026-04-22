import {View, Pressable, Text, StyleSheet} from "react-native"

import ToggleMenuController from "./ToggleMenuController"


{/*Props buttonStyle, textStyle, menuStyle are overridable*/}
const DropdownMenu = ({
    title,
    menuName,
    activeMenu,
    toggleMenu,
    children,
    containerStyle,
    buttonStyle,
    textStyle,
    menuStyle
}) => {
    const isOpen = activeMenu === menuName

    return (
        <View style = {[styles.container, containerStyle]}>
                <Text style = {[styles.text, textStyle]}>
                    {title}
                </Text>

            {isOpen && (
                <View style = {[styles.menu, menuStyle]}>
                    {children}
                </View>
            )}
        </View>
    )
}

export default DropdownMenu

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "stretch"
    },
    button: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 8
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97}]
    },
    text: {
        color: "white",
        fontSize: 16
    },
    menu: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        maxHeight: 250,
        overflow: "hidden",
        alignSelf: "stretch",
        }
})