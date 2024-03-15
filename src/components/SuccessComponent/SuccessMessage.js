import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const SuccessMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop:16
  },
  text: {
    color: '#ffffff',
    fontSize: 16
   
  },
});

export default SuccessMessage;
