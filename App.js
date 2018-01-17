import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fetchHotspots } from './src/api/services/hotspot';

export default class App extends React.Component {
  constructor() {
    super();

    this.grabThem = this.grabThem.bind(this);
  }
  grabThem() {
    fetchHotspots({ lat: -27.4658504, lng: 153.0261061 }).then(res =>
      console.log('Result is: ', res)
    );
  }

  componentDidMount() {
    this.grabThem();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
