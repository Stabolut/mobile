import React from 'react';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS } from '../../common';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';

function TransactionDetail(props) {

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={COLORS.APP_BLUE_COLOR}
        barStyle="light-content"
      />
      <Header
        backButton={true}
        headerText="Transaction Detail"
        navigation={props.navigation}></Header>
      

      <WebView
        source={{
          uri: `${ENUMS.EXTERNAL_URL.EXPLORER_URL}/${props.route.params.transactionHash}`,
        }}
      />
    </React.Fragment>
  );
}
export default TransactionDetail;


