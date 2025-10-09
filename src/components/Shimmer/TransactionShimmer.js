import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../../common';

const { width } = Dimensions.get('window');

function TransactionShimmer({ selectedTheme }) {
  const theme = THEME[selectedTheme];
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1500,
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
      outputRange: [0.2, 0.8],
    }),
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.transactionItem}>
          {/* Left side - Transaction type badge and status circle */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Transaction type badge */}
              <Animated.View style={[styles.transactionBadgeShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
              {/* Status circle */}
              <Animated.View style={[styles.statusCircleShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
            </View>
            
            {/* Transaction status text */}
            <Animated.View style={[styles.statusTextShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
            
            {/* From/To address text */}
            <Animated.View style={[styles.addressTextShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
          </View>

          {/* Right side - Amount and arrow icon */}
          <View style={styles.rightSection}>
            <View style={styles.amountRow}>
              <Animated.View style={[styles.amountShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
              <Animated.View style={[styles.arrowIconShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
            </View>
            <Animated.View style={[styles.timestampShimmer, { backgroundColor: theme?.PRIMARY_COLOR || '#4d6ce0' }, shimmerStyle]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  transactionBadgeShimmer: {
    height: 30,
    width: 80,
    borderRadius: 15,
    marginRight: 8,
  },
  statusCircleShimmer: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  statusTextShimmer: {
    height: 14,
    width: 80,
    borderRadius: 7,
    marginTop: 16,
    marginBottom: 12,
  },
  addressTextShimmer: {
    height: 12,
    width: width * 0.6,
    borderRadius: 6,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  amountShimmer: {
    height: 16,
    width: 80,
    borderRadius: 8,
  },
  arrowIconShimmer: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginLeft: 8,
  },
  timestampShimmer: {
    height: 14,
    width: 60,
    borderRadius: 7,
    marginTop: 16,
  },
});

export default TransactionShimmer;