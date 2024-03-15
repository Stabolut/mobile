import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';

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
                 backButton={false}
                headerText="About US"
                navigation={navigation}></Header>


            <View style={styles.mainContainer}>

                <ScrollView>

                    <Animatable.View animation="zoomInDown" style={{ backgroundColor: COLORS.APP_BLUE_COLOR, height: 200, flexDirection: "row" }}>
                        <View  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Image source={Images.about4} />
                            <Text style={{ color: COLORS.WHITE, fontWeight: "bold", fontSize: 18 }}>Bringing Freedom</Text>
                            <Text style={{ color: COLORS.WHITE, fontWeight: "bold", fontSize: 18 }}>to stablecoins</Text>
                        </View>
                        {/* <Image source={Images.about5}/> */}
                        <View style={{ flex: 1 }}>
                            <Image style={{ height: 230, width: 200 }} source={Images.about5} />
                        </View>


                    </Animatable.View>

                    <View style={{ paddingLeft: 32, marginTop: 16, paddingRight: 32, paddingTop: 32 }}>
                        <Animatable.View animation="fadeInUpBig" style={{ marginBottom: 32 }}>
                            <Text
                                style={styles.headingStyle}


                            >Instant cash flow.All day. Every day.</Text>
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


                            >Finance reimagined.</Text>
                            <Text style={styles.paragraphStyle}>
                            US₿ takes the abilities of cash to the next level. Unlock opportunities in crypto capital markets for trading, lending, borrowing, and fundraising with US₿ – accessible globally. The possibilities are just beginning.
                            </Text>


                            <View style={{ alignItems: "center", marginTop: 12 }}>
                                <Image style={styles.image} source={Images.about2}></Image>
                            </View>
                        </Animatable.View>


                        <View style={{ marginBottom: 32 }}>
                            <Text
                                style={styles.headingStyle}

                            >Private & Secure.</Text>
                            <Text style={styles.paragraphStyle}>
                                Only you can access your wallet. We don’t collect any personal data.
                            </Text>


                            <View style={{ alignItems: "center", marginTop: 12 }}>
                                <Image style={styles.image} source={Images.about3}></Image>
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
