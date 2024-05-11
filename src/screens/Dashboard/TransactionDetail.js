import React from 'react';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS,THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import { useSelector } from 'react-redux';

function TransactionDetail(props) {
  let selectedTheme = useSelector((state) => state.authReducer.theme)
  const theme = THEME[selectedTheme];

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
          uri: `${ENUMS.EXTERNAL_URL.EXPLORER_URL}/${props.route.params.transactionHash}`,
        }}
      />
    </React.Fragment>
  );
}
export default TransactionDetail;


