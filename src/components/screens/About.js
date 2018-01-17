import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const Help = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View>
        <TouchableHighlight
          onPress={() => navigation.goBack()}
          underlayColor="transparent"
        >
          <View style={styles.backButton}>
            <FontAwesome style={{ marginRight: 5, fontSize: 20 }}>
              {Icons.chevronLeft}
            </FontAwesome>
            <Text>Back to Map</Text>
          </View>
        </TouchableHighlight>
      </View>
      <TouchableHighlight
        onPress={() => navigation.goBack()}
        underlayColor="transparent"
      >
        <FontAwesome style={{ fontSize: 20 }}>{Icons.close}</FontAwesome>
      </TouchableHighlight>
    </View>
    <View style={styles.helpWrapper}>
      <Text style={styles.title}>WiFi Help</Text>
      <View style={styles.helpInfo}>
        <Image
          source={require('../../img/wifiMarker.png')}
          style={styles.helpImage}
        />
        <View style={{ flexWrap: 'wrap', flex: 1 }}>
          <Text style={styles.helpInfoTitle}>Access Point</Text>
          <Text style={styles.helpInfoContent}>
            An access point is a location where you can connect to the internet
            for free. This symbol shows where they are on the map.
          </Text>
        </View>
      </View>
      <View style={styles.helpInfo}>
        <Image
          source={require('../../img/userposition.png')}
          style={styles.helpUserImage}
        />
        <View style={{ flexWrap: 'wrap', flex: 1 }}>
          <Text style={styles.helpInfoTitle}>Your Position</Text>
          <Text style={styles.helpInfoContent}>
            You can see where you are on the map with this symbol. When you
            move, the symbol will move as well.
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.infoWrapper}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.helpInfoContent}>
        The Open WiFi project is the result of a partnership between Central
        Queensland University and auDA, with the goal of providing free and
        accessible WiFi access to communities across Australia and the world. It
        is 100% open source.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 30,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
  },
  helpWrapper: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#979797',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#CD5602',
    textAlign: 'center',
  },
  helpInfo: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  helpImage: {
    height: 45,
    width: 45,
    marginRight: 10,
  },
  helpUserImage: {
    height: 30,
    width: 30,
    marginRight: 18,
    marginLeft: 7,
  },
  helpInfoTitle: {
    color: '#CD5602',
    fontWeight: '100',
  },
  helpInfoContent: {
    color: '#9F9F9F',
    fontSize: 10,
    flexWrap: 'wrap',
  },
  infoWrapper: {
    borderBottomWidth: 1,
    borderColor: '#979797',
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default Help;
