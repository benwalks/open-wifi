import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';

export default () => (
  <Image style={styles.background} source={require('../../img/loadingbg.png')}>
    <Image style={styles.cquLogo} source={require('../../img/cqulogo.png')} />
    <Text style={styles.title}>Open WiFi</Text>
    <Text style={styles.subtitle}>
      Connecting Communities To Free Internet Services
    </Text>
    <Image style={styles.audaLogo} source={require('../../img/audalogo.png')} />
  </Image>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: undefined,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cquLogo: {
    marginTop: 60,
  },
  title: {
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  audaLogo: {
    marginTop: 'auto',
    marginBottom: 10,
  },
});
