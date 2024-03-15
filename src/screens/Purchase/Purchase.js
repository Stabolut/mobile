import React from 'react';
import { StyleSheet, View, Text, Image, Animated, Easing } from 'react-native';
import { Str, Images, COLORS } from '../../common';

import Header from '../../components/Header/Header';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import { useNavigation } from '@react-navigation/native';
const Purchase = () => {
  const navigation = useNavigation();
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={COLORS.BACKGROUND_COLOR}
        barStyle="light-content"
      />
      <Header headerText="Purchase USB" navigation={navigation}></Header>

      <View style={styles.mainContainer}>
        <Animated.Image
          style={[styles.image, { transform: [{ rotate: spin }] }]}
          source={Images.rocket}
        />
        <Text style={styles.heading}>Coming Soon!!</Text>
        <Text style={styles.text}>Soon listed on Uniswap</Text>
      </View>


    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    padding:12
  },
  image: {
    width: 100,
    height: 100,
    resizeMode:"contain",
    marginBottom:30

   
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom:8,
    fontFamily:"Poppins"

  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily:"Poppins"

  },
});

export default Purchase;
