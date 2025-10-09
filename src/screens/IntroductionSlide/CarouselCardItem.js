import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { COLORS } from '../../common';

const { width: screenWidth } = Dimensions.get('window');

const CarouselCardItem = ({ item, index, theme }) => {

  return (
    <View style={[styles.container, { backgroundColor: theme?.BACKGROUND_COLOR }]} key={index}>
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={item.imgUrl} />
        <Text style={[styles.header, { color: theme?.SMALL_HEADING_TEXT }]}>{item.title}</Text>
        <Text style={[styles.body, { color: theme?.SMALL_HEADING_TEXT }]}>{item.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // width: screenWidth - 40, // Add margin to prevent edge bleeding
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',

  },

  innerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4, // Add padding for text content

  },
  image: {
    width: 190,
    height: 160,
    resizeMode: 'contain', // Ensure image fits properly
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Poppins',
    paddingHorizontal: 8, // Add padding for text
  },
  body: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins',
    paddingHorizontal: 10, // Add padding for text
    lineHeight: 22, // Better line spacing
  },
});

export default CarouselCardItem;
