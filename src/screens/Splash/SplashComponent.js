import React, { useEffect } from 'react';
import { Image, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { COLORS, ENUMS, Images } from '../../common'; // Importing necessary constants and images
import AsyncStorage from '@react-native-community/async-storage'; // Importing AsyncStorage for storing data
import * as Animatable from "react-native-animatable"; // Importing Animatable for animations

export default props => {
  const navigation = props?.navigation;

  useEffect(() => {
    // Using useEffect to run logic after the component has been rendered

    setTimeout(async () => {
      // Using setTimeout to introduce a delay before executing the logic
      
      let isPinAlreadySet = await AsyncStorage.getItem('PinSet'); // Getting the value of 'PinSet' from AsyncStorage
      let address = await AsyncStorage.getItem('address'); // Getting the value of 'address' from AsyncStorage

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
    <SafeAreaView style={styles.mainContainer}>
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
    backgroundColor: COLORS.BACKGROUND_COLOR, // Set background color
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});
