import React, { useEffect, useState, useRef, createContext } from 'react';
import { useColorScheme } from 'react-native';
import Navigation from './navigation';
import Toast from 'react-native-easy-toast';
import DropDownHolder from './components/dropDownHolder';
import { COLORS, Str, Images } from './common';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { requestUserPermission, notificationListener } from './utils/NotiicationService';
export const SocketContext = createContext(null);



const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');



  useEffect(() => {
    requestUserPermission()
    notificationListener()
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
          <Navigation  value={socketConnected}></Navigation>
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
