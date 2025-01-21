import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import { COLORS, ENUMS, THEME } from '../../common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


let SCREEN_WIDTH = Dimensions.get('window').width;
let BUTTON_MARGIN = 8;
let ADDITIONAL_SPACE = 20; // Total additional space occupied by padding, border, etc.
let BUTTON_WIDTH = (SCREEN_WIDTH - (BUTTON_MARGIN * 5) - ADDITIONAL_SPACE) / 4; // Divide by 4 buttons and 5 margins

if (Platform.OS === "ios") {
    SCREEN_WIDTH = Dimensions.get('window').width;
    BUTTON_MARGIN = 8;
    ADDITIONAL_SPACE = 20; // Total additional space occupied by padding, border, etc.
    BUTTON_WIDTH = (SCREEN_WIDTH - (BUTTON_MARGIN * 4) - ADDITIONAL_SPACE) / 3; // Divide by 3 buttons and 4 margins

}

function SliderOption({ transfer, showKey, receive, purchase, selectedTheme,invites }) {
    const theme = THEME[selectedTheme];

    return (

        <View style={styles.sliderMainView}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}>

                <TouchableOpacity onPress={transfer} style={[styles.iconViewStyle,{borderColor: theme?.SLIDER_BORDER_COLOR,backgroundColor:selectedTheme===ENUMS.THEME.LIGHT?theme?.BALANCE_CARD_BACKGROUND:null}]}>

                    <Feather
                        name="send"
                        style={styles.iconDesign}
                      size={25}
                        color={theme?.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 0, color: theme?.WHITE, }]}>SEND</Text>
                    <Text style={[styles.textStyle, { marginTop: 0, color: theme?.WHITE, }]}>PAY</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={receive} style={[styles.iconViewStyle, { marginLeft: 8, borderColor: theme?.SLIDER_BORDER_COLOR,backgroundColor:selectedTheme===ENUMS.THEME.LIGHT?theme?.BALANCE_CARD_BACKGROUND:null }]}>
                    <FontAwesome
                        name="qrcode"
                        style={styles.iconDesign}
                        size={25}
                        color={theme?.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 0, color: theme?.WHITE, }]}>RECEIVE</Text>
                    <Text style={[styles.textStyle, { marginTop: 0, color: theme?.WHITE,}]}>GET PAID</Text>


                </TouchableOpacity>
                {
                    // Platform.OS === "ios" ? null :
                        <TouchableOpacity onPress={showKey} style={[styles.iconViewStyle, { marginLeft: 8, borderColor: theme?.SLIDER_BORDER_COLOR,backgroundColor:selectedTheme===ENUMS.THEME.LIGHT?theme?.BALANCE_CARD_BACKGROUND:null }]}>
                            <FontAwesome5
                                name="coins"
                                style={styles.iconDesign}
                                size={25}
                                color={theme?.WHITE}
                            />
                            <Text style={[styles.textStyle,{ color: theme?.WHITE}]}>Stake</Text>

                        </TouchableOpacity>
                }





                <TouchableOpacity onPress={purchase} style={[styles.iconViewStyle, { marginLeft: 8, borderColor: theme?.SLIDER_BORDER_COLOR,backgroundColor:selectedTheme===ENUMS.THEME.LIGHT?theme?.BALANCE_CARD_BACKGROUND:null }]}>
                    <Feather
                        name="settings"
                        style={[styles.iconDesign, {}]}
                        size={25}
                        color={theme?.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 4,color: theme?.WHITE }]}>Settings</Text>


                </TouchableOpacity>

                {/* <TouchableOpacity onPress={invites} style={[styles.iconViewStyle, { marginLeft: 8, borderColor: theme?.SLIDER_BORDER_COLOR,backgroundColor:selectedTheme===ENUMS.THEME.LIGHT?theme?.BALANCE_CARD_BACKGROUND:null }]}>
                    <Feather
                        name="user-plus"
                        style={[styles.iconDesign, {}]}
                        size={25}
                        color={theme?.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 4,color: theme?.WHITE }]}>Invites</Text>


                </TouchableOpacity> */}


            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    sliderMainView: {
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16
    },
    iconViewStyle: {

        width: BUTTON_WIDTH,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
       
        borderWidth: 2,

    },
    iconDesign: {
        fontWeight: "800"
    },
    textStyle: {
       
        fontSize: 12,
        marginTop: 6,
        fontFamily: "Poppins"
    },



});
export default SliderOption;