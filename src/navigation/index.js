import {
  NavigationContainer, DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import CreateWallet from '../screens/Wallet/CreateWallet';
import Warning from '../screens/Wallet/CreateWalletWarningScreen';
import Receive from '../screens/Wallet/Receive';
import MnemoncisVerification from '../screens/Wallet/MnemoncisVerification';
import Transfer from '../screens/Wallet/Transfer';

import WebViewOpen from '../screens/Dashboard/TransactionDetail';
import Intro from '../screens/IntroductionSlide';
import Dashboard from '../screens/Dashboard';
import About from '../screens/Profile/About';
import Splash from '../screens/Splash/SplashComponent';
import Setting from '../screens/Profile/Setting';
import TransactionSuccess from '../screens/SucessScreen';
import PinCode from '../screens/PinCode';
import UpdatePin from '../screens/PinCode/UpdatePin';
import AllTransaction from '../screens/Dashboard/ViewAllTransaction';
import Bio from '../screens/Profile/Bio/Bio';
import { AddContact, ShowContact } from '../screens/ContactList';
// import ImportWithPrivateKey from '../screens/Wallet/ImportWalletScreens/ImportWithPrivateKey';
import ImportWithPrivateKey from '../screens/Wallet/ImportWalletScreens/ImportWithPrivateKey/ImportWithPrivateKey';
import ImportWallet from '../screens/Wallet/ImportWalletScreens/ImportWalletWithMnemonics/ImportWallet';
import ChooseImportOption from '../screens/Wallet/ImportWalletScreens/ChooseImportOption/ChooseImportOption';
import Purchase from '../screens/Purchase/Purchase';
import Stake from '../screens/Stake';
import AddStake from '../screens/Stake/AddStake';
import { useState,useEffect,useContext } from 'react';
import WebViewScreen from '../screens/Profile/Setting/WebViewScreen';
import { ENUMS } from '../common';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { get } from '../utils/utils';
import LeaderBoard from '../screens/LeaderBoard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const ThemeContext = React.createContext()
function TabNav() {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      lazy={true}>
      <Stack.Screen
        name={ENUMS.SCREENS.SPLASH}
        component={Splash}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ENUMS.SCREENS.TRANSACTION_DETAIL}
        component={WebViewOpen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ENUMS.SCREENS.WEB_VIEW}
        component={WebViewScreen}
        options={{ gestureEnabled: false }}
      />
      {/* <Stack.Screen name={ENUMS.SCREENS.DASHBOARD} component={BottomNav} /> */}
      <Stack.Screen  name={ENUMS.SCREENS.DASHBOARD} component={Dashboard} />
      <Stack.Screen name={ENUMS.SCREENS.SETTING} component={Setting} />
      <Stack.Screen name={ENUMS.SCREENS.STAKE} component={Stake} />

      <Stack.Screen name={ENUMS.SCREENS.BIO} component={Bio} />
      <Stack.Screen name={ENUMS.SCREENS.LEADERBOARD} component={LeaderBoard} />

      <Stack.Screen name={ENUMS.SCREENS.ABOUT} component={About} />
      <Stack.Screen name={ENUMS.SCREENS.SHOW_CONTACT_LIST} component={ShowContact} />
      <Stack.Screen name={ENUMS.SCREENS.ADD_CONTACT_LIST} component={AddContact} />
      <Stack.Screen name={ENUMS.SCREENS.ADD_STAKE} component={AddStake} />





      <Stack.Screen name={ENUMS.SCREENS.UPDATE_PIN} component={UpdatePin} />
      <Stack.Screen name={ENUMS.SCREENS.ALL_TRANSACTION} component={AllTransaction} />
      <Stack.Screen name={ENUMS.SCREENS.IMPORT_WALLET_PRIVATE_KEY} component={ImportWithPrivateKey} />
      <Stack.Screen name={ENUMS.SCREENS.PURCHASE} component={Purchase} />
      <Stack.Screen
        name={ENUMS.SCREENS.TRANSFER}
        component={Transfer}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ENUMS.SCREENS.RECEIVE}
        component={Receive}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ENUMS.SCREENS.SUCCESS}
        component={TransactionSuccess}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        name={ENUMS.SCREENS.INTRODUCTION_SLIDE}
        component={Intro}
      />
      <Stack.Screen name={ENUMS.SCREENS.PIN_CODE} component={PinCode} />

      <Stack.Screen
        name={ENUMS.SCREENS.IMPORT_WALLET}
        component={ImportWallet}
      />

      <Stack.Screen name={ENUMS.SCREENS.WARNING_SCREEN} component={Warning} />

      <Stack.Screen
        name={ENUMS.SCREENS.CREATE_WALLET}
        component={CreateWallet}
      />

      <Stack.Screen
        name={ENUMS.SCREENS.CHOOSE_IMPORT_OPTION}
        component={ChooseImportOption}
      />


      <Stack.Screen
        name={ENUMS.SCREENS.MNEMONICS_VERIFICATION}
        component={MnemoncisVerification}
      />
    </Stack.Navigator>
  )



}





const Navigation = () => {

  const [theme, setTheme] = useState();
  useEffect(() => {
    get("theme").then(theme => {
      setTheme(theme)

    })


    // Load theme from AsyncStorage (or set a default theme)

  }, []);

  return (

    <NavigationContainer>
      <ThemeContext.Provider value={theme}>
        <TabNav></TabNav>
      </ThemeContext.Provider>

    </NavigationContainer>

  );
};

export default Navigation;