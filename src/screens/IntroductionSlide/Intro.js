import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { COLORS, ENUMS, Images, THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import CarouselCardItem from './CarouselCardItem';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, useSelector } from 'react-redux';
import { useSharedValue } from 'react-native-reanimated';
import { getStableDeviceId } from '../../utils/deviceIdentity';

const width = Dimensions.get('window').width;

let Intro = props => {
  const ref = React.useRef(null);
  const progress = useSharedValue(0);
  const navigation = useNavigation();
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  const theme = THEME[selectedTheme];

  let data = [
    {
      title: 'Truly Gasless Transactions',
      body: 'Users can transact their US₿ token without paying gas over the network in native coin.',
      imgUrl: Images.frame2,
    },
    {
      title: 'Private and Secure',
      body: 'Private keys never leave your device',
      imgUrl: Images.frame4,
    },
    {
      title: 'Bitcoin-backed Token',
      body: 'USB maintains the peg to 1 USD value by using perpetual shorts on Bitcoin which means you are safe from volatility',
      imgUrl: Images.frame3,
    },
  ];

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
      />

      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
        <View style={[styles.mainContainerChild1, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
          <Carousel
            ref={ref}
            width={width}
            height={width * 0.8}
            data={data}
            onProgressChange={progress}
            renderItem={({ item, index }) => (
              <CarouselCardItem
                item={item}
                index={index}
                theme={theme}
                extraProp="value"
              />
            )}
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: 'left',
              stackInterval: 18,
            }}
            style={{
              width: width,
              height: width * 0.8,
            }}
            customConfig={() => ({ type: 'positive', viewCount: 1 })}
            pagingEnabled={true}
            snapEnabled={true}
          />

          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: "#9e9e9e"
            }}
            activeDotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: COLORS?.BTN_BACKGROUND_COLOR, // active dot
            }}

            containerStyle={{
              gap: 5,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={onPressPagination}
          />
        </View>

        <View style={styles.mainContainerChild2}>
          <TouchableOpacity
            onPress={async () => {
              console.log("presssksks")
              try {
              
                let isPinAlreadySet = await AsyncStorage.getItem('PinSet');
                console.log("isPinAlreadySet", isPinAlreadySet)
                if (isPinAlreadySet === 'true')
                  navigation?.navigate(ENUMS.SCREENS.WARNING_SCREEN);
                else
                  // navigation?.navigate(ENUMS.SCREENS.PIN_CODE, {
                  //   goToScreen: ENUMS.SCREENS.WARNING_SCREEN,
                  //   pinState: 'choose',
                  // });
                  navigation?.navigate(ENUMS.SCREENS.WARNING_SCREEN);   
              }
              catch (e) {
                console.log("dddd", e)
              }

            }}
            style={styles.btnStyleCreateWallet}>
            <Text style={styles.textStyleCreateWallet}>
              CREATE A NEW WALLET
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              let isPinAlreadySet = await AsyncStorage.getItem('PinSet');

              if (isPinAlreadySet === 'true')
                navigation?.navigate(ENUMS.SCREENS.CHOOSE_IMPORT_OPTION);
              else
                // navigation?.navigate(ENUMS.SCREENS.PIN_CODE, {
                //   goToScreen: ENUMS.SCREENS.CHOOSE_IMPORT_OPTION,
                //   pinState: 'choose',
                // });
                navigation?.navigate(ENUMS.SCREENS.CHOOSE_IMPORT_OPTION);
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            <Text style={[styles.textAlreadyAccount, { color: theme?.WHITE }]}>
              I already have a wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  mainContainerChild1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainContainerChild1View1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  mainContainerChild1View1Text_1: {
    fontFamily: 'Open-Sans',
    fontSize: 22,
    color: COLORS.APP_HEADING_TEXT_COLOR_BALCK,
  },
  mainContainerChild1View1Text_2: {
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.APP_NORMAL_TEXT_COLOR_BALCK,
  },

  mainContainerChild1View2: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },

  mainContainerChild1View2View1: {
    padding: 8,
    marginRight: 8,
    marginBottom: 12,
    textAlign: 'center',
    borderRadius: 3,
    borderColor: COLORS.APP_NORMAL_TEXT_COLOR_BALCK,
    borderWidth: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainerChild2: {
    marginBottom: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },

  btnStyleCreateWallet: {
    height: 50,
    width: '100%',
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.WHITE,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textAlreadyAccount: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },

  textStyleCreateWallet: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: 'Poppins',
  },

});

const mapStateToProps = state => {
  return {
    authState: state.walletReducer.walletCreated,
    pinValue: state.walletReducer.pinValue
  }
}

export default connect(mapStateToProps)(Intro);
