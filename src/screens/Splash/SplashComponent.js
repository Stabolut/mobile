import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { COLORS, ENUMS, Images, THEME } from '../../common'; // Importing necessary constants and images
import AsyncStorage from '@react-native-community/async-storage'; // Importing AsyncStorage for storing data
import * as Animatable from "react-native-animatable"; // Importing Animatable for animations
import { get, saveString } from '../../utils/utils';
import { store } from '../../store';
import { setTheme, storeNetworkInfo } from '../../redux/action/wallet';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { networkConfig } from '../../common/NetworkConfig';

export default props => {
  const [loader, setLoader] = useState(false)
  const navigation = props?.navigation;
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)

  if (isEmpty(currentNetwork)) {
    store.dispatch(storeNetworkInfo(networkConfig.arbitrumSepolia))

  }
  const theme = THEME[selectedTheme];

  let setUpSplashTheme = async () => {
    let mood = await get('theme');

    if (mood === null) {
      store.dispatch(setTheme(ENUMS.THEME.DEFAULT))
      await saveString("theme", ENUMS.THEME.DEFAULT)


    }
    else {
      store.dispatch(setTheme(mood))
    }
    setLoader(true)

  }

  useEffect(() => {

    //setUpSplashTheme()
    // Using useEffect to run logic after the component has been rendered

    setTimeout(async () => {
      // Using setTimeout to introduce a delay before executing the logic

      setUpSplashTheme()

      let isPinAlreadySet = await AsyncStorage.getItem('PinSet'); // Getting the value of 'PinSet' from AsyncStorage
      let address = await AsyncStorage.getItem('address'); // Getting the value of 'address' from AsyncStorage
      console.log("isPinAlreadySet", isPinAlreadySet)

      if (isPinAlreadySet === 'true') {
        // If 'PinSet' is set to true

        if (address) {
          // If 'address' is available in AsyncStorage

          // Replace the current screen with the PIN code screen, passing parameters for navigation
          navigation.replace(`${ENUMS.SCREENS.PIN_CODE}`, {
            goToScreen: ENUMS.SCREENS.DASHBOARD, // The screen to navigate to after entering the PIN
            pinState: 'enter', // Indicates that the user needs to enter the PIN
          });
        } else {

          // If 'address' is not available in AsyncStorage

          // Replace the current screen with the PIN code screen, passing parameters for navigation
          navigation.replace(`${ENUMS.SCREENS.PIN_CODE}`, {
            goToScreen: ENUMS.SCREENS.INTRODUCTION_SLIDE, // The screen to navigate to after entering the PIN
            pinState: 'enter', // Indicates that the user needs to enter the PIN
          });
        }
      } else {
        // If 'PinSet' is not set to true

        // Replace the current screen with the introduction slide screen
        navigation?.replace(ENUMS.SCREENS.INTRODUCTION_SLIDE);
      }
    }, 1500); // Delay of 1500 milliseconds
  }, []); // Empty dependency array indicates this effect runs only once after the component mounts

  return (


    // Render the main container for the component
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>
      {/* Set the status bar color */}
      <StatusBar backgroundColor={COLORS.BACKGROUND_COLOR} />

      {/* Render the image with zoom-in animation */}
      <Animatable.View animation="zoomIn" duration={1500} style={{ flexDirection: "row" }}>
        <Image style={{ height: 200, width: 200, resizeMode: 'contain' }} source={Images.logoStablout}></Image>
      </Animatable.View>
    </SafeAreaView>


  );
};

// Styles for the component
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // Set background color
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});
