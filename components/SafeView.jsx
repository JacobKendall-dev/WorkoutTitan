import { useSafeAreaInsets } from "react-native-safe-area-context";
import {  View  } from "react-native";

const SafeView = ({ style, safe = false, ...props}) => {


    if (!safe) return (
        <View
            style={[style]}
            {...props}
        />
    )

    const insets = useSafeAreaInsets()

    return (
     <View
        style={[{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }, style]}
        {...props}
     />
    )

}

export default SafeView