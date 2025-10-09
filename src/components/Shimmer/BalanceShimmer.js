import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../common';

function BalanceShimmer({ selectedTheme }) {
  const theme = THEME[selectedTheme];
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    startShimmer();
  }, [shimmerAnimation]);

  const shimmerStyle = {
    opacity: shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <View style={[styles.mainView]}>
      <View style={[styles.balanceCardMainViewStyle, {
        backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
        borderTopColor: theme?.BALANCE_CARD_UPPER_BORDER,
      }]}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "flex-end", paddingLeft: 24 }}>
              <Animated.View style={[styles.shimmerBox, { backgroundColor: theme?.WHITE }, shimmerStyle]} />
            </View>
            {/* <View style={{ backgroundColor: "red", padding: 4, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Animated.View style={[styles.shimmerBoxSmall, { backgroundColor: theme?.WHITE }, shimmerStyle]} />
            </View> */}
          </View>

          <View style={{ paddingLeft: 24, marginTop: 10 }}>
            <Animated.View style={[styles.shimmerBoxLarge, { backgroundColor: theme?.WHITE }, shimmerStyle]} />
          </View>

          <View style={{ flexDirection: "row", marginTop: 12, paddingLeft: 24, paddingRight: 24, paddingBottom: 8 }}>
            <View style={{ flex: 80 }}>
              <Animated.View style={[styles.shimmerBoxMedium, { backgroundColor: theme?.WHITE }, shimmerStyle]} />
            </View>
            <View style={{ flex: 10 }}>
              <Animated.View style={[styles.shimmerBoxSmall, { backgroundColor: theme?.WHITE }, shimmerStyle]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
  },
  balanceCardMainViewStyle: {
    width: "100%",
    marginTop: 16,
    borderRadius: 10,
    borderTopWidth: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
  },
  shimmerBox: {
    height: 12,
    width: 60,
    borderRadius: 6,
  },
  shimmerBoxSmall: {
    height: 12,
    width: 40,
    borderRadius: 6,
  },
  shimmerBoxMedium: {
    height: 12,
    width: 200,
    borderRadius: 6,
  },
  shimmerBoxLarge: {
    height: 30,
    width: 150,
    borderRadius: 6,
  },
});

export default BalanceShimmer;