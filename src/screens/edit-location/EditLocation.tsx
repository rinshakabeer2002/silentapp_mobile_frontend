import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const EditLocation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Edit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
  },
});
