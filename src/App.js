import React, { useEffect, useState, useRef, createContext } from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';

import Navigation from './navigation';
import Toast from 'react-native-easy-toast';
import DropDownHolder from './components/dropDownHolder';
import { COLORS, Str, Images } from './common';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { requestUserPermission, notificationListener } from './utils/NotiicationService';
import theme from './common/theme';
import { NotificationPermissionService } from './services/notificationPermissions';
export const SocketContext = createContext(null);



const App = () => {
  console.log("I am call")
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');



  useEffect(() => {
    // requestUserPermission()
    // notificationListener()
    showPermissionPrompt()
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

  const showPermissionPrompt = async () => {
    try {
      await NotificationPermissionService.initNotificationSystem();
    } catch (err) {
      console.error('❌ Error checking permission:', err);
    }
  };

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
        {/* <Toast
          style={{
            backgroundColor: COLORS.BLACK,
            paddingHorizontal: 20,
            paddingVertical: 18,
            marginHorizontal: 16,
            borderRadius: 8,
            minHeight: 60,
            width:"90%"
          }}
          position="top"
          fadeInDuration={300}
          fadeOutDuration={300}
          textStyle={{
            color: COLORS.WHITE,
            fontSize: 16,
            fontWeight: '600',
          }}
          ref={ref => DropDownHolder.setDropDown(ref)}
        /> */}
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
