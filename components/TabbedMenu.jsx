import React, {useState} from "react"
import {View, Pressable, Text, StyleSheet, FlatList, Image} from "react-native"


import DropdownMenu from "../components/DropdownMenu"


const TabbedMenu = ({ tabs, data, columns}) => {
    const[activeTab, setActiveTab] = useState(tabs[0])


    const activeIndex = tabs.indexOf(activeTab)

    const currentData = data[activeIndex]
    const currentColumns = columns?.[activeIndex]

    return (
        <View style = {styles.card}>

        {/*Tab Bar*/}
          <View style = {styles.tabRow}>
            {tabs.map((tab) => (
            <Pressable
            key = {tab}
            style = {[styles.tab,
                activeTab === tab && styles.activeTab
            ]}
            onPress = {() => setActiveTab(tab)}
            >
                <Text style = {styles.tabTitle}>{tab}</Text>
            </Pressable>
        ))}
          </View>


        {/*Data Rows*/}
        <FlatList
        data = {currentData}
        extraData = {activeTab}
        keyExtractor = {(item) => item.id}
        style = {styles.dataTable}
        renderItem = {({item}) =>
            <View style = {styles.dataRow}>
                <View style = {{ flexDirection:"row", justifyContent: "space-between"}}>
                    {currentColumns?.map((col, index) => {
                        const value = item[col]

                        {/*Image Render*/}
                        if (typeof value === "number"||
                            (typeof value === "object" && value?.uri)
                        ) {
                            return(
                                <Image
                                key={index}
                                source={value}
                                style={{width: 30, height: 30, flex: 1}}
                                />
                            )
                        }
                        
                        {/*Text Render*/}
                        return (
                        <Text key ={index} style = {[styles.dataText, {flex: 1}]}>
                            {value}
                        </Text>
                        )
        })}
                </View>
            </View>
        }
        />
        </View>
    )
}

export default TabbedMenu;

const styles = StyleSheet.create({
    card: {
        width : "100%",
        backgroundColor:"#fff",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {width: 0, height: 2},
    },
    tab: {
        flex: 1, 
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 3,
        shadowOffset: {width: 0, height: 1},
        elevation: 2,
    },
    tabRow: {
        flexDirection: "row",
        backgroundColor: "#f1f3f5",
        borderRadius: 10,
        padding: 4,
        marginBottom: 10,
    },
    tabTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
    },
    dataTable: {
        marginTop: 4,
    },
    dataRow: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dataText: {
        fontSize: 16,
        color: "#222",
    },
})