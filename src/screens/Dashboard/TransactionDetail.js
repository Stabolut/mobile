import React from 'react';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header/Header';
import { COLORS } from '../../common';
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
          uri: `https://testnet.arbiscan.io/tx/${props.route.params.transactionHash}`,
        }}
      />
    </React.Fragment>
  );
}
export default TransactionDetail;


