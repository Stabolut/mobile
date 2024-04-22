

import React from 'react';
import { WebView } from 'react-native-webview';
// import Header from '../../components/Header/Header';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
// import { COLORS } from '../../common';
import { COLORS,ENUMS } from "../../../common"
import { Text, StyleSheet, View } from 'react-native';


// import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';

function Bio(props) {

    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={COLORS.BACKGROUND_COLOR}
                barStyle="light-content"

            />

            <Header
                 backButton={true}
                headerText="News"
                navigation={props.navigation}
            ></Header>
           


            <View style={styles.mainContainer}>



                <WebView
                    source={{
                        uri:ENUMS.EXTERNAL_URL.NEWS
                    }}
                />


            </View>
        </React.Fragment>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_COLOR,
    },

});
export default Bio;

