import React, { useEffect, useState, useRef, createContext } from 'react';
import Navigation from './navigation';
import Toast from 'react-native-easy-toast';
import DropDownHolder from './components/dropDownHolder';
import { COLORS, Str, Images } from './common';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { persistor, store } from "./store";
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging'
import { PersistGate } from "redux-persist/integration/react";
import { requestUserPermission, notificationListener, createChannel } from './utils/NotiicationService';

//https://blog.logrocket.com/manage-notifications-react-native-notifications/
export const SocketContext = createContext(null);



const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');


  useEffect(() => {
    if (Platform.OS !== 'ios') {

      try {
        const unsubscribe = messaging().onMessage(async remoteMsg => {
          const channelId = Math.random().toString(36).substring(7)
          createChannel(channelId, { bigImage: remoteMsg.notification.android.imageUrl, title: remoteMsg.notification.title, message: remoteMsg.notification.body, subText: remoteMsg.data.subTitle })
        })
        messaging().setBackgroundMessageHandler(async remoteMsg => {
          const channelId = Math.random().toString(36).substring(7)
          createChannel(channelId, { bigImage: remoteMsg.notification.android.imageUrl, title: remoteMsg.notification.title, message: remoteMsg.notification.body, subText: remoteMsg.data.subTitle })

        })
        return unsubscribe

      }
      catch (e) {

      }
    }

    if (Platform.OS === 'ios') {
     
  

      requestUserPermission()
      notificationListener()
    }

  }, [])







  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(Str.socketUrl);
    socketRef.current.on('connect', () => {
      console.log('Socket connect');
      setSocketConnected(true);
      setConnectionStatus('connected');
    });
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnect');
      setConnectionStatus('error');
    });

    socketRef.current.on('connect_error', error => {
      console.log('Socket disconnect due to internet');
      setConnectionStatus('error');
    });

    return () => {

      setConnectionStatus('error');
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketContext.Provider
          value={{
            socket: socketRef.current,
            isSocketConnected: socketConnected,
            connectionStatus: connectionStatus,
          }}>
          <Navigation value={socketConnected}></Navigation>
        </SocketContext.Provider>
        <Toast
          style={{ backgroundColor: COLORS.BALANCE_CARD_BACKGROUND }}
          position="bottom"
          fadeInDuration={750}
          fadeOutDuration={700}
          textStyle={{ color: 'white' }}
          ref={ref => DropDownHolder.setDropDown(ref)}
        />
      </PersistGate>
    </Provider>
  );
};

export default App;
