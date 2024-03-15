import {NavigationContainer} from '@react-navigation/native';
import CreateWallet from '../screens/Wallet/CreateWallet';
import Warning from '../screens/Wallet/CreateWalletWarningScreen';
import Receive from '../screens/Wallet/Receive';
import MnemoncisVerification from '../screens/Wallet/MnemoncisVerification';
import Transfer from '../screens/Wallet/Transfer';
import ImportWallet from '../screens/Wallet/ImportWallet';
import WebViewOpen from '../screens/Dashboard/TransactionDetail';
import Intro from '../screens/IntroductionSlide';
import Dashboard from '../screens/Dashboard';
import About from '../screens/Profile/About';
import Splash from '../screens/Splash/SplashComponent';
import Setting from '../screens/Profile/Setting';
import TransactionSuccess from '../screens/SucessScreen';
import PinCode from '../screens/PinCode';
import UpdatePin from '../screens/PinCode/UpdatePin';
import Bio from '../screens/Profile/Bio/Bio';
import
 MaterialCommunityIcons
from 'react-native-vector-icons/MaterialCommunityIcons';
import WebViewScreen from '../screens/Profile/Setting/WebViewScreen';
import {ENUMS} from '../common';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
    



      <Tab.Navigator
        initialRouteName={ENUMS.SCREENS.DASHBOARD}
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#42f44b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === ENUMS.SCREENS.CREATE_WALLET) {
              iconName = focused
                ? 'home-circle'
                : 'home-circle-outline';
            } else if (route.name === ENUMS.SCREENS.IMPORT_WALLET) {
              iconName = focused
                ? 'account-settings'
                : 'account-settings-outline';
            }
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        })}>
        <Tab.Screen
          name={ENUMS.SCREENS.CREATE_WALLET}
          component={CreateWallet}
          options={{
            tabBarLabel: 'Home',
            title: 'Home',
          }}  />
        <Tab.Screen
          name={ENUMS.SCREENS.IMPORT_WALLET}
          component={ImportWallet}
          options={{
            tabBarLabel: 'Settings',
            title: 'Setting'
          }} />
      </Tab.Navigator>















    </NavigationContainer>
  );
};

export default Navigation;
