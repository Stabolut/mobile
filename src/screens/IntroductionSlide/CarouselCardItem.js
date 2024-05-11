import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {COLORS} from '../../common';
export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({item, index,theme}) => {
  console.log("theme?.",theme)
  return (
    <View style={[styles.container,{ backgroundColor: theme?.BACKGROUND_COLOR}]} key={index}>
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={item.imgUrl}></Image>
        <Text style={[styles.header,{ color: theme?.SMALL_HEADING_TEXT}]}>{item.title}</Text>
        <Text style={[styles.body,{ color: theme?.SMALL_HEADING_TEXT,}]}>{item.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
   
  },

  innerContainer: {
    width: '100%',
    height: '85%',
justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 190,
    height: 190,
  },
  header: {
   
    fontSize: 28,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Poppins',
  },
  body: {

    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});

export default CarouselCardItem;
