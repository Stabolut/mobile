import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { COLORS, ENUMS, Images } from '../../common';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from "react-native-animatable";
export default props => {
  const navigation = props?.navigation;
  // const [fadeAnim,setFadeAnim]  = useState(new Animated.Value(0))

  // useEffect(()=>{
  //   Animated.timing(
  //     fadeAnim,
  //     {
  //       toValue: 1,
  //       duration: 2000,
  //       useNativeDriver: true,
  //     },
  //   ).start();
  // })


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
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor={COLORS.BACKGROUND_COLOR} />
      <Animatable.View animation="zoomIn" duration={1500} style={{ flexDirection: "row" }}>

        <Image style={{ height: 200, width: 200, resizeMode: 'contain' }} source={Images.logoStablout}></Image>


      </Animatable.View>


    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});