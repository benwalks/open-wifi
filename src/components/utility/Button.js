import React, { PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const Button = ({ text, icon, colour, action }) => (
  <TouchableHighlight
    onPress={action}
    activeOpacity={1}
    underlayColor="transparent"
  >
    <View style={{ padding: 10 }}>
      <View
        style={{
          backgroundColor: colour,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          elevation: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOffset: { width: 10, height: 10 },
          shadowRadius: 3,
          width: 60,
          height: 60,
          borderRadius: 30,
        }}
      >
        <FontAwesome style={styles.icon}>{Icons[icon]}</FontAwesome>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
});

export default Button;
