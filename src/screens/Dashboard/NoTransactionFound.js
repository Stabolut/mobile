import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../common';

function NoTransactionFound({ theme }) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme?.WHITE ? `${theme.WHITE}15` : 'rgba(255, 255, 255, 0.1)' }]}>
        <View style={styles.iconCircle}>
          <Text style={[styles.iconText, { color: theme?.WHITE }]}>📋</Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: theme?.WHITE }]}>
        No Transactions Yet
      </Text>
      
      <Text style={[styles.description, { color: theme?.WHITE }]}>
        Your transaction history will appear here{'\n'}
        once you make your first transaction
      </Text>
      
      <View style={[styles.decorativeLine, { backgroundColor: theme?.WHITE ? `${theme.WHITE}20` : 'rgba(255, 255, 255, 0.2)' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: 'Poppins',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: 32,
  },
  decorativeLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
});

export default NoTransactionFound;