// Create a new component: src/components/InfoBox/InfoBox.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InfoBox = ({ message, type = 'info' }) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert-circle';
      case 'error':
        return 'close-circle';
      default:
        return 'information';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#40C16C';
      case 'warning':
        return '#f4cb3b';
      case 'error':
        return '#EA5768';
      default:
        return '#1F62C6';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(64, 193, 108, 0.1)';
      case 'warning':
        return 'rgba(244, 203, 59, 0.1)';
      case 'error':
        return 'rgba(234, 87, 104, 0.1)';
      default:
        return 'rgba(31, 98, 198, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(64, 193, 108, 0.3)';
      case 'warning':
        return 'rgba(244, 203, 59, 0.3)';
      case 'error':
        return 'rgba(234, 87, 104, 0.3)';
      default:
        return 'rgba(31, 98, 198, 0.3)';
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor()
    }]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={getIconName()} 
          size={20} 
          color={getIconColor()} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 98, 198, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(31, 98, 198, 0.3)',
    borderRadius: 12,
    padding: 16,
   // marginBottom: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#c9c9e6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default InfoBox;