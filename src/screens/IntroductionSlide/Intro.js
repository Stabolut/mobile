import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity,Platform } from 'react-native';
import { COLORS, ENUMS, Images } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { store } from '../../store';
import { setPin } from '../../redux/action/auth';
// import PushNotification, { Importance } from 'react-native-push-notification'
let Intro = props => {
  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();
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

  return (
    <React.Fragment>

      <StatusBarNU
        backgroundColor={COLORS.BACKGROUND_COLOR}
        barStyle="light-content"
      />

      <View style={styles.mainContainer}>
        {/* {
          Platform.OS !== 'ios'? */}
        
        <View style={styles.mainContainerChild1}>
          <Carousel
            layout="tinder"
            ref={isCarousel}
            data={data}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            layoutCardOffset={9}
            onSnapToItem={index => setIndex(index)}
            useScrollView={true}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </View>
        {/* :null
} */}

        <View style={styles.mainContainerChild2}>
          <TouchableOpacity
            onPress={async () => {

              let isPinAlreadySet = await AsyncStorage.getItem('PinSet');
              if (isPinAlreadySet === 'true')
                navigation?.navigate(ENUMS.SCREENS.WARNING_SCREEN);
              else
                navigation?.navigate(ENUMS.SCREENS.PIN_CODE, {
                  goToScreen: ENUMS.SCREENS.WARNING_SCREEN,
                  pinState: 'choose',
                });
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
                navigation?.navigate(ENUMS.SCREENS.PIN_CODE, {
                  goToScreen: ENUMS.SCREENS.CHOOSE_IMPORT_OPTION,
                  pinState: 'choose',
                });
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            <Text style={styles.textAlreadyAccount}>
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
    backgroundColor: COLORS.BACKGROUND_COLOR,
    justifyContent:"flex-end"
  },
  mainContainerChild1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_COLOR,
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
    color: COLORS.WHITE,
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

    authState: state.authReducer.walletCreated,
    pinValue: state.authReducer.pinValue
  }
}
export default connect(mapStateToProps)(Intro);
