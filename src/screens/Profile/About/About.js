import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, ImageBackground } from 'react-native';

import Header from '../../../components/Header/Header';
import { COLORS, ENUMS, Images } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
// import AsyncStorage from '@react-native-community/async-storage';
// import { ViewPropTypes } from 'deprecated-react-native-prop-types';
// import PINCode from '@haskkor/react-native-pincode';
import * as Animatable from "react-native-animatable";


function About({ navigation }) {

    return (
        <React.Fragment>

            <StatusBarNU
                backgroundColor={COLORS.BACKGROUND_COLOR}
                barStyle="light-content"

            />
            <Header
                backButton={true}
                headerText="About US"
                navigation={navigation}></Header>


            <View style={styles.mainContainer}>

                <ScrollView>


                    <View style={{ height: 320, flexDirection: "row" }}>
                        <ImageBackground

                            source={Images.slider}
                            style={{ resizeMode: "cover", flex: 1 }}
                        >
                            <Image style={{ width: 170, height: 100, resizeMode: "contain", marginTop: 10 }} source={Images.logoWhite1} />
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18, paddingLeft: 32,paddingRight:32 }}>Unlock Financial
                                Freedom with USB,
                                The Most
                                Decentralized Stablecoin
                            </Text>

                        </ImageBackground>
                    </View>



                    {/* <Animatable.View animation="zoomInDown" style={{ backgroundColor: COLORS.WHITE, height: 200, flexDirection: "row" }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Image source={Images.about4} />
                            <Text style={{ color: COLORS.WHITE, fontWeight: "bold", fontSize: 18,backgroundColor:"red" }}>Unlock Financial
                                Freedom with USB,</Text>
                            <Text style={{ color: COLORS.WHITE, fontWeight: "bold", fontSize: 18 }}>The Most
                                Decentralized Stablecoin</Text>
                        </View>
                       
                        <View style={{ flex: 1, }}>
                            <Image style={{ height: 230, width: 200 }} source={Images.slider} />
                        </View>


                    </Animatable.View> */}

                    <View style={{ paddingLeft: 32, marginTop: 16, paddingRight: 32 }}>
                        <Animatable.View animation="fadeInUpBig" style={{ marginBottom: 32 }}>
                            <Text
                                style={styles.headingStyle}


                            >Meet USB.</Text>
                            <Text style={styles.paragraphStyle}>
                                Crypto stands for freedom. We are introducing a revolutionary decentralized stablecoin for the freedom we need. Meet a Bitcoin-backed stablecoin with an easy-to-use complete ecosystem for transactions reshaping the financial world.
                            </Text>


                            <View style={{ alignItems: "center", marginTop: 12 }}>
                                <Image style={styles.image} source={Images.about1}></Image>
                            </View>
                        </Animatable.View>


                        <Animatable.View animation="fadeInLeft" style={{ marginBottom: 32 }}>
                            <Text
                                style={styles.headingStyle}


                            >Stablecoin building: a new approach</Text>
                            <Text style={styles.paragraphStyle}>
                                USB is a Bitcoin-backed stablecoin designed to reﬂect the value of the US Dollar through an innovative method: shorting Bitcoin. We eliminate the need for bank accounts, ensuring immunity from crackdowns or frozen funds, and bolstering complete privacy and resilience. USB is what the crypto market was asking for: a truly decentralized stablecoin.
                            </Text>


                            <View style={{ alignItems: "center", marginTop: 12 }}>
                                <Image style={[styles.image]} source={Images.about2}></Image>
                            </View>
                        </Animatable.View>


                        <View style={{ marginBottom: 32 }}>
                            <Text
                                style={styles.headingStyle}

                            >Transparent. Private. Safe.</Text>
                            <Text style={styles.paragraphStyle}>
                                USB provides the groundwork for a more transparent, resilient, privacy preserving and open ﬁnancial infrastructure.
                            </Text>


                            <View style={{ alignItems: "center", marginTop: 12 }}>
                                <Image style={[styles.image]} source={Images.about3}></Image>
                            </View>
                        </View>



                    </View>








                </ScrollView>


            </View>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR
    },
    image: {
        width: 300,
        height: 200,
        resizeMode: 'contain'
    },
    headingStyle: {
        color: COLORS.APP_HEADING_TEXT_COLOR_BALCK,
        fontSize: 18,
        fontFamily: 'Poppins',

        fontWeight: "500"
    },
    paragraphStyle: {
        marginTop: 8,
        color: COLORS.BLACK,
        opacity: 0.6,
        fontSize: 12,
        fontFamily: 'Poppins',
    }

});

export default About;
