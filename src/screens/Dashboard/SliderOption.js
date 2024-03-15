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
import { COLORS } from '../../common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


let SCREEN_WIDTH = Dimensions.get('window').width;
let BUTTON_MARGIN = 8;
let ADDITIONAL_SPACE = 20; // Total additional space occupied by padding, border, etc.
let  BUTTON_WIDTH = (SCREEN_WIDTH - (BUTTON_MARGIN * 5) - ADDITIONAL_SPACE) / 4; // Divide by 4 buttons and 5 margins

if (Platform.OS === "ios") {
    SCREEN_WIDTH = Dimensions.get('window').width;
    BUTTON_MARGIN = 8;
    ADDITIONAL_SPACE = 20; // Total additional space occupied by padding, border, etc.
    BUTTON_WIDTH = (SCREEN_WIDTH - (BUTTON_MARGIN * 4) - ADDITIONAL_SPACE) / 3; // Divide by 3 buttons and 4 margins

}

function SliderOption({ transfer, showKey, receive, purchase, balance }) {

    return (

        <View style={styles.sliderMainView}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}>

                <TouchableOpacity onPress={transfer} style={styles.iconViewStyle}>

                    <Feather
                        name="send"
                        style={styles.iconDesign}
                        size={25}
                        color={COLORS.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 0 }]}>SEND</Text>
                    <Text style={[styles.textStyle, { marginTop: 0 }]}>PAY</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={receive} style={[styles.iconViewStyle, { marginLeft: 8 }]}>
                    <FontAwesome
                        name="qrcode"
                        style={styles.iconDesign}
                        size={25}
                        color={COLORS.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 0 }]}>RECEIVE</Text>
                    <Text style={[styles.textStyle, { marginTop: 0 }]}>GET PAID</Text>


                </TouchableOpacity>
                {
                    Platform.OS === "ios" ? null :
                        <TouchableOpacity onPress={showKey} style={[styles.iconViewStyle, { marginLeft: 8 }]}>
                            <FontAwesome5
                                name="coins"
                                style={styles.iconDesign}
                                size={25}
                                color={COLORS.WHITE}
                            />
                            <Text style={styles.textStyle}>Stake</Text>

                        </TouchableOpacity>
                }





                <TouchableOpacity onPress={purchase} style={[styles.iconViewStyle, { marginLeft: 8 }]}>
                    <Feather
                        name="settings"
                        style={[styles.iconDesign, {}]}
                        size={25}
                        color={COLORS.WHITE}
                    />
                    <Text style={[styles.textStyle, { marginBottom: 4 }]}>Settings</Text>


                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    sliderMainView: {
        paddingLeft: 16, paddingRight: 16, justifyContent: "center", alignItems: "center", marginTop: 16
    },
    iconViewStyle: {

        // width: BUTTON_WIDTH,

        // height: 100,
        // padding: 8,
        // justifyContent: "center",
        // alignItems: "center",
        // borderRadius: 10,
        // borderColor: COLORS.SLIDER_BORDER_COLOR,
        // borderWidth: 2

        width: BUTTON_WIDTH,
        height: 100,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: COLORS.SLIDER_BORDER_COLOR,
        borderWidth: 2,

    },
    iconDesign: {
        fontWeight: "800"
    },
    textStyle: {
        color: COLORS.WHITE,
        fontSize: 12,
        marginTop: 6,
        fontFamily: "Poppins"
    },



});
export default SliderOption;