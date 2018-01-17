import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children }) => <View style={styles.card}>{children}</View>;

Card.propTypes = {
  children: PropTypes.element.isRequired,
};

const styles = StyleSheet.create({
  card: {
    zIndex: 10,
    flex: 1,
    width: 96 + '%',
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#fff',
    borderRadius: 3,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 3,
    margin: 8,
  },
});

export default Card;
