import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
const listItem = (props) => (
    <TouchableOpacity onPress={props.onItemPressed}>
        <View style={styles.listItem}>
            <Image style={styles.placeImage} source={props.placeImage}/> 
            <Text>{props.placeName}</Text>
        </View>
    </TouchableOpacity>
);
const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        padding: 10,
        margin: 5,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center"
    },
    placeImage: {
        marginRight: 8,
        maxHeight: 30,
        width: 30,
        height: 30
    }
});
export default listItem;