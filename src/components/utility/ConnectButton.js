import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

class ConnectButton extends Component {
  render() {
    const { action, text, icon, colour } = this.props;

    return (
      <TouchableHighlight
        onPress={action}
        activeOpacity={1}
        underlayColor="transparent"
      >
        <View
          style={{
            backgroundColor: colour,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 20,
            width: 200,
          }}
        >
          <FontAwesome style={styles.icon}>{Icons[icon]}</FontAwesome>
          <Text style={styles.text}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

ConnectButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  action: PropTypes.func,
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
  icon: {
    color: '#fff',
    marginRight: 10,
  },
});

export default ConnectButton;
