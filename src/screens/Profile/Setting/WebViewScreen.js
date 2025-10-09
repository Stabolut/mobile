import React from 'react';
import { WebView } from 'react-native-webview';
// import Header from '../../components/Header/Header';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
// import { COLORS } from '../../common';
import {COLORS,THEME} from "../../../common"
import { StyleSheet,View } from 'react-native';
import { useSelector } from 'react-redux';
// import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';

function WebViewScreen(props) {
    const selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];

    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}
               

            />

            <Header
                backButton={true}
                theme={theme}
                headerText={props.route.params.headerText}


                navigation={props.navigation}></Header>


            <View style={styles.mainContainer}>



                <WebView
                    source={{
                        uri: props.route.params.url,
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
export default WebViewScreen;
