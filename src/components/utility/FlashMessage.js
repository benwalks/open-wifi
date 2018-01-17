import React, { PropTypes } from 'react';
import Hyperlink from 'react-native-hyperlink';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import Card from './Card';

const FlashMessage = ({ close, heading, content, icon }) => (
  <Card>
    <View style={styles.container}>
      <View style={styles.headingWrap}>
        <Text style={styles.heading}>{heading}</Text>
        <TouchableHighlight onPress={close}>
          <FontAwesome style={styles.closeIcon}>{Icons.times}</FontAwesome>
        </TouchableHighlight>
      </View>
      <View style={styles.contentWrap}>
        <FontAwesome style={styles.mainIcon}>{Icons[icon]}</FontAwesome>
        <Hyperlink linkDefault>
          <Text style={styles.content}>{content}</Text>
        </Hyperlink>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 12,
  },
  closeIcon: {
    margin: 5,
    fontSize: 20,
    color: '#2C2C2C',
  },
  mainIcon: {
    margin: 5,
    fontSize: 42,
    color: '#9F9F9F',
  },
  headingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    color: '#CD5602',
    marginBottom: 6,
  },
  contentWrap: {
    flexDirection: 'row',
  },
  icon: {
    flex: 1,
  },
  content: {
    flex: 5,
    color: '#9F9F9F',
    marginLeft: 12,
  },
});

export default FlashMessage;
