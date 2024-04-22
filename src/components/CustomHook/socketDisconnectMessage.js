import React, {useEffect, useState} from 'react';

function socketDisconnectMessage(value) {
  useEffect(() => {
   
    if (value === 'error') {
      // alert(
      //   'We detected unstable internet. Restart app or internet for optimal experience.',
      // );
    }
  }, [value]);
}

export default socketDisconnectMessage;
