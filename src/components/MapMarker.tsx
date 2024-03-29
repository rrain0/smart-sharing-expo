import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useThemeNew} from '@h';
import {NumFormat} from "@rrainpath/num-format";
import {sg} from "@u2/styleGlobal";
import {ThemeType} from "@t";
import {inf} from "@u2/utils";

const makeStyles = (theme: ThemeType, selected: boolean) => StyleSheet.create({
    priceView: {
        paddingHorizontal: 10, paddingVertical: 5,
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: selected ? theme.mainColors.accent2 : theme.mainColors.bgc0,


        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5

    },
    priceText: {
        fontFamily: theme.font.font.w600,
        color: theme.mainColors.onAccent0,
        fontSize: 12
    },
    circleView: {
        height: 10, width: 10,
        backgroundColor: theme.mainColors.accent2,
        borderRadius: inf,

        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5

    },
    shadowView: {

        height: 2,
        width: 2,
        borderRadius: 2,
        transform: [
            { scaleX: 4 }
        ],
        backgroundColor: theme.marker.shadowCircleColor,
        opacity: 0.25

    }
})


const f = new NumFormat().setFormat({
    intDelim: { delim: ' ', step: 3 },
    round: { mode: 'half-up', scale: 0 },
    suffix: ' ₽'
})

function MapMarker({ price, ids = [] as number[], selected = false }) {
    const { style: styles, themeObj: theme } = useThemeNew(theme => makeStyles(theme, selected), [selected])
    const priceF = f.setValue(price).format()

    return (
        <View style={sg.center}>
            <View style={styles.priceView}>
                <Text style={{
                        ...styles.priceText,
                        color: selected ? theme.marker.selected.textColor : theme.marker.textColor
                    }}
                >
                    {price ? ids.length > 1 ? `от ${priceF}` : `${priceF}` : 'Цена не указана'}
                </Text>
            </View>
            <View style={styles.circleView}/>
            <View style={styles.shadowView}/>
        </View>
    )
}

export { MapMarker };