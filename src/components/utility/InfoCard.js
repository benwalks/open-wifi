import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default ({ children }) => (
  <View style={styles.infoCard}>{children}</View>
);

const styles = StyleSheet.create({
  infoCard: {
    zIndex: 11,
    display: 'flex',
    alignContent: 'space-between',
    position: 'relative',
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 3,
  },
});
