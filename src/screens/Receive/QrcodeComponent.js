import React, { forwardRef } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrcodeComponent = forwardRef((props, ref) => {
  const { value } = props;

  return (
    <View>
      <QRCode value={value} ref={ref} />
    </View>
  );
});

export default QrcodeComponent;
