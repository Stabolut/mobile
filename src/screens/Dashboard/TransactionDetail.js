import React from 'react';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS,THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import { useSelector } from 'react-redux';
import { Text } from 'react-native';

function TransactionDetail(props) {
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
  const theme = THEME[selectedTheme];
  console.log("props.route.params.transactionHash",props.route.params.transactionHash, `${currentNetwork.explorerURL}/${props.route.params.transactionHash}`)

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
       
      />
      <Header
        backButton={true}
        headerText="Transaction Detail"
        theme={theme}
        navigation={props.navigation}></Header>
      
      <WebView
        source={{
          uri: `${currentNetwork.explorerURL}/${props.route.params.transactionHash}`,
        }}
      />
    </React.Fragment>
  );
}
export default TransactionDetail;


