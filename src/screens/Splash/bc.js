import React, {useEffect} from 'react';
import {Image, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {COLORS, ENUMS, Images} from '../../common';
import AsyncStorage from '@react-native-community/async-storage';

export default props => {
  const navigation = props?.navigation;

  useEffect(() => {
    setTimeout(async () => {
      let isPinAlreadySet = await AsyncStorage.getItem('PinSet');
      let address = await AsyncStorage.getItem('address');

      if (isPinAlreadySet === 'true') {
        if (address) {
          navigation.replace(`${ENUMS.SCREENS.PIN_CODE}`, {
            goToScreen: ENUMS.SCREENS.DASHBOARD,
            pinState: 'enter',
          });
        } else {
          navigation.replace(`${ENUMS.SCREENS.PIN_CODE}`, {
            goToScreen: ENUMS.SCREENS.INTRODUCTION_SLIDE,
            pinState: 'enter',
          });
        }
      } else {
        navigation?.replace(ENUMS.SCREENS.INTRODUCTION_SLIDE);
      }
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor={COLORS.BACKGROUND_COLOR} />

      <Animatable.View animation="zoomIn" duration={1500} style={{ flexDirection: "row" }}>
        <Image style={{ height: 50, width: 50, resizeMode: 'contain', marginTop: 48 }} source={Images.usdbLogo}></Image>
        <Image style={{ height: 150, width: 120, resizeMode: 'cover', }} source={Images.logoStablout}></Image>

      </Animatable.View>


    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.SPLASH_COLOR_CODE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});