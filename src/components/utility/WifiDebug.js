import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const WifiDebug = ({ availHotspots }) => {
  return availHotspots.length > 1 ? (
    <View style={styles.container}>
      {availHotspots.map(a => (
        <View key={a.BSSID} style={styles.row}>
          <Text>{a.SSID}</Text>
          <Text>{a.BSSID}</Text>
          <Text>{a.capabilities}</Text>
          <Text>{a.level}</Text>
        </View>
      ))}
    </View>
  ) : null;
};

export default WifiDebug;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 3 + '%',
    width: 96 + '%',
    backgroundColor: 'transparent',
  },
  row: {
    display: 'flex',
  },
});
